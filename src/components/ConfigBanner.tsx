"use client";

import { useAuth } from "../context/AuthContext";

export function ConfigBanner() {
  const { configError } = useAuth();

  if (!configError) return null;

  return (
    <div className="border-b border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-3 text-center text-sm text-[var(--gold)]">
      <p className="font-semibold">Firebase not configured</p>
      <p className="mt-1 text-xs text-[var(--gold)]/70">
        {configError}
      </p>
    </div>
  );
}
