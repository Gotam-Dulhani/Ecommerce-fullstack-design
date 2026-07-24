"use client";

import { useAuth } from "../context/AuthContext";

export function ConfigBanner() {
  const { configError } = useAuth();

  if (!configError) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
      <p className="font-semibold">Firebase not configured</p>
      <p className="mt-1 text-xs text-amber-700">
        {configError}
      </p>
    </div>
  );
}
