"use client";

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full bg-[var(--gray-100)]" />
      <div className="mt-4 px-0.5 space-y-2">
        <div className="h-2.5 w-16 bg-[var(--gray-100)] rounded" />
        <div className="h-3.5 w-full bg-[var(--gray-100)] rounded" />
        <div className="h-3.5 w-14 bg-[var(--gray-100)] rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}
