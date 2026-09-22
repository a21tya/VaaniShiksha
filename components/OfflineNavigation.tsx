"use client";
import { useEffect } from "react";
export default function OfflineNavigation() {
  useEffect(() => {
    // Use cached HTML offline instead of requesting an uncached RSC payload.
    function navigate(event: MouseEvent) {
      if (navigator.onLine || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest?.("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search && url.hash)) return;
      event.preventDefault(); event.stopImmediatePropagation(); location.assign(url.href);
    }
    document.documentElement.dataset.offlineNavigationReady = "true";
    document.addEventListener("click", navigate, true);
    return () => { delete document.documentElement.dataset.offlineNavigationReady; document.removeEventListener("click", navigate, true); };
  }, []);
  return null;
}
