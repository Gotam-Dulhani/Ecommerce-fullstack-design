"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "outline" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg" | "icon";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
};

const baseClasses =
  "inline-flex items-center justify-center font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-[rgb(37,99,235)] disabled:opacity-60 disabled:cursor-not-allowed";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white shadow-sm shadow-slate-900/20 hover:bg-slate-800",
  outline:
    "border border-slate-200 bg-white text-slate-900 shadow-sm shadow-slate-900/5 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
  subtle:
    "bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 border border-slate-200/70",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-2xl px-3 py-1.5 text-xs",
  md: "rounded-2xl px-4 py-2.5 text-sm",
  lg: "rounded-2xl px-5 py-3 text-sm",
  icon: "rounded-full p-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={twMerge(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {leadingIcon && (
        <span className="mr-1.5 flex items-center" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
    </button>
  );
}

