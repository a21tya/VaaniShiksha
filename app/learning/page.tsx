"use client";

import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import LearningNavigation from "@/components/LearningNavigation";
import Icon from "@/components/Icon";
import { SCHOOL_BOOKS, SUBJECTS, type SchoolClass, type Subject } from "@/lib/learning-resources";
import { useLearningShelf } from "@/hooks/useLearningShelf";

export default function LearningHub() {
  const [grade, setGrade] = useState<SchoolClass>(1);
  const [subject, setSubject] = useState<Subject | "All subjects">("All subjects");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const { saved, ready, message, toggle } = useLearningShelf("vaani-learning-books-v1");
  const availableSubjects = Object.keys(SUBJECTS).filter(subject => SCHOOL_BOOKS.some(book => book.grade === grade && book.subject === subject)) as Subject[];
  const books = SCHOOL_BOOKS.filter(book => book.grade === grade && (subject === "All subjects" || book.subject === subject) && (!savedOnly || saved.includes(book.id)) && `${book.title} ${book.subject} ${book.language}`.toLowerCase().includes(query.trim().toLowerCase()));
  function changeGrade(value: SchoolClass) { setGrade(value); setSubject("All subjects"); }

  return <PageContainer className="learning-hub">
    <PageHeading eyebrow="पढ़ो · खोजो · सीखो   /   Read. Discover. Grow." title={<>A little curiosity.<br/><span>A world to discover.</span></>} description="Your own corner for books, new words, and wonderful discoveries. Find your class, pick a subject, and let learning begin."/>
    <LearningNavigation/>
    <section className="class-picker" aria-labelledby="choose-class"><div><span className="learning-kicker">YOUR LEARNING JOURNEY</span><h2 id="choose-class">Which class are you in?</h2><p>A bookshelf for every little learner.</p></div><div className="class-buttons" role="group" aria-label="Choose your class">{([1, 2, 3, 4, 5] as SchoolClass[]).map(value => <button key={value} type="button" aria-pressed={grade === value} onClick={() => changeGrade(value)}><span>CLASS</span><strong>{value}</strong><small>{["Begin", "Explore", "Discover", "Imagine", "Grow"][value - 1]}</small></button>)}</div></section>
    <div className="learning-content-grid">
      <section className="bookshelf" aria-labelledby="bookshelf-title">
        <div className="learning-section-heading"><div><span className="learning-kicker">THE NCERT BOOKSHELF</span><h2 id="bookshelf-title">Class {grade}, endless possibilities.</h2></div><span className="resource-pill"><Icon name="check" size={14}/>Official NCERT links</span></div>
        <div className="learning-search-row"><label className="learning-search"><Icon name="search" size={19}/><span className="sr-only">Search books in Class {grade}</span><input type="search" placeholder="Find a book, subject, or language…" value={query} onChange={event => setQuery(event.target.value)}/></label><button type="button" className="saved-filter" aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Icon name="bookmark" size={18}/>{savedOnly ? "Saved books" : "My bookshelf"}</button></div>
        <div className="subject-filters" role="group" aria-label="Filter by subject">{(["All subjects", ...availableSubjects] as const).map(value => <button key={value} type="button" aria-pressed={subject === value} onClick={() => setSubject(value)}>{value}</button>)}</div>
        <div className="resource-count" role="status">{books.length} {books.length === 1 ? "book" : "books"} for Class {grade}{savedOnly ? " in your saved bookshelf" : ""}<span>Read at your own pace</span></div>
        <div className="book-grid">{books.map(book => { const design = SUBJECTS[book.subject]; const isSaved = saved.includes(book.id); return <article key={book.id} className={`school-book tone-${design.color}`}>
          <div className="book-art" aria-hidden="true"><div className="book-art-top"><span>CLASS {book.grade}</span><Icon name={design.icon} size={21}/></div><div className="book-symbol">{design.symbol}</div><div className="book-art-bottom"><span>{book.subject}</span><i/></div></div>
          <div className="book-details"><div className="book-meta"><span>{book.subject}</span><button type="button" className="bookmark-button" disabled={!ready} aria-pressed={isSaved} aria-label={`${isSaved ? "Remove" : "Save"} ${book.title}, Class ${grade}, ${book.language}${isSaved ? " from bookshelf" : " to bookshelf"}`} onClick={() => toggle(book.id)}><Icon name={isSaved ? "check" : "bookmark"} size={18}/></button></div><h3>{book.title}</h3><p>{design.description}</p><span className="book-language">{book.language} · NCERT textbook</span><a href={`/learning/books/${book.id}`} className="read-book" aria-label={`Read ${book.title}, Class ${grade}, ${book.language} reading options`}>Open book <span aria-hidden="true">↗</span></a></div>
        </article>; })}</div>
        {books.length === 0 && <div className="learning-empty"><Icon name="book" size={34}/><h3>{savedOnly ? "Your bookshelf is waiting." : "No books found here."}</h3><p>{savedOnly ? "Save a book using its bookmark button, or try another class." : "Try a different title or subject for this class."}</p><button type="button" className="secondary-action" onClick={() => { setQuery(""); setSubject("All subjects"); setSavedOnly(false); }}>Show all Class {grade} books</button></div>}
        {grade < 3 && <p className="class-note"><Icon name="spark" size={18}/>For Classes 1–2, learning about nature, art, and movement is woven into foundational learning. Separate subject books appear here from Class 3.</p>}
        <div className="ncert-note"><Icon name="globe" size={21}/><div><b>A doorway to the official books</b><p>Books open on NCERT in a new tab, where you can read chapters or download available PDFs. Internet is needed to open them. Bookmarks save links on this device, not the PDFs.</p><a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">Browse NCERT for other language editions ↗</a></div></div>
      </section>
      <aside className="learning-sidebar" aria-label="More ways to learn"><div className="dictionary-invitation"><span className="learning-kicker">SMALL WORDS, BIG WORLDS</span><div className="dictionary-letter" aria-hidden="true">अ<span>A</span></div><h2>Meet your<br/>little dictionary.</h2><p>Simple meanings. Familiar examples. A bridge between Hindi and English.</p><Link href="/learning/dictionary">Discover new words <Icon name="arrow" size={17}/></Link></div><div className="word-preview"><span className="learning-kicker">A WORD TO TAKE WITH YOU</span><h3>Curiosity</h3><span lang="hi">जिज्ञासा</span><p>The wish to learn or know more about something.</p><blockquote>“Every question is the beginning of a discovery.”</blockquote></div><div className="reading-ritual"><Icon name="book" size={24}/><h3>Make a little time for reading.</h3><ol><li>Pick a book that interests you.</li><li>Read a little, slowly.</li><li>Share one new thing you learned.</li></ol></div><Link href="/student/catalog" className="learning-lessons-link"><Icon name="students"/><span>Learn in Santhali<small>Open your classroom lessons</small></span><Icon name="arrow" size={17}/></Link></aside>
    </div>
    <p className="sr-only" role="status">{message}</p>
  </PageContainer>;
}
