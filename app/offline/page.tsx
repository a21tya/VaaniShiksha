"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "@/components/OfflineLink";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import { SCHOOL_BOOKS } from "@/lib/learning-resources";
import { bookParts, downloadBook, OFFLINE_ROUTES, PAGE_CACHE, preparePages, savedBookParts, BOOK_CACHE } from "@/lib/offline";

export default function OfflinePage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  const [pages, setPages] = useState(0);
  const [books, setBooks] = useState<Record<string, number>>({});
  const [storage, setStorage] = useState("");
  const [model, setModel] = useState("Not checked");
  const gpu = useSyncExternalStore(() => () => {}, () => "gpu" in navigator, () => false);
  const controller = useRef<AbortController | null>(null);
  async function refresh() {
    if (!("caches" in window)) throw new Error("Offline storage needs HTTPS and a supported browser.");
    const cache = await caches.open(PAGE_CACHE);
    setPages((await Promise.all(OFFLINE_ROUTES.map(route => cache.match(route)))).filter(Boolean).length);
    const counts = await Promise.all(SCHOOL_BOOKS.map(async book => [book.id, (await savedBookParts(book.id)).length] as const));
    setBooks(Object.fromEntries(counts));
    const estimate = await navigator.storage?.estimate?.();
    const persistent = await navigator.storage?.persisted?.();
    setStorage(`${Math.round((estimate?.usage || 0) / 1024 / 1024)} MB used of approximately ${Math.round((estimate?.quota || 0) / 1024 / 1024)} MB available to this site. ${persistent ? "Persistent storage granted." : "The browser may remove downloads when storage is low."}`);
  }
  useEffect(() => {
    const timer = setTimeout(() => { void refresh().catch(() => setMessage("Storage cannot be inspected. Check browser settings.")); }, 0);
    return () => { clearTimeout(timer); controller.current?.abort(); };
  }, []);
  async function run(name: string, work: () => Promise<void>) {
    setBusy(name); setMessage("");
    try { await work(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Setup failed. Please retry."); }
    finally { await refresh().catch(() => {}); setBusy(""); }
  }
  return <PageContainer><PageHeading eyebrow="Learn wherever you are" title={<>Take your classroom <span>offline.</span></>} description="Download on each phone or computer while connected, then keep learning without internet. Keep this tab open until downloads finish."/>
    <section className="offline-panel"><h2>1. Save the app</h2><p>{pages} / {OFFLINE_ROUTES.length} pages saved. Includes all five classes, book readers, the dictionary, alphabets, lesson library and teacher tools.</p><button className="primary-action" disabled={!!busy} onClick={() => run("pages", async () => { await preparePages((done, total) => setMessage(`Saving pages ${done}/${total}…`)); setMessage("All pages saved. Install from your browser’s menu (Install app / Add to Home Screen). Test once in airplane mode before travelling."); })}>Download / refresh app pages</button><p>Saved lessons, quizzes, flashcards and downloaded audio stay on this device. Download books separately below.</p></section>
    <section className="offline-panel"><h2>2. Download your textbooks</h2><p>PDFs come directly from NCERT. All books can take significant space. Interrupted downloads keep completed chapters; retry to resume.</p><button className="primary-action" disabled={!!busy} onClick={() => run("books", async () => { controller.current = new AbortController(); for (const book of SCHOOL_BOOKS) { await downloadBook(book.id, (done, total) => setMessage(`Class ${book.grade} · ${book.title}: ${done}/${total} PDFs`), controller.current.signal); } setMessage("All catalog books downloaded."); })}>Download all {SCHOOL_BOOKS.length} books</button>{busy === "books" && <button className="secondary-action" onClick={() => controller.current?.abort()}>Cancel download</button>}<div className="offline-book-grid">{SCHOOL_BOOKS.map(book => <div key={book.id}><Link href={`/learning/books/${book.id}`}>Class {book.grade} · {book.title} ({book.language})</Link><span>{books[book.id] || 0}/{bookParts(book).length} PDFs</span>{!!books[book.id] && <button disabled={!!busy} onClick={() => run("remove", async () => { const cache = await caches.open(BOOK_CACHE); for (const request of await cache.keys()) if (new URL(request.url).pathname.startsWith(`/api/books/${book.id}/`)) await cache.delete(request); setMessage(`${book.title} downloads removed.`); })}>Remove download</button>}</div>)}</div></section>
    <section className="offline-panel"><h2>3. On-device lesson AI · experimental</h2><p>A small Qwen model can create draft lessons without a server on compatible WebGPU devices. Allow several hundred MB of downloads and about 1 GB of GPU memory. Device support and translation quality vary; Santali accuracy is not verified.</p><p>{gpu ? "WebGPU API detected; loading the model will check whether your hardware can run it." : "WebGPU is unavailable in this browser. On-device AI cannot run here; downloaded learning content still works."}</p><div className="offline-actions"><button className="primary-action" disabled={!!busy || !gpu} onClick={() => run("model", async () => { const { loadOfflineModel } = await import("@/lib/offline-ai"); await loadOfflineModel(setMessage, true); await navigator.storage?.persist?.(); setModel("Model loaded on this device"); setMessage("Model downloaded and loaded. Open Create Lesson and choose on-device generation. Test again offline before relying on it."); })}>Download and load lesson model</button><button className="secondary-action" disabled={!!busy} onClick={() => run("check-model", async () => { const { offlineModelDownloaded } = await import("@/lib/offline-ai"); setModel(await offlineModelDownloaded() ? "Model weights found; loading still requires compatible hardware" : "Model not downloaded"); })}>Check model download</button></div><p>{model}</p></section>
    <section className="offline-panel"><h2>4. Speech and pronunciation</h2><p><Link href="/learning/speech">Speech input</Link> offers on-device recognition when your browser supplies a language pack. It reports unsupported languages instead of silently using an online service. English/Hindi read-aloud uses installed device voices.</p><p>Saved Santali audio plays offline. New Indic Parler speech still requires the computer voice service; this model cannot currently run in the Android browser. You can attach a teacher’s audio file to a lesson’s Listen button for offline playback.</p><p><strong>Complete offline AI and new Santali voice generation on every Android phone are not yet supported.</strong> Downloading app pages does not remove that limitation.</p></section>
    <section className="offline-panel"><h2>Storage and readiness</h2><p>{storage}</p><button className="secondary-action" disabled={!!busy} onClick={() => run("storage", async () => { const persistent = await navigator.storage?.persist?.(); setMessage(persistent ? "Persistent storage granted." : "The browser did not grant persistent storage. Keep copies of important PDFs and lessons."); })}>Protect downloaded data</button><p>Clearing site data removes downloads and saved work. Each device needs its own installation. On a public site, offline installation requires HTTPS; local computer testing can use localhost.</p></section><p className="offline-status" role="status" aria-live="polite">{busy && "Working… "}{message}</p>
  </PageContainer>;
}
