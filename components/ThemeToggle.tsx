"use client";
import { useSyncExternalStore } from "react";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("vaani-theme"); } catch {}
    const theme = saved === "light" || saved === "dark" ? saved : media.matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    callback();
  };
  window.addEventListener("vaani-theme-change", callback);
  window.addEventListener("storage", sync);
  media.addEventListener("change", sync);
  return () => { window.removeEventListener("vaani-theme-change", callback); window.removeEventListener("storage", sync); media.removeEventListener("change", sync); };
};
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme || "light", () => "light");
  return <button className="theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={() => {
    const next = theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("vaani-theme", next); } catch {}
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.dispatchEvent(new Event("vaani-theme-change"));
  }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{theme === "dark" ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></> : <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>}</svg></button>;
}
