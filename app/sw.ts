/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global { interface WorkerGlobalScope extends SerwistGlobalConfig { __SW_MANIFEST: (PrecacheEntry | string)[] | undefined; } }
declare const self: ServiceWorkerGlobalScope;
const PAGE_CACHE = "vaani-offline-pages-v1";
const BOOK_CACHE = "vaani-offline-books-v1";
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST, skipWaiting: true, clientsClaim: true, navigationPreload: false,
  runtimeCaching: [
    { matcher: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith("/api/books/"), handler: async ({ request }) => (await caches.open(BOOK_CACHE)).match(request) .then(cached => cached || fetch(request)) },
    { matcher: ({ request, url }) => request.mode === "navigate" && url.origin === self.location.origin,
      handler: async ({ request, url }) => {
        const cache = await caches.open(PAGE_CACHE);
        try {
          const response = await fetch(request, { signal: AbortSignal.timeout(5000) });
          if (response.ok && response.headers.get("content-type")?.includes("text/html")) { await cache.put(url.pathname, response.clone()); return response; }
          return await cache.match(url.pathname, { ignoreVary: true }) || response;
        } catch { return await cache.match(url.pathname, { ignoreVary: true }) || await cache.match("/offline", { ignoreVary: true }) || new Response("Open VaaniShiksha online once and use Offline setup to download the app.", { status: 503, headers: { "Content-Type": "text/plain" } }); }
      }
    }, ...defaultCache,
  ],
});
serwist.addEventListeners();
