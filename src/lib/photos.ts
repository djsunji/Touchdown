import sharp from "sharp";
import { db } from "@/lib/db";

export const MAX_PHOTOS_PER_ENTRY = 4;
const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Stores uploaded images for an entry. Every file is decoded and re-encoded with sharp:
 * that rejects anything that is not a real image, applies the camera rotation and
 * drops all metadata (EXIF incl. GPS position). Returns an error text or null.
 */
export async function savePhotos(entryId: string, userId: string, files: File[]): Promise<string | null> {
  const images = files.filter((f) => f.size > 0);
  if (images.length === 0) return null;
  const existing = await db.photo.count({ where: { entryId } });
  if (existing + images.length > MAX_PHOTOS_PER_ENTRY) return `Maximal ${MAX_PHOTOS_PER_ENTRY} Fotos pro Tipp.`;

  for (const file of images) {
    if (file.size > MAX_BYTES) return "Ein Foto ist grösser als 10 MB.";
    if (!file.type.startsWith("image/")) return "Bitte nur Bilder hochladen (JPG, PNG, WebP, HEIC).";
    try {
      const input = Buffer.from(await file.arrayBuffer());
      const base = sharp(input, { limitInputPixels: 50_000_000 }).rotate();
      const { data, info } = await base
        .clone()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
      const thumb = await base.clone().resize({ width: 480, height: 480, fit: "cover" }).jpeg({ quality: 72 }).toBuffer();
      await db.photo.create({
        data: { entryId, userId, mime: "image/jpeg", data, thumb, width: info.width, height: info.height },
      });
    } catch {
      return "Ein Bild konnte nicht gelesen werden. Bitte ein anderes Foto wählen.";
    }
  }
  return null;
}
