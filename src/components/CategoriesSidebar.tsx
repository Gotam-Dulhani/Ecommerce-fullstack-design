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
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm shadow-slate-900/5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Categories</p>
            <p className="mt-1 text-xs text-slate-500">Quick filter by type</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect("all")}
            className="text-xs font-semibold text-indigo-700 hover:underline"
          >
            Reset
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => onSelect("all")}
            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
              selected === "all"
                ? "border-slate-900 bg-slate-900 text-white shadow-sm shadow-slate-900/20"
                : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white"
            }`}
          >
            <span>All</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                selected === "all" ? "bg-white/15 text-white/90" : "bg-slate-100 text-slate-600"
              }`}
            >
              {categories.reduce((acc, c) => acc + c.count, 0)}
            </span>
          </button>

          <div className="grid grid-cols-1 gap-2">
            {categories.map((c) => {
              const active = selected.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onSelect(c.name)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                      : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white"
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}


