"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getCategory } from "@/lib/categories";

export type FormState = { error?: string; fieldErrors?: Record<string, string[] | undefined> };

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

// Only http(s) links, so nobody can store javascript: URLs.
const optionalUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Bitte einen Link mit https:// eingeben")
  .transform((v) => v || null);

const entrySchema = z.object({
  title: z.string().trim().min(2, "Bitte einen Titel eingeben").max(150),
  description: z.string().trim().min(5, "Bitte eine kurze Beschreibung eingeben").max(5000),
  address: optionalText(300),
  phone: optionalText(50),
  mapsUrl: optionalUrl,
  website: optionalUrl,
});

function parseEntry(formData: FormData) {
  return entrySchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    address: formData.get("address") ?? "",
    phone: formData.get("phone") ?? "",
    mapsUrl: formData.get("mapsUrl") ?? "",
    website: formData.get("website") ?? "",
  });
}

export async function createEntry(
  dest: string,
  category: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const destination = await db.destination.findUnique({ where: { code: dest } });
  if (!destination || !getCategory(category)) return { error: "Unbekannte Destination oder Kategorie" };

  const parsed = parseEntry(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await db.entry.create({
    data: { ...parsed.data, destinationCode: dest, category, createdById: user.id },
  });
  revalidatePath(`/${dest}`, "layout");
  redirect(`/${dest}/${category}?sort=new`);
}

export async function updateEntry(entryId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return { error: "Eintrag nicht gefunden" };
  if (entry.createdById !== user.id && !user.isAdmin) return { error: "Du kannst nur eigene Einträge bearbeiten" };

  const parsed = parseEntry(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  await db.entry.update({ where: { id: entryId }, data: parsed.data });
  revalidatePath(`/${entry.destinationCode}`, "layout");
  redirect(`/${entry.destinationCode}/${entry.category}`);
}

export async function deleteEntry(entryId: string) {
  const user = await requireUser();
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return;
  if (entry.createdById !== user.id && !user.isAdmin) throw new Error("Nicht erlaubt");
  await db.entry.delete({ where: { id: entryId } });
  revalidatePath(`/${entry.destinationCode}`, "layout");
}

export async function rateEntry(entryId: string, stars: number) {
  const user = await requireUser();
  if (!Number.isInteger(stars) || stars < 0 || stars > 5) throw new Error("Ungültige Bewertung");
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return;
  if (stars === 0) {
    // 0 = remove my rating
    await db.rating.deleteMany({ where: { entryId, userId: user.id } });
  } else {
    await db.rating.upsert({
      where: { entryId_userId: { entryId, userId: user.id } },
      update: { stars },
      create: { entryId, userId: user.id, stars },
    });
  }
  revalidatePath(`/${entry.destinationCode}/${entry.category}`);
}

export async function toggleFavorite(entryId: string) {
  const user = await requireUser();
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return;
  const key = { entryId_userId: { entryId, userId: user.id } };
  const existing = await db.favorite.findUnique({ where: key });
  if (existing) await db.favorite.delete({ where: key });
  else await db.favorite.create({ data: { entryId, userId: user.id } });
  revalidatePath(`/${entry.destinationCode}/${entry.category}`);
}

export async function updateDestinationInfo(dest: string, formData: FormData) {
  const user = await requireUser();
  if (!user.isAdmin) throw new Error("Nur Admins können die Infos bearbeiten");
  const info = String(formData.get("info") ?? "").slice(0, 5000);
  await db.destination.update({ where: { code: dest }, data: { info } });
  revalidatePath(`/${dest}`);
}

const commentSchema = z.string().trim().min(1, "Bitte einen Kommentar eingeben").max(2000, "Maximal 2000 Zeichen");

export async function addComment(entryId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return { error: "Eintrag nicht gefunden" };
  const parsed = commentSchema.safeParse(formData.get("text") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.comment.create({ data: { entryId, userId: user.id, text: parsed.data } });
  revalidatePath(`/${entry.destinationCode}/${entry.category}`);
  return {};
}

export async function deleteComment(commentId: string) {
  const user = await requireUser();
  const comment = await db.comment.findUnique({ where: { id: commentId }, include: { entry: true } });
  if (!comment) return;
  if (comment.userId !== user.id && !user.isAdmin) throw new Error("Nicht erlaubt");
  await db.comment.delete({ where: { id: commentId } });
  revalidatePath(`/${comment.entry.destinationCode}/${comment.entry.category}`);
}
