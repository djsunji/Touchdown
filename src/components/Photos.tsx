"use client";

import { useEffect, useState, useTransition } from "react";
import { addPhotos, deletePhoto } from "@/app/actions";
import { PhotoInput } from "@/components/PhotoInput";
import { ReportButton } from "@/components/ReportButton";

export type PhotoView = { id: string; canDelete: boolean };

export function PhotoStrip({ photos, title }: { photos: PhotoView[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  if (photos.length === 0) return null;
  const current = open !== null ? photos[open] : null;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((p, i) => (
          <button key={p.id} type="button" onClick={() => setOpen(i)} className="shrink-0 overflow-hidden rounded-md ring-1 ring-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/photos/${p.id}?size=thumb`} alt={`Foto ${i + 1} zu ${title}`} width={112} height={112} loading="lazy" className="h-24 w-24 object-cover sm:h-28 sm:w-28" />
          </button>
        ))}
      </div>
      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Foto zu ${title}`} onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/photos/${current.id}`} alt={`Foto zu ${title}`} onClick={(e) => e.stopPropagation()} />
          <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <span>
              {open! + 1} / {photos.length}
            </span>
            <span className="flex items-center gap-4">
              <ReportButton type="photo" id={current.id} light />
              {current.canDelete && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    if (confirm("Foto löschen?"))
                      startTransition(async () => {
                        await deletePhoto(current.id);
                        setOpen(null);
                      });
                  }}
                  className="text-red-300 hover:underline"
                >
                  Löschen
                </button>
              )}
              <button type="button" onClick={() => setOpen(null)} className="hover:underline">
                Schliessen ✕
              </button>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export function AddPhotos({ entryId, slots }: { entryId: string; slots: number }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  if (slots <= 0) return null;
  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-gray-500 hover:text-brand">
        📷 Foto hinzufügen
      </button>
    );
  return (
    <form
      className="w-full space-y-2 rounded-md bg-gray-50 p-3"
      action={(fd) =>
        startTransition(async () => {
          const res = await addPhotos(entryId, fd);
          if (res.error) setError(res.error);
          else {
            setError(null);
            setOpen(false);
          }
        })
      }
    >
      <PhotoInput max={slots} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button disabled={pending} className="rounded-md bg-brand px-3 py-1.5 text-sm text-brand-contrast disabled:opacity-60">
          {pending ? "Hochladen…" : "Hochladen"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-md px-3 py-1.5 text-sm hover:bg-gray-100">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
