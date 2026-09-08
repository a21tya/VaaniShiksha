"use client";

import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import LearningNavigation from "@/components/LearningNavigation";
import Icon from "@/components/Icon";
import { DICTIONARY, type WordTopic } from "@/lib/learning-resources";
import { useLearningShelf } from "@/hooks/useLearningShelf";

const topics: (WordTopic | "All words")[] = ["All words", "Nature", "Numbers & shapes", "School", "Everyday life"];

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<WordTopic | "All words">("All words");
  const [savedOnly, setSavedOnly] = useState(false);
  const { saved, ready, message, toggle } = useLearningShelf("vaani-learning-words-v1");
  const words = DICTIONARY.filter(word => (topic === "All words" || word.topic === topic) && (!savedOnly || saved.includes(word.english)) && `${word.english} ${word.hindi} ${word.pronunciation}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => a.english.localeCompare(b.english));
  return <PageContainer className="learning-hub dictionary-page">
    <PageHeading eyebrow="शब्दों से दोस्ती   /   Make friends with words." title={<>Little words.<br/><span>Wonderful meanings.</span></>} description="Look up a word in Hindi or English, discover what it means, and see it in a sentence. A little learning, one word at a time."/>
    <LearningNavigation/>
    <section className="dictionary-search-panel" aria-labelledby="dictionary-title"><div><span className="learning-kicker">YOUR HINDI–ENGLISH WORD COMPANION</span><h2 id="dictionary-title">What will you discover today?</h2><p>A starter collection of {DICTIONARY.length} everyday words, written for young learners.</p></div><label className="learning-search"><Icon name="search" size={21}/><span className="sr-only">Search dictionary in Hindi or English</span><input type="search" placeholder="Try ‘water’, ‘पानी’, or ‘paani’…" value={query} onChange={event => setQuery(event.target.value)}/></label><div className="dictionary-suggestions"><span>Try a word:</span>{["Tree", "कहानी", "Half", "Friend"].map(word => <button type="button" key={word} onClick={() => { setQuery(word); setTopic("All words"); setSavedOnly(false); }}>{word}</button>)}</div></section>
    <section aria-label="Dictionary entries"><div className="dictionary-filter-row"><div className="subject-filters" role="group" aria-label="Word categories">{topics.map(value => <button type="button" key={value} aria-pressed={topic === value} onClick={() => setTopic(value)}>{value}</button>)}</div><button type="button" className="saved-filter" aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Icon name="bookmark" size={17}/>{savedOnly ? "Saved words" : "My word collection"}</button></div><div className="resource-count" role="status">{words.length} {words.length === 1 ? "word" : "words"}{savedOnly ? " in your collection" : " to explore"}<span>English · हिंदी · Simple meanings</span></div><div className="dictionary-grid">{words.map(word => { const isSaved = saved.includes(word.english); return <article key={word.english} className="dictionary-card"><div className="dictionary-card-top"><span>{word.topic}</span><button className="bookmark-button" type="button" aria-pressed={isSaved} disabled={!ready} aria-label={`${isSaved ? "Remove" : "Save"} ${word.english}${isSaved ? " from collection" : " to collection"}`} onClick={() => toggle(word.english)}><Icon name={isSaved ? "check" : "bookmark"} size={18}/></button></div><div className="word-pair"><h3>{word.english}</h3><span lang="hi">{word.hindi}</span></div><span className="word-pronunciation">Hindi pronunciation: {word.pronunciation}</span><p className="word-meaning">{word.meaning}</p><div className="word-example"><span>USE IT IN A SENTENCE</span><p>{word.example}</p></div></article>; })}</div>{words.length === 0 && <div className="learning-empty"><Icon name="translate" size={35}/><h3>{savedOnly ? "Start your word collection." : "We haven’t added that word yet."}</h3><p>{savedOnly ? "Tap a bookmark on a word you want to remember, or change your filters." : "This is a growing starter dictionary. Try another spelling, Hindi word, or English word."}</p><button className="secondary-action" type="button" onClick={() => { setQuery(""); setTopic("All words"); setSavedOnly(false); }}>Explore all words</button></div>}</section>
    <div className="dictionary-footer-note"><Icon name="spark" size={23}/><p><b>Make the word your own.</b> Try using one new word in a sentence about your home, school, or village.</p><span>Saved words stay on this device.</span></div><p className="sr-only" role="status">{message}</p>
  </PageContainer>;
}
