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
      <div className="sticky top-28">
        <div className="rounded-2xl border border-[var(--gray-100)] bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-[var(--gray-900)]">Categories</p>
            <button type="button" onClick={() => onSelect("all")}
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gray-400)] hover:text-[var(--gray-900)] transition-colors">
              Reset
            </button>
          </div>
          <div className="mt-4 space-y-1">
            <button type="button" onClick={() => onSelect("all")}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                selected === "all"
                  ? "bg-[var(--gray-900)] text-white"
                  : "text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)]"
              }`}>
              <span>All</span>
              <span className={`text-[11px] ${selected === "all" ? "text-white/60" : "text-[var(--gray-300)]"}`}>
                {categories.reduce((acc, c) => acc + c.count, 0)}
              </span>
            </button>
            {categories.map((c) => {
              const active = selected.toLowerCase() === c.name.toLowerCase();
              return (
                <button key={c.name} type="button" onClick={() => onSelect(c.name)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                    active
                      ? "bg-[var(--gray-50)] text-[var(--gray-900)]"
                      : "text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)]"
                  }`}>
                  <span>{c.name}</span>
                  <span className="text-[11px] text-[var(--gray-300)]">{c.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
