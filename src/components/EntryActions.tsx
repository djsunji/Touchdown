"use client";

import { useOptimistic, useState, useTransition } from "react";
import { deleteEntry, rateEntry, toggleFavorite } from "@/app/actions";

export function RateControl({ entryId, myRating }: { entryId: string; myRating: number }) {
  const [optimistic, setOptimistic] = useOptimistic(myRating);
  const [hover, setHover] = useState(0);
  const [pending, startTransition] = useTransition();
  const shown = hover || optimistic;

  function rate(stars: number) {
    const next = stars === optimistic ? 0 : stars; // clicking your current rating removes it
    startTransition(async () => {
      setOptimistic(next);
      await rateEntry(entryId, next);
    });
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>{optimistic ? "Deine Bewertung" : "Bewerten"}</span>
      <span className={`inline-flex text-xl leading-none ${pending ? "opacity-60" : ""}`} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHover(i)}
            onClick={() => rate(i)}
            className={i <= shown ? "text-accent" : "text-gray-300 hover:text-gray-400"}
            aria-label={`${i} ${i === 1 ? "Stern" : "Sterne"}`}
          >
            ★
          </button>
        ))}
      </span>
    </div>
  );
}

export function FavoriteButton({ entryId, isFavorite }: { entryId: string; isFavorite: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(isFavorite);
  const [, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          await toggleFavorite(entryId);
        })
      }
      className={`text-xl leading-none ${optimistic ? "text-red-500" : "text-gray-300 hover:text-red-300"}`}
      aria-label={optimistic ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      title={optimistic ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
    >
      ♥
    </button>
  );
}

export function DeleteButton({ entryId, title }: { entryId: string; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`„${title}“ wirklich löschen?`)) startTransition(() => deleteEntry(entryId));
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Löschen…" : "Löschen"}
    </button>
  );
}

export function ExpandableText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 280;
  return (
    <div>
      <p className={`whitespace-pre-line text-gray-700 ${long && !open ? "line-clamp-4" : ""}`}>{text}</p>
      {long && (
        <button type="button" onClick={() => setOpen(!open)} className="mt-1 text-sm text-brand hover:underline">
          {open ? "Weniger anzeigen" : "Mehr anzeigen"}
        </button>
      )}
    </div>
  );
}
