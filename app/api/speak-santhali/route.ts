import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const endpoint = process.env.COLAB_TTS_URL;
  const apiKey = process.env.COLAB_TTS_API_KEY;

  if (!endpoint || !apiKey) {
    return NextResponse.json(
      { error: "Santali voice is not configured yet." },
      { status: 503 }
    );
  }

  let body: { text?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 500) {
    return NextResponse.json(
      { error: "Enter between 1 and 500 characters of Santali text." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${endpoint.replace(/\/$/, "")}/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({ text }),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "The Santali voice service could not generate audio." },
        { status: 502 }
      );
    }

    return new NextResponse(await upstream.arrayBuffer(), {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The temporary Colab voice service is offline." },
      { status: 503 }
    );
  }
}
