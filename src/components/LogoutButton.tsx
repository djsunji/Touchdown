"use client";

import { useTransition } from "react";
import { logout } from "@/app/logout";

/** Signs out and first deletes the offline copies, so nothing stays on a shared device. */
export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            if ("caches" in window) for (const key of await caches.keys()) await caches.delete(key);
          } catch {
            // Cache API unavailable (private mode): nothing stored, nothing to delete
          }
          await logout();
        })
      }
      className="rounded-md border border-white/40 px-3 py-1 hover:bg-white/10 disabled:opacity-60"
    >
      Abmelden
    </button>
  );
}
