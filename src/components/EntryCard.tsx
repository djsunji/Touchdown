import Link from "next/link";
import { Stars } from "@/components/Stars";
import { DeleteButton, ExpandableText, FavoriteButton, RateControl } from "@/components/EntryActions";
import { Comments, type CommentView } from "@/components/Comments";
import { AddPhotos, PhotoStrip, type PhotoView } from "@/components/Photos";
import { ReportButton } from "@/components/ReportButton";
import type { OpenState } from "@/lib/time";

export type EntryView = {
  id: string;
  title: string;
  description: string;
  address: string | null;
  phone: string | null;
  mapsUrl: string | null;
  website: string | null;
  createdAt: Date;
  authorName: string;
  avg: number;
  count: number;
  myRating: number;
  isFavorite: boolean;
  canEdit: boolean;
  editHref: string;
  mapHref: string | null;
  comments: CommentView[];
  priceLevel: number | null;
  open: OpenState;
  hours: string | null;
  veggie: boolean;
  walk: string | null;
  photos: PhotoView[];
  photoSlots: number;
};

export function EntryCard({ e }: { e: EntryView }) {
  const mapsHref =
    e.mapsUrl ?? (e.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}` : null);

  return (
    <article id={e.id} className="scroll-mt-24 rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-bold">{e.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {e.count > 0 ? (
            <>
              <span>
                {e.avg.toFixed(1)} ({e.count})
              </span>
              <Stars value={e.avg} />
            </>
          ) : (
            <span className="text-xs">Noch keine Bewertung</span>
          )}
        </div>
      </div>

      {(e.priceLevel || e.open || e.veggie || e.walk) && (
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          {e.priceLevel ? <span className="badge" title="Preisklasse">{"€".repeat(e.priceLevel)}</span> : null}
          {e.open && (
            <span className={`badge ${e.open.open ? "badge-open" : "badge-closed"}`} title={e.hours ?? undefined}>
              {e.open.open ? "🟢" : "🔴"} {e.open.label}
            </span>
          )}
          {e.veggie && <span className="badge badge-veg">🌱 Vegi-freundlich</span>}
          {e.walk && (
            <span className="badge" title="Geschätzt, Luftlinie mit Umwegfaktor">
              🚶 {e.walk}
            </span>
          )}
        </div>
      )}

      <div className="mt-2">
        <ExpandableText text={e.description} />
      </div>

      {e.photos.length > 0 && (
        <div className="mt-3">
          <PhotoStrip photos={e.photos} title={e.title} />
        </div>
      )}

      {(e.address || e.phone || mapsHref || e.website || e.hours || e.mapHref) && (
        <dl className="mt-3 space-y-1 text-sm">
          {e.address && <dd>📍 {e.address}</dd>}
          {e.hours && <dd>🕒 {e.hours}</dd>}
          {e.mapHref && (
            <dd>
              🧭 <Link href={e.mapHref} className="text-brand hover:underline">Auf der Touchdown-Karte zeigen</Link>
            </dd>
          )}
          {e.phone && (
            <dd>
              📞 <a href={`tel:${e.phone.replace(/[^+\d]/g, "")}`} className="text-brand hover:underline">{e.phone}</a>
            </dd>
          )}
          {mapsHref && (
            <dd>
              🗺️ <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">In Google Maps öffnen</a>
            </dd>
          )}
          {e.website && (
            <dd>
              🔗 <a href={e.website} target="_blank" rel="noopener noreferrer" className="break-all text-brand hover:underline">
                {e.website.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          )}
        </dl>
      )}

      <footer className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-3">
        <RateControl entryId={e.id} myRating={e.myRating} />
        <FavoriteButton entryId={e.id} isFavorite={e.isFavorite} />
        <span className="text-xs text-gray-400">
          von {e.authorName} · {e.createdAt.toLocaleDateString("de-CH")}
        </span>
        <AddPhotos entryId={e.id} slots={e.photoSlots} />
        {!e.canEdit && <ReportButton type="entry" id={e.id} />}
        {e.canEdit && (
          <span className="ml-auto flex gap-4">
            <Link href={e.editHref} className="text-sm text-brand hover:underline">Bearbeiten</Link>
            <DeleteButton entryId={e.id} title={e.title} />
          </span>
        )}
      </footer>

      <Comments entryId={e.id} comments={e.comments} />
    </article>
  );
}
