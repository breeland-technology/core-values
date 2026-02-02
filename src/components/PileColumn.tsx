"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Pile } from "@/lib/types";
import type { ValueCard } from "@/lib/types";
import { DraggableCard } from "./DraggableCard";

interface PileColumnProps {
  pile: Pile;
  cards: ValueCard[];
  onRename: (pileId: string, name: string) => void;
}

export function PileColumn({ pile, cards, onRename }: PileColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: pile.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] w-full min-w-[200px] max-w-[280px] rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver
          ? "border-teal-500 bg-teal-50/50 dark:border-teal-400 dark:bg-teal-950/30"
          : "border-stone-300 bg-surface-muted dark:border-stone-600 dark:bg-stone-800/50"
      }`}
    >
      <input
        type="text"
        value={pile.name}
        onChange={(e) => onRename(pile.id, e.target.value)}
        className="mb-3 w-full rounded border border-stone-200 bg-white px-2 py-1.5 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
        placeholder="Pile name"
        aria-label={`Pile name: ${pile.name}`}
      />
      <div className="space-y-2">
        {cards.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}
        {cards.length === 0 && (
          <p className="py-4 text-center text-sm text-stone-400 dark:text-stone-500">
            Drop cards here
          </p>
        )}
      </div>
    </div>
  );
}
