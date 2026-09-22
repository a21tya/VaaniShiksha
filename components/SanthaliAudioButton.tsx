"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => () => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
  }, []);

  const showAudioPlayer = (blob: Blob) => {
    if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    const url = URL.createObjectURL(blob);
    currentUrl.current = url;
    setAudioUrl(url);
  };

  const handlePlay = async () => {
    setError("");
    setStatus("loading");
    try {
      const cacheId = `${audioId}:${text.trim()}`;
      const cached = await getAudioBlob(cacheId);
      if (cached) { showAudioPlayer(cached); return; }
      // Match the server's content hash so bundled speech also works offline.
      const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("indic-parler-v1:" + text.trim()));
      const hash = Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, "0")).join("");
      const bundled = await fetch(`/audio_cache/${hash}.wav`).catch(() => null);
      if (bundled?.ok && bundled.headers.get("content-type")?.startsWith("audio/")) {
        const blob = await bundled.blob(); await saveAudioBlob(cacheId, blob, lessonId); showAudioPlayer(blob); return;
      }
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
      await saveAudioBlob(cacheId, blob, lessonId);
      showAudioPlayer(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audio could not be generated.");
    } finally {
      setStatus("idle");
    }
  };

  async function importAudio(file?: File) {
    if (!file) return;
    try {
      if (!file.type.startsWith("audio/") || file.size > 30 * 1024 * 1024) throw new Error("Choose an audio file smaller than 30 MB.");
      await saveAudioBlob(`${audioId}:${text.trim()}`, file, lessonId);
      showAudioPlayer(file); setError("");
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save audio."); }
  }

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
        Saved audio plays offline · New audio uses your local voice service
      </div>
      <details className="mt-2 text-sm"><summary>Use a teacher’s audio recording offline</summary><p>Choose a recording of this exact passage. It is saved on this device.</p><input type="file" accept="audio/*" onChange={event => { void importAudio(event.target.files?.[0]); event.target.value = ""; }}/></details>
      {audioUrl && <a href={audioUrl} download="santhali-recording.wav" className="text-sm underline">Download this audio</a>}
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{error}</p>}
      {audioUrl && (
        <audio controls autoPlay src={audioUrl} className="mt-3 w-full">
          Your browser cannot play this audio.
        </audio>
      )}
    </div>
  );
}
