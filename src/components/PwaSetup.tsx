"use client";

import { useEffect, useState } from "react";

/** Registers the service worker (production only) and shows a banner while offline. */
export function PwaSetup() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="offline-banner" role="status">
      📴 Offline: du siehst die gespeicherte Version. Bewerten, Kommentieren und Chat gehen erst wieder mit Netz.
    </div>
  );
}
