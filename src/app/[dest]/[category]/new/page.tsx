import { notFound } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { createEntry } from "@/app/actions";
import { EntryForm } from "@/components/EntryForm";

export default async function NewEntryPage({ params }: { params: Promise<{ dest: string; category: string }> }) {
  const { dest, category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">
        Neuer Tipp: {dest} · {cat.label}
      </h1>
      <EntryForm
        action={createEntry.bind(null, dest, category)}
        cancelHref={`/${dest}/${category}`}
        submitLabel="Tipp speichern"
      />
    </div>
  );
}
