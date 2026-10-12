import Link from "next/link";
import { Stars } from "@/components/Stars";
import { DeleteButton, ExpandableText, FavoriteButton, RateControl } from "@/components/EntryActions";
import { Comments, type CommentView } from "@/components/Comments";

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
  comments: CommentView[];
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

      <div className="mt-2">
        <ExpandableText text={e.description} />
      </div>

      {(e.address || e.phone || mapsHref || e.website) && (
        <dl className="mt-3 space-y-1 text-sm">
          {e.address && <dd>📍 {e.address}</dd>}
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
