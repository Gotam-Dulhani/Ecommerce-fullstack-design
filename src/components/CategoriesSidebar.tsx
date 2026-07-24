"use client";

export type CategoryCount = { name: string; count: number };

export function CategoriesSidebar({
  selected,
  onSelect,
  categories,
}: {
  selected: string;
  onSelect: (category: string) => void;
  categories: CategoryCount[];
}) {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Categories</p>
          <button
            type="button"
            onClick={() => onSelect("all")}
            className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => onSelect("all")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
              selected === "all"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>All</span>
            <span className={`text-xs ${selected === "all" ? "text-white/70" : "text-gray-400"}`}>
              {categories.reduce((acc, c) => acc + c.count, 0)}
            </span>
          </button>
          {categories.map((c) => {
            const active = selected.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onSelect(c.name)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">{c.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
