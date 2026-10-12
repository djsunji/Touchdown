import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getCategory } from "@/lib/categories";
import { updateEntry } from "@/app/actions";
import { EntryForm } from "@/components/EntryForm";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ dest: string; category: string; id: string }>;
}) {
  const { dest, category, id } = await params;
  const user = await requireUser();
  const cat = getCategory(category);
  const entry = await db.entry.findUnique({ where: { id } });
  if (!cat || !entry || entry.destinationCode !== dest || entry.category !== category) notFound();
  if (entry.createdById !== user.id && !user.isAdmin) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Tipp bearbeiten</h1>
      <EntryForm
        action={updateEntry.bind(null, entry.id)}
        defaults={entry}
        cancelHref={`/${dest}/${category}`}
        submitLabel="Änderungen speichern"
      />
    </div>
  );
}
