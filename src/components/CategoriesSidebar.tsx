"use client";

type CategoryCount = { name: string; count: number };

type Props = {
  selected: string;
  onSelect: (cat: string) => void;
  categories: CategoryCount[];
};

export function CategoriesSidebar({ selected, onSelect, categories }: Props) {
  return (
    <div className="space-y-1">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Categories</p>
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
          selected === "all"
            ? "bg-[var(--gold)]/10 text-[var(--gold)] font-medium"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <span>All Products</span>
      </button>
      {categories.map((c) => {
        const active = selected.toLowerCase() === c.name.toLowerCase();
        return (
          <button
            key={c.name}
            type="button"
            onClick={() => onSelect(c.name)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
              active
                ? "bg-[var(--gold)]/10 text-[var(--gold)] font-medium"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{c.name}</span>
            <span className={`text-xs ${active ? "text-[var(--gold)]/60" : "text-zinc-600"}`}>{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
