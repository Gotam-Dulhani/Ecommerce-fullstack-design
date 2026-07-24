"use client";

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white">
      <div className="aspect-square w-full bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-12 bg-gray-100 rounded" />
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
