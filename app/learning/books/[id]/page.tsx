import Link from "@/components/OfflineLink";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import LearningNavigation from "@/components/LearningNavigation";
import { SCHOOL_BOOKS } from "@/lib/learning-resources";
import BookReader from "@/components/BookReader";
export function generateStaticParams() { return SCHOOL_BOOKS.map(book => ({ id: book.id })); }
export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = SCHOOL_BOOKS.find(item => item.id === id);
  if (!book) notFound();
  return <PageContainer className="learning-hub"><PageHeading eyebrow={`CLASS ${book.grade} · ${book.subject} · ${book.language}`} title={book.title} description="Read NCERT chapter PDFs and download them once to keep learning offline."/><LearningNavigation/><BookReader book={book}/><Link href="/learning">← Back to the bookshelf</Link></PageContainer>;
}
