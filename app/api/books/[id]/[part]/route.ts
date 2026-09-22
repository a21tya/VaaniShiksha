import { SCHOOL_BOOKS } from "@/lib/learning-resources";
import { bookParts } from "@/lib/offline";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
const MAX_PDF_BYTES = 50 * 1024 * 1024;
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; part: string }> }) {
  const { id, part } = await params;
  const book = SCHOOL_BOOKS.find(book => book.id === id);
  if (!book || !bookParts(book).includes(part)) return Response.json({ error: "Unknown book or chapter." }, { status: 404 });
  const filename = `${id}${part}.pdf`;
  const disk = path.join(process.cwd(), ".ncert-cache", filename);
  const headers = { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${filename}"`, "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" };
  try { const data = await fs.readFile(disk); if (data.subarray(0, 5).toString() === "%PDF-") return new Response(data, { headers }); } catch { /* Download a fresh copy. */ }
  for (const host of ["https://ncert.nic.in", "https://www.ncert.nic.in"]) {
    try {
      const response = await fetch(`${host}/textbook/pdf/${filename}`, { signal: AbortSignal.timeout(20000), cache: "no-store" });
      if (!response.ok || Number(response.headers.get("content-length")) > MAX_PDF_BYTES || !response.body) continue;
      const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length; if (size > MAX_PDF_BYTES) { await reader.cancel(); throw new Error("PDF too large"); } chunks.push(value);
      }
      const data = Buffer.concat(chunks);
      if (data.subarray(0, 5).toString() !== "%PDF-") continue;
      try { await fs.mkdir(path.dirname(disk), { recursive: true }); await fs.writeFile(disk, data); } catch { /* Read-only hosts still serve the PDF. */ }
      return new Response(data, { headers });
    } catch { /* Try the other official host. */ }
  }
  return Response.json({ error: `NCERT could not supply ${book.title}, ${part === "ps" ? "prelims" : `chapter ${Number(part)}`} right now. Previously downloaded chapters still work. Retry later or import a PDF from your device.` }, { status: 503 });
}
