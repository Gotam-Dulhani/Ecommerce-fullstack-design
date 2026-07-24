"use client";

type Props = {
  className?: string;
};

export function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
