"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getCategory } from "@/lib/categories";
import { toChatMsg, type ChatMsg } from "@/lib/chat";
import { rateLimit, TOO_FAST } from "@/lib/rateLimit";
import { coordsFromMapsUrl, validLatLng } from "@/lib/geo";
import { formatInTz, isHHMM, zonedToUtc } from "@/lib/time";
import { savePhotos } from "@/lib/photos";
import { REPORT_REASONS, REPORT_TYPES, type ReportType } from "@/lib/reports";

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

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

function parseEntry(formData: FormData) {
  const parsed = entrySchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    address: formData.get("address") ?? "",
    phone: formData.get("phone") ?? "",
    mapsUrl: formData.get("mapsUrl") ?? "",
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[] | undefined> };

  const fieldErrors: Record<string, string[]> = {};

  // Position: from the map picker, else from a pasted maps link
  let lat: number | null = null;
  let lng: number | null = null;
  if (str(formData, "lat") && str(formData, "lng")) {
    lat = Number(str(formData, "lat"));
    lng = Number(str(formData, "lng"));
    if (!validLatLng(lat, lng)) fieldErrors.lat = ["Ungültige Position"];
  } else if (parsed.data.mapsUrl) {
    const c = coordsFromMapsUrl(parsed.data.mapsUrl);
    if (c) ({ lat, lng } = c);
  }

  const price = str(formData, "priceLevel");
  const priceLevel = price ? Number(price) : null;
  if (priceLevel !== null && ![1, 2, 3].includes(priceLevel)) fieldErrors.priceLevel = ["Ungültige Preisklasse"];

  const openFrom = str(formData, "openFrom") || null;
  const openUntil = str(formData, "openUntil") || null;
  if ((openFrom && !isHHMM(openFrom)) || (openUntil && !isHHMM(openUntil)) || (!openFrom !== !openUntil))
    fieldErrors.openFrom = ["Bitte beide Zeiten angeben (HH:MM) oder beide leer lassen"];

  const closedDays = [...new Set(formData.getAll("closedDays").map(Number))].filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);

  if (Object.keys(fieldErrors).length) return { fieldErrors };
  return {
    data: { ...parsed.data, lat, lng, priceLevel, openFrom, openUntil, closedDays, veggie: formData.get("veggie") === "on" },
  };
}

const photoFiles = (formData: FormData) => formData.getAll("photos").filter((f): f is File => f instanceof File);

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
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };
  if (!rateLimit(`entry:${user.id}`, 10, 10 * 60_000)) return { error: TOO_FAST };

  const entry = await db.entry.create({
    data: { ...parsed.data, destinationCode: dest, category, createdById: user.id },
  });
  const photoError = await savePhotos(entry.id, user.id, photoFiles(formData));
  revalidatePath(`/${dest}`, "layout");
  if (photoError) redirect(`/${dest}/${category}/${entry.id}/edit?photoError=${encodeURIComponent(photoError)}`);
  redirect(`/${dest}/${category}?sort=new`);
}

export async function updateEntry(entryId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return { error: "Eintrag nicht gefunden" };
  if (entry.createdById !== user.id && !user.isAdmin) return { error: "Du kannst nur eigene Einträge bearbeiten" };

  const parsed = parseEntry(formData);
  if (!parsed.data) return { fieldErrors: parsed.fieldErrors };

  await db.entry.update({ where: { id: entryId }, data: parsed.data });
  const photoError = await savePhotos(entry.id, user.id, photoFiles(formData));
  if (photoError) return { error: photoError };
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

// Practical information on the destination page (admins only)
export async function updateDestinationInfo(dest: string, formData: FormData) {
  const user = await requireUser();
  if (!user.isAdmin) throw new Error("Nur Admins können die Infos bearbeiten");
  const field = (k: string, max = 1000) => String(formData.get(k) ?? "").trim().slice(0, max);
  await db.destination.update({
    where: { code: dest },
    data: {
      info: field("info", 5000),
      transferInfo: field("transferInfo"),
      currency: field("currency", 100),
      tipping: field("tipping"),
      pharmacy: field("pharmacy"),
      doctor: field("doctor"),
      emergency: field("emergency", 300),
    },
  });
  revalidatePath(`/${dest}`);
}

const commentSchema = z.string().trim().min(1, "Bitte einen Kommentar eingeben").max(2000, "Maximal 2000 Zeichen");

export async function addComment(entryId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return { error: "Eintrag nicht gefunden" };
  const parsed = commentSchema.safeParse(formData.get("text") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!rateLimit(`comment:${user.id}`, 10, 60_000)) return { error: TOO_FAST };
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

const chatSchema = z.string().trim().min(1, "Nachricht ist leer").max(1000, "Maximal 1000 Zeichen");

export async function sendChatMessage(dest: string, text: string): Promise<{ message?: ChatMsg; error?: string }> {
  const user = await requireUser();
  const destination = await db.destination.findUnique({ where: { code: dest } });
  if (!destination) return { error: "Unbekannte Destination" };
  const parsed = chatSchema.safeParse(text);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (!rateLimit(`chat:${user.id}`, 20, 60_000)) return { error: TOO_FAST };
  const m = await db.chatMessage.create({
    data: { destinationCode: dest, userId: user.id, text: parsed.data },
    include: { user: { select: { name: true, email: true } } },
  });
  return { message: toChatMsg(m, user) };
}

export async function deleteChatMessage(id: string) {
  const user = await requireUser();
  const m = await db.chatMessage.findUnique({ where: { id } });
  if (!m) return;
  if (m.userId !== user.id && !user.isAdmin) throw new Error("Nicht erlaubt");
  await db.chatMessage.delete({ where: { id } });
}

// ---------- Photos ----------

export async function addPhotos(entryId: string, formData: FormData): Promise<{ error?: string }> {
  const user = await requireUser();
  const entry = await db.entry.findUnique({ where: { id: entryId } });
  if (!entry) return { error: "Eintrag nicht gefunden" };
  if (!rateLimit(`photo:${user.id}`, 12, 10 * 60_000)) return { error: TOO_FAST };
  const error = await savePhotos(entryId, user.id, photoFiles(formData));
  revalidatePath(`/${entry.destinationCode}/${entry.category}`);
  return error ? { error } : {};
}

export async function deletePhoto(photoId: string) {
  const user = await requireUser();
  const photo = await db.photo.findUnique({ where: { id: photoId }, select: { userId: true, entry: true } });
  if (!photo) return;
  if (photo.userId !== user.id && photo.entry.createdById !== user.id && !user.isAdmin) throw new Error("Nicht erlaubt");
  await db.photo.delete({ where: { id: photoId } });
  revalidatePath(`/${photo.entry.destinationCode}/${photo.entry.category}`);
}

// ---------- Reports ----------


async function reportTargetExists(type: ReportType, id: string) {
  if (type === "entry") return !!(await db.entry.findUnique({ where: { id }, select: { id: true } }));
  if (type === "comment") return !!(await db.comment.findUnique({ where: { id }, select: { id: true } }));
  if (type === "chat") return !!(await db.chatMessage.findUnique({ where: { id }, select: { id: true } }));
  return !!(await db.photo.findUnique({ where: { id }, select: { id: true } }));
}

export async function reportContent(type: ReportType, targetId: string, reason: string, note: string): Promise<{ error?: string }> {
  const user = await requireUser();
  if (!REPORT_TYPES.includes(type) || !(REPORT_REASONS as readonly string[]).includes(reason)) return { error: "Ungültige Meldung" };
  if (!rateLimit(`report:${user.id}`, 10, 10 * 60_000)) return { error: TOO_FAST };
  if (!(await reportTargetExists(type, targetId))) return { error: "Inhalt nicht gefunden" };
  const cleanNote = String(note ?? "").trim().slice(0, 500) || null;
  await db.report.upsert({
    where: { targetType_targetId_reporterId: { targetType: type, targetId, reporterId: user.id } },
    update: { reason, note: cleanNote, status: "open", resolvedAt: null, resolvedBy: null },
    create: { targetType: type, targetId, reason, note: cleanNote, reporterId: user.id },
  });
  revalidatePath("/admin");
  return {};
}

// ---------- Meetups ----------

const meetupSchema = z.object({
  title: z.string().trim().min(2, "Was ist geplant?").max(120),
  place: z
    .string()
    .trim()
    .max(200)
    .transform((v) => v || null),
  startsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Bitte Datum und Uhrzeit angeben"),
});

export async function createMeetup(dest: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const destination = await db.destination.findUnique({ where: { code: dest } });
  if (!destination) return { error: "Unbekannte Destination" };
  const parsed = meetupSchema.safeParse({
    title: formData.get("title") ?? "",
    place: formData.get("place") ?? "",
    startsAt: formData.get("startsAt") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const startsAt = zonedToUtc(parsed.data.startsAt, destination.timezone);
  if (!startsAt) return { error: "Ungültige Uhrzeit" };
  const now = Date.now();
  if (startsAt.getTime() < now - 60 * 60_000) return { error: "Der Zeitpunkt liegt in der Vergangenheit" };
  if (startsAt.getTime() > now + 14 * 24 * 60 * 60_000) return { error: "Bitte höchstens zwei Wochen im Voraus" };
  if (!rateLimit(`meetup:${user.id}`, 5, 60 * 60_000)) return { error: TOO_FAST };

  await db.meetup.create({
    data: {
      destinationCode: dest,
      title: parsed.data.title,
      place: parsed.data.place,
      startsAt,
      createdById: user.id,
      attendees: { create: { userId: user.id } },
    },
  });
  // Announce it in the crew chat, so everyone in town sees it
  const when = formatInTz(startsAt, destination.timezone, { weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
  await db.chatMessage.create({
    data: {
      destinationCode: dest,
      userId: user.id,
      text: `📅 Neuer Treffpunkt: ${parsed.data.title}, ${when}${parsed.data.place ? ` · ${parsed.data.place}` : ""}. Wer kommt mit?`,
    },
  });
  revalidatePath(`/${dest}`, "layout");
  return {};
}

export async function toggleMeetup(meetupId: string) {
  const user = await requireUser();
  const meetup = await db.meetup.findUnique({ where: { id: meetupId } });
  if (!meetup) return;
  const key = { meetupId_userId: { meetupId, userId: user.id } };
  const existing = await db.meetupAttendee.findUnique({ where: key });
  if (existing) await db.meetupAttendee.delete({ where: key });
  else await db.meetupAttendee.create({ data: { meetupId, userId: user.id } });
  revalidatePath(`/${meetup.destinationCode}`, "layout");
}

export async function deleteMeetup(meetupId: string) {
  const user = await requireUser();
  const meetup = await db.meetup.findUnique({ where: { id: meetupId } });
  if (!meetup) return;
  if (meetup.createdById !== user.id && !user.isAdmin) throw new Error("Nicht erlaubt");
  await db.meetup.delete({ where: { id: meetupId } });
  revalidatePath(`/${meetup.destinationCode}`, "layout");
}

// ---------- My nightstops & digest ----------

export async function addNightstop(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const dest = String(formData.get("dest") ?? "");
  const date = String(formData.get("date") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Bitte ein Datum wählen" };
  const destination = await db.destination.findUnique({ where: { code: dest } });
  if (!destination || !destination.active) return { error: "Bitte eine Destination wählen" };
  const day = new Date(`${date}T00:00:00Z`);
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
  if (isNaN(day.getTime()) || day < today) return { error: "Das Datum liegt in der Vergangenheit" };
  if (day.getTime() > today.getTime() + 366 * 24 * 60 * 60_000) return { error: "Bitte höchstens ein Jahr im Voraus" };
  if ((await db.nightstop.count({ where: { userId: user.id, date: { gte: today } } })) >= 50) return { error: "Maximal 50 geplante Nightstops" };
  await db.nightstop.upsert({
    where: { userId_destinationCode_date: { userId: user.id, destinationCode: dest, date: day } },
    update: {},
    create: { userId: user.id, destinationCode: dest, date: day },
  });
  revalidatePath("/");
  revalidatePath("/meine-nightstops");
  return {};
}

export async function removeNightstop(id: string) {
  const user = await requireUser();
  await db.nightstop.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/");
  revalidatePath("/meine-nightstops");
}

export async function setDigest(enabled: boolean) {
  const user = await requireUser();
  await db.user.update({ where: { id: user.id }, data: { digestEnabled: !!enabled } });
  revalidatePath("/meine-nightstops");
}
