"use client";

import { useEffect, useState } from "react";

export function useLearningShelf(key: string) {
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    function read() {
      try {
        const stored: unknown = JSON.parse(localStorage.getItem(key) || "[]");
        setSaved(Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : []);
      } catch { setMessage("Your browser could not load saved items."); }
      setReady(true);
    }
    read();
    const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) read(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key]);

  function toggle(id: string) {
    if (!ready) return;
    const next = saved.includes(id) ? saved.filter(item => item !== id) : [...saved, id];
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setSaved(next);
      setMessage(next.includes(id) ? "Saved on this device." : "Removed from your saved items.");
    } catch { setMessage("Your browser could not save this item. Check that site storage is allowed."); }
  }
  return { saved, ready, message, toggle };
}
