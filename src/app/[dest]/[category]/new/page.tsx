import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCategory } from "@/lib/categories";
import { createEntry } from "@/app/actions";
import { EntryForm } from "@/components/EntryForm";
import { mapConfig } from "@/lib/mapConfig";
import { mapCenter } from "@/lib/cities";
import { MAX_PHOTOS_PER_ENTRY } from "@/lib/photos";

export default async function NewEntryPage({ params }: { params: Promise<{ dest: string; category: string }> }) {
  const { dest, category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const destination = await db.destination.findUniqueOrThrow({ where: { code: dest } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">
        Neuer Tipp: {dest} · {cat.label}
      </h1>
      <EntryForm
        action={createEntry.bind(null, dest, category)}
        cancelHref={`/${dest}/${category}`}
        submitLabel="Tipp speichern"
        dest={dest}
        mapConfig={mapConfig()}
        center={mapCenter(destination)}
        photoSlots={MAX_PHOTOS_PER_ENTRY}
      />
    </div>
  );
}
