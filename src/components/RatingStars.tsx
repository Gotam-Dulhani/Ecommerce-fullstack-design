"use client";

type Props = {
  rating: number;
  count?: number;
  size?: "sm" | "md";
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function RatingStars({ rating, count, size = "sm" }: Props) {
  const r = clamp(rating, 0, 5);
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const starClass = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";
  const textClass = size === "md" ? "text-[13px]" : "text-[12px]";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-[2px]">
        {Array.from({ length: full }).map((_, i) => (
          <svg key={`f-${i}`} viewBox="0 0 20 20" className={`${starClass} fill-[var(--amber)]`}>
            <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        ))}
        {half === 1 && (
          <svg viewBox="0 0 20 20" className={`${starClass} fill-[var(--amber)]`}>
            <defs><linearGradient id="half"><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="var(--gray-200)" /></linearGradient></defs>
            <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" fill="url(#half)" />
          </svg>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <svg key={`e-${i}`} viewBox="0 0 20 20" className={`${starClass} fill-[var(--gray-200)]`}>
            <path d="M10 15.27 16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        ))}
      </div>
      <span className={`${textClass} font-medium text-[var(--gray-700)]`}>{r.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className={`${textClass} text-[var(--gray-400)]`}>({count})</span>
      )}
    </div>
  );
}
