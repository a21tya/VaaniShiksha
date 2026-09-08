"use client";
import { useEffect, useRef, useState } from "react";
import SanthaliAudioButton from "./SanthaliAudioButton";
export default function AlphabetPractice({ language, selected }: { language: string; selected: string }) {
  const [recording, setRecording] = useState(false);
  const [pending, setPending] = useState(false);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const audioUrl = useRef("");
  const active = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { active.current = true; return () => { active.current = false; if (timer.current) clearTimeout(timer.current); if (recorder.current?.state === "recording") recorder.current.stop(); stream.current?.getTracks().forEach(track => track.stop()); if (audioUrl.current) URL.revokeObjectURL(audioUrl.current); window.speechSynthesis?.cancel(); }; }, []);
  async function record() {
    if (recording) { recorder.current?.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setMessage("Recording is unavailable here. Open this page in Chrome or Safari."); return; }
    setPending(true); setMessage("");
    try {
      const input = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!active.current) { input.getTracks().forEach(track => track.stop()); return; }
      stream.current = input;
      const current = new MediaRecorder(input); recorder.current = current;
      const chunks: Blob[] = [];
      current.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      current.onstop = () => { input.getTracks().forEach(track => track.stop()); if (timer.current) clearTimeout(timer.current); if (!active.current) return; setRecording(false); if (audioUrl.current) URL.revokeObjectURL(audioUrl.current); audioUrl.current = URL.createObjectURL(new Blob(chunks, { type: current.mimeType })); setUrl(audioUrl.current); setMessage("Play your recording and practise again. It stays in this page and is not uploaded."); };
      current.onerror = () => { input.getTracks().forEach(track => track.stop()); if (active.current) { setRecording(false); setMessage("Recording failed. Please try again."); } };
      current.start(); setRecording(true); setMessage("Listening — say the letter aloud. Tap Stop when finished.");
      timer.current = setTimeout(() => { if (current.state === "recording") current.stop(); }, 30000);
    } catch { stream.current?.getTracks().forEach(track => track.stop()); if (active.current) setMessage("Allow microphone access in your browser, then try again."); }
    finally { if (active.current) setPending(false); }
  }
  function listen() {
    if (!("speechSynthesis" in window)) { setMessage("Read-aloud is unavailable in this browser."); return; }
    window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(selected); utterance.lang = language === "Hindi" ? "hi-IN" : "en-IN"; utterance.rate = .7;
    utterance.onerror = () => setMessage("This voice is unavailable. Check your device’s speech voices."); window.speechSynthesis.speak(utterance);
  }
  return <section className="alphabet-practice" aria-label="Speak and listen"><div><h2>Say it. Hear it. Try again.</h2><p>Pick a letter below, listen, then use the mic to practise your own voice.</p></div><div className="alphabet-practice-actions"><button className="mic-practice" type="button" disabled={pending} aria-pressed={recording} onClick={record}><span aria-hidden="true">🎙</span> {pending ? "Opening microphone…" : recording ? "Stop recording" : "Tap mic & speak"}</button>{language === "Santhali" ? selected && <SanthaliAudioButton key={selected} text={selected.split(" — ")[0]} lessonId="alphabet-practice" audioId={`ol-chiki-letter-v1-${selected.split(" — ")[0]}`}/> : <button type="button" className="mic-practice listen-practice" disabled={!selected} onClick={listen}>🔊 Listen to letter</button>}</div><p role="status">{message || (selected ? `Practising: ${selected}` : "Choose a letter to enable pronunciation audio.")}</p>{url && <audio aria-label="Your pronunciation recording" controls src={url}/>}<small>Voice practice records audio, not text or a pronunciation score. Recordings stop after 30 seconds.{language === "Santhali" && " Santhali audio uses the local AI voice; letter pronunciation needs teacher review."}</small></section>;
}
