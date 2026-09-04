import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window !== "undefined") {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
      window.removeEventListener("online", callback);
      window.removeEventListener("offline", callback);
    };
  }
  return () => {};
}

function getSnapshot() {
  if (typeof navigator !== "undefined") {
    return navigator.onLine;
  }
  return true;
}

function getServerSnapshot() {
  return true;
}

export function useNetworkStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}


