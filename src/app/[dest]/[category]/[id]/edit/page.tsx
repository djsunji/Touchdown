import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getCategory } from "@/lib/categories";
import { updateEntry } from "@/app/actions";
import { EntryForm } from "@/components/EntryForm";
import { PhotoStrip } from "@/components/Photos";
import { MAX_PHOTOS_PER_ENTRY } from "@/lib/photos";

export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ dest: string; category: string; id: string }>;
  searchParams: Promise<{ photoError?: string }>;
}) {
  const { dest, category, id } = await params;
  const { photoError } = await searchParams;
  const user = await requireUser();
  const cat = getCategory(category);
  const entry = await db.entry.findUnique({
    where: { id },
    include: { photos: { select: { id: true, userId: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!cat || !entry || entry.destinationCode !== dest || entry.category !== category) notFound();
  if (entry.createdById !== user.id && !user.isAdmin) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Tipp bearbeiten</h1>
      {entry.photos.length > 0 && (
        <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-2 text-sm font-medium">Fotos</h2>
          <PhotoStrip photos={entry.photos.map((p) => ({ id: p.id, canDelete: true }))} title={entry.title} />
        </section>
      )}
      <EntryForm
        action={updateEntry.bind(null, entry.id)}
        defaults={entry}
        cancelHref={`/${dest}/${category}`}
        submitLabel="Änderungen speichern"
        photoSlots={MAX_PHOTOS_PER_ENTRY - entry.photos.length}
        initialError={photoError?.slice(0, 200)}
      />
    </div>
  );
}
