export function Stars({ value, size = "text-lg" }: { value: number; size?: string }) {
  return (
    <span className={`inline-flex ${size} leading-none`} aria-label={`${value.toFixed(1)} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1))); // supports half stars
        return (
          <span key={i} className="relative inline-block text-gray-300">
            ★
            <span className="absolute inset-0 overflow-hidden text-accent" style={{ width: `${fill * 100}%` }}>
              ★
            </span>
          </span>
        );
      })}
    </span>
  );
}
