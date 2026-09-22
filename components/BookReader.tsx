"use client";
import { useEffect, useRef, useState } from "react";
import type { SchoolBook } from "@/lib/learning-resources";
import { BOOK_CACHE, bookParts, bookPartUrl, downloadBook, savedBookParts } from "@/lib/offline";

export default function BookReader({ book }: { book: SchoolBook }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [part, setPart] = useState("01");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const objectUrl = useRef("");
  const loadId = useRef(0);
  useEffect(() => { savedBookParts(book.id).then(setSaved).catch(() => setMessage("Browser storage is unavailable. Direct NCERT links remain available.")); return () => { controller.current?.abort(); if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }; }, [book.id]);
  function display(blob: Blob) { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); objectUrl.current = URL.createObjectURL(blob); setUrl(objectUrl.current); }
  async function open() {
    const requestId = ++loadId.current;
    setMessage("Opening PDF…");
    try {
      const cache = await caches.open(BOOK_CACHE);
      const path = bookPartUrl(book.id, part);
      const response = await cache.match(path) || await fetch(path, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.error); }
      const blob = await response.blob();
      if (await blob.slice(0, 5).text() !== "%PDF-") throw new Error("This is not a valid PDF.");
      await cache.put(path, new Response(blob, { headers: { "Content-Type": "application/pdf" } }));
      if (requestId !== loadId.current) return;
      display(blob); setSaved(await savedBookParts(book.id)); setMessage("PDF saved on this device for offline reading.");
    } catch (error) { if (requestId === loadId.current) setMessage(error instanceof Error ? error.message : "Could not open PDF."); }
  }
  async function download() {
    setBusy(true); controller.current = new AbortController();
    try { await downloadBook(book.id, (done, total) => setMessage(`Downloaded ${done} of ${total} PDFs. Keep this page open.`), controller.current.signal); setMessage("Complete book downloaded for offline use."); await navigator.storage?.persist?.(); }
    catch (error) { setMessage(error instanceof Error ? `${error.message} Saved chapters are kept; retry resumes.` : "Download failed. Retry to resume."); }
    finally { setSaved(await savedBookParts(book.id)); setBusy(false); }
  }
  async function importPdf(file?: File) {
    if (!file) return;
    try { if (await file.slice(0, 5).text() !== "%PDF-") throw new Error("Choose a PDF file."); const cache = await caches.open(BOOK_CACHE); await cache.put(bookPartUrl(book.id, part), new Response(file, { headers: { "Content-Type": "application/pdf" } })); setSaved(await savedBookParts(book.id)); display(file); setMessage(`Imported PDF for ${part === "ps" ? "prelims" : `chapter ${Number(part)}`}. Check that you chose the correct chapter.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Import failed."); }
  }
  return <section className="dictionary-search-panel"><h2>Read here, keep it offline</h2><p>{saved.length} / {bookParts(book).length} PDFs saved on this device. Downloads include prelims and every chapter.</p><div className="offline-actions"><label>Chapter <select value={part} onChange={event => { loadId.current++; setPart(event.target.value); setUrl(""); setMessage(""); }}>{bookParts(book).map(value => <option key={value} value={value}>{value === "ps" ? "Prelims" : `Chapter ${Number(value)}`}{saved.includes(value) ? " · downloaded" : ""}</option>)}</select></label><button className="primary-action" onClick={open}>Read chapter</button><button className="secondary-action" disabled={busy} onClick={download}>{busy ? "Downloading…" : "Download complete book"}</button>{busy && <button onClick={() => controller.current?.abort()}>Cancel download</button>}</div><p role="status">{message}</p>{url && <><a href={url} download={`${book.id}${part}.pdf`} className="secondary-action">Save / open PDF on your device</a><object data={url} type="application/pdf" width="100%" height="650" aria-label={`${book.title} chapter PDF`}><p>Your browser does not embed PDFs. Use the save link above to open it in your device’s PDF reader.</p></object></>}<details><summary>Other reading sources or import a PDF</summary><p>If NCERT is unavailable, retry later or import a chapter PDF you already have.</p><div className="offline-actions"><a href={book.url} target="_blank" rel="noopener noreferrer">NCERT chapter list ↗</a><a href={book.flipbookUrl} target="_blank" rel="noopener noreferrer">ePathshala: this book ↗</a><label>Import selected chapter <input type="file" accept="application/pdf" onChange={event => { void importPdf(event.target.files?.[0]); event.target.value = ""; }}/></label></div></details></section>;
}
