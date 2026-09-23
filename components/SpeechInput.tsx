"use client";
import { useEffect, useRef, useState } from "react";
type Recognition = { processLocally?: boolean; lang: string; continuous: boolean; interimResults: boolean; start(): void; stop(): void; abort(): void; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null };
type RecognitionConstructor = { new (): Recognition; available?: (options: { langs: string[]; processLocally: boolean }) => Promise<string>; install?: (options: { langs: string[]; processLocally: boolean }) => Promise<boolean> };
export default function SpeechInput({ language, onTranscript }: { language: string; onTranscript: (text: string) => void }) {
  const recognition = useRef<Recognition | null>(null);
  const [local, setLocal] = useState(true);
  const [preparing, setPreparing] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => () => { const current = recognition.current; if (current) { current.onresult = null; current.onerror = null; current.onend = null; current.abort(); } }, [language]);
  async function start() {
    if (recognition.current) { recognition.current.stop(); return; }
    const browser = window as typeof window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) { setMessage("Speech input is unavailable in this browser. Try Chrome, or type your text."); return; }
    const current = new Constructor();
    current.lang = language === "Hindi" ? "hi-IN" : "en-IN";
    if (local) {
      if (!("processLocally" in current) || !Constructor.available) { setMessage("On-device speech recognition is not supported in this browser. Type your text, or select online recognition while connected."); return; }
      current.processLocally = true;
      setPreparing(true);
      try {
        const options = { langs: [current.lang], processLocally: true };
        const available = await Constructor.available(options);
        if (available !== "available") {
          if (available === "unavailable" || !Constructor.install) { setMessage("An offline speech pack is not available for this language on this device."); return; }
          setMessage("Downloading the device language pack. Internet is needed once…");
          if (!await Constructor.install(options)) { setMessage("Language pack download failed. Connect and retry."); return; }
        }
      } catch { setMessage("Could not prepare on-device recognition. Check browser language-pack support."); return; }
      finally { setPreparing(false); }
    }
    current.continuous = false; current.interimResults = false;
    current.onresult = event => { onTranscript(Array.from(event.results).map(result => result[0].transcript).join(" ")); setMessage("Speech added. Review the words before continuing."); };
    current.onerror = event => setMessage(event.error === "not-allowed" ? "Microphone access was denied. Allow it in browser settings or type instead." : `Could not transcribe (${event.error}). Please try again or type.`);
    current.onend = () => { recognition.current = null; setListening(false); };
    recognition.current = current;
    try { current.start(); setListening(true); setMessage("Listening… speak now."); } catch { recognition.current = null; setMessage("Microphone could not start. Please try again."); }
  }
  return <div className="speech-input" style={{ padding: 16, border: "1px solid #dce5d7", borderRadius: 12, background: "#f5faf1" }}><label><input type="checkbox" checked={local} disabled={listening || preparing} onChange={event => setLocal(event.target.checked)}/> On-device recognition (offline after language download)</label><br/><button type="button" disabled={preparing} onClick={start} aria-pressed={listening} style={{ fontWeight: 700, color: "#246248", padding: "8px 12px" }}>{listening ? "Stop listening" : "🎙 Speak to type"}</button><p style={{ fontSize: 12, color: "#52624d" }}>{local ? "Uses only on-device recognition; unsupported devices or language packs will be reported." : "Online recognition sends speech to the browser’s speech service and needs internet."} {language === "Hinglish" ? "Mixed Hindi–English recognition varies; edit the transcript as needed." : `Speak in ${language}.`}</p><p role="status" style={{ fontSize: 13 }}>{message}</p></div>;
}
