"use client";

import { useRef, useState } from "react";

const MAX_EDGE = 2000;
const MAX_FILE = 10 * 1024 * 1024;

/** Shrinks a photo in the browser before upload (saves roaming data); the server re-checks and re-encodes it. */
async function shrink(file: File): Promise<File> {
  if (file.type === "image/gif" || file.type === "image/heic" || file.type === "image/heif") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
}

export function PhotoInput({ max = 4, name = "photos" }: { max?: number; name?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onChange() {
    const input = ref.current!;
    const files = [...(input.files ?? [])];
    setError(null);
    if (files.length > max) {
      setError(`Bitte höchstens ${max} Fotos auswählen.`);
      input.value = "";
      return;
    }
    if (files.some((f) => !f.type.startsWith("image/"))) {
      setError("Bitte nur Bilder auswählen.");
      input.value = "";
      return;
    }
    setInfo("Fotos werden vorbereitet…");
    const shrunk = await Promise.all(files.map(shrink));
    if (shrunk.some((f) => f.size > MAX_FILE)) {
      setError("Ein Foto ist grösser als 10 MB.");
      input.value = "";
      setInfo(null);
      return;
    }
    const dt = new DataTransfer();
    shrunk.forEach((f) => dt.items.add(f));
    input.files = dt.files;
    setInfo(files.length ? `${files.length} ${files.length === 1 ? "Foto" : "Fotos"} bereit` : null);
  }

  return (
    <div>
      <input
        ref={ref}
        type="file"
        name={name}
        accept="image/*"
        multiple
        onChange={onChange}
        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm hover:file:bg-gray-200"
      />
      {info && !error && <p className="mt-1 text-xs text-gray-500">{info}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
