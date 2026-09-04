import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 15_000;
const MAX_CHARS = 800;

export async function POST(request: NextRequest) {
  const serviceUrl = (process.env.TTS_SERVICE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
  const apiKey = process.env.TTS_SERVICE_API_KEY || "local_offline_key";


  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return NextResponse.json({ error: "Request must contain JSON." }, { status: 400 });
  }

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Text cannot be empty." }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `Text must be ${MAX_CHARS} characters or fewer.` },
      { status: 400 },
    );
  }

  const textStr = text.trim();

  // Create hash for caching
  const hash = crypto.createHash("md5").update(textStr).digest("hex");
  const cacheDir = path.join(process.cwd(), "public", "audio_cache");
  const cacheFile = path.join(cacheDir, `${hash}.wav`);

  try {
    const cachedData = await fs.readFile(cacheFile);
    console.log(`TTS Cache HIT: ${hash}.wav`);
    return new NextResponse(cachedData, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch {
    // Cache miss, proceed to generate
    console.log(`TTS Cache MISS: ${hash}.wav`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(`${serviceUrl}/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ text: text.trim() }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!upstream.ok) {
      const requestId = upstream.headers.get("x-request-id");
      const status = upstream.status === 401 ? 502 : upstream.status === 503 ? 503 : 502;
      console.error("Santhali TTS upstream failure", {
        status: upstream.status,
        requestId,
      });
      const errorJson = await upstream.json().catch(() => null);
      const detailMsg = errorJson?.detail || (upstream.status === 503 ? "Santhali offline voice model is not installed." : "Audio service is temporarily unavailable.");
      return NextResponse.json(
        {
          error: detailMsg,
          requestId: requestId ?? undefined,
        },
        { status },
      );
    }

    const headers = new Headers({
      "Content-Type": upstream.headers.get("content-type") ?? "audio/wav",
      "Cache-Control": "no-store",
    });
    for (const header of ["x-request-id", "x-audio-duration-seconds", "x-tts-chunks"]) {
      const value = upstream.headers.get(header);
      if (value) headers.set(header, value);
    }

    const arrayBuffer = await upstream.arrayBuffer();

    // Save to cache asynchronously without blocking the response
    fs.mkdir(cacheDir, { recursive: true }).then(() => {
      fs.writeFile(cacheFile, Buffer.from(arrayBuffer)).catch(err => {
        console.error("Failed to write TTS cache file:", err);
      });
    }).catch(err => {
        console.error("Failed to create TTS cache directory:", err);
    });

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "AbortError";
    console.error("Santhali TTS connection failure", error);
    return NextResponse.json(
      {
        error: timedOut
          ? "Audio generation took too long. Please try again."
          : "Audio service is offline. Please try again later.",
      },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }
}