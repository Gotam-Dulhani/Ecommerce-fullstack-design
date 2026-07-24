"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Free shipping on orders over $150",
  "New arrivals every week — shop the latest",
  "30-day easy returns on all orders",
  "Use code WELCOME10 for 10% off your first order",
];

export function AnnouncementBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white">
      <div className="mx-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium tracking-wide sm:text-[13px]">
        <span className="hidden h-1 w-1 rounded-full bg-emerald-400 sm:block" />
        <span
          key={idx}
          className="animate-fade-up text-center"
        >
          {MESSAGES[idx]}
        </span>
      </div>
    </div>
  );
}
