"use client";
import { useState } from "react";
import SpeechInput from "@/components/SpeechInput";
import LearningNavigation from "@/components/LearningNavigation";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
export default function SpeechPage() {
  const [language, setLanguage] = useState("English"); const [text, setText] = useState("");
  return <PageContainer className="learning-hub"><PageHeading eyebrow="Your voice, your words" title={<>Speak freely.<span> See your words.</span></>} description="Turn spoken ideas into editable text, then use them in your notes or lessons."/><LearningNavigation/><label>Spoken language <select value={language} onChange={e => setLanguage(e.target.value)}>{["English", "Hindi", "Hinglish"].map(value => <option key={value}>{value}</option>)}</select></label><SpeechInput key={language} language={language} onTranscript={value => setText(previous => `${previous}${previous ? " " : ""}${value}`)}/><label htmlFor="transcript">Your transcript</label><textarea id="transcript" rows={10} value={text} onChange={e => setText(e.target.value)} placeholder="Your spoken words will appear here. You can also type and edit." style={{ border: "1px solid #dce5d7", borderRadius: 12, padding: 20, width: "100%" }}/><button type="button" onClick={() => setText("")} disabled={!text}>Clear transcript</button></PageContainer>;
}
