"use client";
import AlphabetPractice from "@/components/AlphabetPractice";
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import LearningNavigation from "@/components/LearningNavigation";
const english = "Apple Ball Cat Dog Elephant Fish Grapes House Ink Jug Kite Lion Mango Nest Orange Parrot Queen Rabbit Sun Tree Umbrella Van Water Xylophone Yak Zebra".split(" ");
const vowels = "अ:अनार आ:आम इ:इमली ई:ईख उ:उल्लू ऊ:ऊन ऋ:ऋषि ए:एक ऐ:ऐनक ओ:ओखली औ:औरत".split(" ");
const consonants = "क:कमल ख:खरगोश ग:गमला घ:घर ङ:ङ च:चम्मच छ:छाता ज:जहाज झ:झरना ञ:ञ ट:टमाटर ठ:ठेला ड:डमरू ढ:ढोल ण:ण त:तरबूज थ:थाली द:दरवाज़ा ध:धनुष न:नल प:पतंग फ:फल ब:बकरी भ:भालू म:मछली य:योग र:रथ ल:लड्डू व:वन श:शेर ष:षट्कोण स:सूरज ह:हाथी".split(" ");
// Letter names from https://www.unicode.org/charts/nameslist/n_1C50.html
const santhali = "La At Ag Ang Al Laa Aak Aaj Aam Aaw Li Is Ih Iny Ir Lu Uc Ud Unn Uy Le Ep Edd En Err Lo Ott Ob Ov Oh".split(" ").map((name, index) => `${String.fromCodePoint(0x1c5a + index)}:${name}`);
export default function Alphabets() {
  const [language, setLanguage] = useState("English");
  const [selected, setSelected] = useState("");
  const groups = language === "English" ? [{ title: "26 letters · uppercase & lowercase", entries: english.map((word, i) => `${String.fromCharCode(65 + i)} ${String.fromCharCode(97 + i)}:${word}`) }] : language === "Santhali" ? [{ title: "ᱚᱞ ᱪᱤᱠᱤ · 30 Ol Chiki letters", entries: santhali }] : [{ title: "स्वर · Vowels", entries: vowels }, { title: "व्यंजन · Consonants", entries: consonants }];
  return <PageContainer className="learning-hub"><PageHeading eyebrow="अ से शुरुआत · A little beginning" title={<>Letters today.<span> Stories tomorrow.</span></>} description="Explore English, Hindi वर्णमाला, and Santhali Ol Chiki. Choose a letter, say it aloud, and practise writing it."/><LearningNavigation/><div className="subject-filters" role="group" aria-label="Alphabet language">{["English", "Hindi", "Santhali"].map(value => <button key={value} aria-pressed={language === value} onClick={() => { setLanguage(value); setSelected(""); }}>{value}</button>)}</div><AlphabetPractice key={language} language={language} selected={selected}/><div className="ncert-note" role="status">{selected ? `Say it aloud: ${selected}. Trace the letter in the air, then write it on paper.` : "Choose a letter to practise. Hindi ङ, ञ and ण usually appear within words."}</div>{groups.map(group => <section key={group.title}><h2 style={{ fontSize: 23, marginBottom: 20 }}>{group.title}</h2><div className="alphabet-grid">{group.entries.map(entry => { const [letter, word] = entry.split(":"); return <button className="alphabet-card" key={letter} aria-pressed={selected === `${letter} — ${word}`} onClick={() => setSelected(`${letter} — ${word}`)}><strong className={language === "Santhali" ? "font-santhali" : undefined}>{letter}</strong><span>{word === letter ? "Practise this letter" : word}</span></button>; })}</div></section>)}</PageContainer>;
}
