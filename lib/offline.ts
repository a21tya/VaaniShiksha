import { SCHOOL_BOOKS } from "./learning-resources";

export const PAGE_CACHE = "vaani-offline-pages-v1";
export const BOOK_CACHE = "vaani-offline-books-v1";
export const OFFLINE_ROUTES = ["/", "/teacher", "/student", "/student/catalog", "/create-lesson", "/lessons", "/learning", "/learning/dictionary", "/learning/alphabets", "/learning/speech", "/offline", ...SCHOOL_BOOKS.map(book => `/learning/books/${book.id}`)];
export const bookParts = (book: { chapters: number }) => ["ps", ...Array.from({ length: book.chapters }, (_, index) => String(index + 1).padStart(2, "0"))];
export const bookPartUrl = (id: string, part: string) => `/api/books/${id}/${part}`;

export async function savedBookParts(id: string): Promise<string[]> {
  const cache = await caches.open(BOOK_CACHE);
  return (await cache.keys()).filter(request => new URL(request.url).pathname.startsWith(`/api/books/${id}/`)).map(request => new URL(request.url).pathname.split("/").pop()!);
}

export async function downloadBook(id: string, progress: (done: number, total: number) => void, signal?: AbortSignal) {
  const book = SCHOOL_BOOKS.find(book => book.id === id);
  if (!book) throw new Error("Unknown textbook.");
  const cache = await caches.open(BOOK_CACHE);
  const parts = bookParts(book);
  let done = 0;
  for (const part of parts) {
    signal?.throwIfAborted();
    const url = bookPartUrl(id, part);
    if (!await cache.match(url)) {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || `Could not download ${book.title}, part ${part}. Retry to resume.`);
      }
      const blob = await response.blob();
      if (await blob.slice(0, 5).text() !== "%PDF-") throw new Error("The source did not return a PDF. Please retry later.");
      await cache.put(url, new Response(blob, { headers: { "Content-Type": "application/pdf" } }));
    }
    progress(++done, parts.length);
  }
}

export async function preparePages(progress: (done: number, total: number) => void) {
  if (!("serviceWorker" in navigator) || !("caches" in window)) throw new Error("Offline installation requires HTTPS (or localhost) and a browser with service workers.");
  await navigator.serviceWorker.register("/sw.js");
  await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(new Error("Offline worker is not ready. Use the production build and retry.")), 20000))]);
  const cache = await caches.open(PAGE_CACHE);
  for (let index = 0; index < OFFLINE_ROUTES.length; index++) {
    const response = await fetch(OFFLINE_ROUTES[index], { cache: "reload", headers: { Accept: "text/html" } });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) throw new Error(`Could not save ${OFFLINE_ROUTES[index]}. Retry installation.`);
    await cache.put(OFFLINE_ROUTES[index], response);
    progress(index + 1, OFFLINE_ROUTES.length);
  }
  await navigator.storage?.persist?.();
}
