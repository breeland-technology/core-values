"use client";

import type { ValueCard as ValueCardType } from "@/lib/types";

interface ValueCardProps {
  card: ValueCardType;
  variant?: "select" | "group" | "result";
  className?: string;
}

export function ValueCard({ card, variant = "select", className = "" }: ValueCardProps) {
  const base =
    "rounded-lg border border-stone-200 bg-white px-4 py-3 text-stone-800 shadow-sm dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100";
  const size =
    variant === "select"
      ? "text-lg min-h-[80px] flex items-center justify-center"
      : variant === "group"
        ? "text-sm py-2"
        : "text-sm py-2";
  return (
    <div className={`${base} ${size} ${className}`} data-value-id={card.id}>
      {card.label}
    </div>
  );
}
