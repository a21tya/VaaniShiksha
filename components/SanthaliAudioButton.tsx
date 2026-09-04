"use client";

import { useRef, useState } from "react";
import { getAudioBlob, saveAudioBlob } from "@/lib/storage";

type SantaliAudioButtonProps = {
  text: string;
  lessonId: string;
  audioId: string;
};

export default function SantaliAudioButton({
  text,
  lessonId,
  audioId,
}: SantaliAudioButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const currentUrl = useRef<string | null>(null);

  const showAudioPlayer = (blob: Blob) => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    const url = URL.createObjectURL(blob);
    currentUrl.current = url;
    setAudioUrl(url);
  };

  const handlePlay = async () => {
    setError("");
    const cached = await getAudioBlob(audioId);
    if (cached) {
      showAudioPlayer(cached);
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/speak-santhali", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Audio could not be generated.");
      }

      const blob = await response.blob();
      await saveAudioBlob(audioId, blob, lessonId);
      showAudioPlayer(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio could not be generated.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="pt-3">
      <button
        type="button"
        onClick={handlePlay}
        disabled={status === "loading"}
        className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-70"
      >
        {status === "loading" ? "Generating audio…" : "🔊 Listen in Santhali"}
      </button>
      <div className="mt-2 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
        ⚡ Santhali Audio (Local Cache &amp; Offline Engine)
      </div>
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{error}</p>}
      {audioUrl && (
        <audio controls autoPlay src={audioUrl} className="mt-3 w-full">
          Your browser cannot play this audio.
        </audio>
      )}
    </div>
  );
}
