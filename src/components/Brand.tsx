import Image from "next/image";

/** Touchdown logo: app icon plus two-tone wordmark. */
export function Brand({ size = 32, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image src="/logo-icon.png" alt={wordmark ? "" : "Touchdown"} width={size} height={size} className="rounded-[22%]" priority />
      {wordmark && (
        <span className="wordmark text-xl">
          Touch<span className="text-brand-light">down</span>
        </span>
      )}
    </span>
  );
}
