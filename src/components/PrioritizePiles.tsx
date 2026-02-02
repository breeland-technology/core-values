"use client";

import type { Pile } from "@/lib/types";
import { MAX_TOP_PILES } from "@/lib/constants";

interface PrioritizePilesProps {
  piles: Pile[];
  selectedPileIds: string[];
  onToggle: (pileId: string) => void;
}

export function PrioritizePiles({
  piles,
  selectedPileIds,
  onToggle,
}: PrioritizePilesProps) {
  const set = new Set(selectedPileIds);
  const canSelectMore = set.size < MAX_TOP_PILES;

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600 dark:text-stone-400">
        Choose your top {MAX_TOP_PILES} piles (no ranking required). You can
        select up to {MAX_TOP_PILES}.
      </p>
      <div className="flex flex-wrap gap-2">
        {piles.map((pile) => {
          const selected = set.has(pile.id);
          const disabled = !selected && !canSelectMore;
          return (
            <button
              key={pile.id}
              type="button"
              onClick={() => !disabled && onToggle(pile.id)}
              disabled={disabled}
              aria-pressed={selected}
              className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                selected
                  ? "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  : "bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-600 dark:text-stone-100 dark:hover:bg-stone-500"
              }`}
            >
              {pile.name}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        {set.size} of {MAX_TOP_PILES} selected
      </p>
    </div>
  );
}
