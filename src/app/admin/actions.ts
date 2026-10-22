"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { isBootstrapAdmin, requireAdmin } from "@/lib/session";
import { validTimeZone } from "@/lib/time";
import { validLatLng } from "@/lib/geo";
import type { FormState } from "@/app/actions";

export async function resolveReport(reportId: string) {
  const admin = await requireAdmin();
  const report = await db.report.findUnique({ where: { id: reportId } });
  if (!report) return;
  // Close every open report on the same content at once
  await db.report.updateMany({
    where: { targetType: report.targetType, targetId: report.targetId, status: "open" },
    data: { status: "done", resolvedBy: admin.email, resolvedAt: new Date() },
  });
  revalidatePath("/admin");
}

export async function deleteReportedContent(reportId: string) {
  const admin = await requireAdmin();
  const report = await db.report.findUnique({ where: { id: reportId } });
  if (!report) return;
  const id = report.targetId;
  if (report.targetType === "entry") await db.entry.deleteMany({ where: { id } });
  else if (report.targetType === "comment") await db.comment.deleteMany({ where: { id } });
  else if (report.targetType === "chat") await db.chatMessage.deleteMany({ where: { id } });
  else if (report.targetType === "photo") await db.photo.deleteMany({ where: { id } });
  await db.report.updateMany({
    where: { targetType: report.targetType, targetId: id, status: "open" },
    data: { status: "done", resolvedBy: admin.email, resolvedAt: new Date() },
  });
  revalidatePath("/", "layout");
}

export async function setUserRole(userId: string, role: string) {
  const admin = await requireAdmin();
  if (role !== "admin" && role !== "user") throw new Error("Ungültige Rolle");
  if (userId === admin.id) throw new Error("Die eigene Rolle kann nicht geändert werden");
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;
  if (role === "user" && isBootstrapAdmin(user.email)) throw new Error("Admins aus ADMIN_EMAILS werden in der Konfiguration verwaltet");
  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
}

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const destinationSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "IATA-Code mit 3 Buchstaben, z. B. ZRH"),
  city: z.string().trim().min(2, "Stadt fehlt").max(80),
  country: z.string().trim().min(2, "Land fehlt").max(80),
  timezone: z.string().trim().refine(validTimeZone, "Unbekannte Zeitzone"),
  hotelName: optional(150),
  hotelAddress: optional(300),
});

/** Creates a destination (mode "create") or updates an existing one. */
export async function saveDestination(mode: "create" | "update", _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = destinationSchema.safeParse({
    code: formData.get("code") ?? "",
    city: formData.get("city") ?? "",
    country: formData.get("country") ?? "",
    timezone: formData.get("timezone") ?? "",
    hotelName: formData.get("hotelName") ?? "",
    hotelAddress: formData.get("hotelAddress") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const latRaw = String(formData.get("hotelLat") ?? "").trim();
  const lngRaw = String(formData.get("hotelLng") ?? "").trim();
  let hotelLat: number | null = null;
  let hotelLng: number | null = null;
  if (latRaw && lngRaw) {
    hotelLat = Number(latRaw);
    hotelLng = Number(lngRaw);
    if (!validLatLng(hotelLat, hotelLng)) return { error: "Ungültige Hotel-Position" };
  }
  const active = formData.get("active") === "on";
  const { code, ...rest } = parsed.data;
  const data = { ...rest, hotelLat, hotelLng, active };

  if (mode === "create") {
    if (await db.destination.findUnique({ where: { code } })) return { error: `${code} gibt es schon` };
    const last = await db.destination.aggregate({ _max: { sortOrder: true } });
    await db.destination.create({ data: { code, ...data, sortOrder: (last._max.sortOrder ?? 0) + 1 } });
  } else {
    if (!(await db.destination.findUnique({ where: { code } }))) return { error: "Destination nicht gefunden" };
    await db.destination.update({ where: { code }, data });
  }
  revalidatePath("/", "layout");
  return {};
}
