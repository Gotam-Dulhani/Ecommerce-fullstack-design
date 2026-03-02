"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className, children, ...props }: Props) {
  return (
    <div
      className={twMerge(
        "rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: Props) {
  return (
    <div
      className={twMerge("px-4 pt-4 md:px-5 md:pt-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: Props) {
  return (
    <div
      className={twMerge("px-4 pb-4 md:px-5 md:pb-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

