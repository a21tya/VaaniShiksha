import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import LearningNavigation from "@/components/LearningNavigation";
import { SCHOOL_BOOKS } from "@/lib/learning-resources";
export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = SCHOOL_BOOKS.find(item => item.id === id);
  if (!book) notFound();
  return <PageContainer className="learning-hub"><PageHeading eyebrow={`CLASS ${book.grade} · ${book.subject} · ${book.language}`} title={book.title} description="Choose an official reading source below. If one NCERT service is unavailable, try the alternative portal."/><LearningNavigation/><section className="dictionary-search-panel"><h2>Open your textbook</h2><p>NCERT’s textbook server can be slow or temporarily unavailable. These books are hosted by NCERT, not on this device.</p><div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}><a className="read-book" href={book.url} target="_blank" rel="noopener noreferrer">NCERT chapter list ↗</a><a className="read-book" href="https://epathshala.nic.in/epathshala.php?id=Students&ln=en&type=" target="_blank" rel="noopener noreferrer">Try ePathshala ↗</a><a className="read-book" href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer">NCERT book selector ↗</a></div><p style={{ marginTop: 24 }}>On ePathshala choose <b>eTextbooks</b>, then <b>Class {book.grade}</b>, <b>{book.language}</b> and <b>{book.title}</b>.</p></section><Link href="/learning">← Back to the bookshelf</Link></PageContainer>;
}
