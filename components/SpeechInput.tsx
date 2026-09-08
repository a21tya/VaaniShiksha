"use client";
import { useEffect, useRef, useState } from "react";
type Recognition = { lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void; abort(): void; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null };
export default function SpeechInput({ language, onTranscript }: { language: string; onTranscript: (text: string) => void }) {
  const recognition = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => () => { const current = recognition.current; if (current) { current.onresult = null; current.onerror = null; current.onend = null; current.abort(); } }, [language]);
  function start() {
    if (recognition.current) { recognition.current.stop(); return; }
    const browser = window as typeof window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) { setMessage("Speech input is unavailable in this browser. Try Chrome, or type your text."); return; }
    const current = new Constructor();
    current.lang = language === "Hindi" ? "hi-IN" : "en-IN";
    current.continuous = false; current.interimResults = false;
    current.onresult = event => { onTranscript(Array.from(event.results).map(result => result[0].transcript).join(" ")); setMessage("Speech added. Review the words before continuing."); };
    current.onerror = event => setMessage(event.error === "not-allowed" ? "Microphone access was denied. Allow it in browser settings or type instead." : `Could not transcribe (${event.error}). Please try again or type.`);
    current.onend = () => { recognition.current = null; setListening(false); };
    recognition.current = current;
    try { current.start(); setListening(true); setMessage("Listening… speak now."); } catch { recognition.current = null; setMessage("Microphone could not start. Please try again."); }
  }
  return <div style={{ padding: 16, border: "1px solid #dce5d7", borderRadius: 12, background: "#f5faf1" }}><button type="button" onClick={start} aria-pressed={listening} style={{ fontWeight: 700, color: "#246248", padding: "8px 12px" }}>{listening ? "Stop listening" : "🎙 Speak to type"}</button><p style={{ fontSize: 12, color: "#52624d" }}>Uses your browser’s speech service and may need internet. {language === "Hinglish" ? "Mixed Hindi–English recognition varies; edit the transcript as needed." : `Speak in ${language}.`}</p><p role="status" style={{ fontSize: 13 }}>{message}</p></div>;
}
