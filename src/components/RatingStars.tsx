"use client";

import { Star } from "lucide-react";

type Props = { rating: number; max?: number; size?: number; className?: string };

export function RatingStars({ rating, max = 5, size = 14, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = rating >= i + 1;
        const partial = !filled && rating > i && rating < i + 1;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 h-full w-full text-zinc-700" fill="currentColor" strokeWidth={0} />
            {filled && <Star className="absolute inset-0 h-full w-full text-[var(--gold)]" fill="currentColor" strokeWidth={0} />}
            {partial && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${(rating - i) * 100}%` }}>
                <Star className="h-full w-full text-[var(--gold)]" fill="currentColor" strokeWidth={0} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
