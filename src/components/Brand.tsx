import Image from "next/image";

/** Touchdown logo: pin icon on a light chip (readable on the dark header) plus wordmark. */
export function Brand({ size = 32, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="inline-flex rounded-lg bg-white p-0.5 shadow-sm">
        <Image src="/logo-icon.png" alt={wordmark ? "" : "Touchdown"} width={size} height={size} priority />
      </span>
      {wordmark && <span className="wordmark text-xl">Touchdown</span>}
    </span>
  );
}
