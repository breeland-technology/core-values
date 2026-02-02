"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Group } from "@/lib/types";
import type { ValueCard } from "@/lib/types";
import { DraggableCard } from "./DraggableCard";

interface GroupColumnProps {
  group: Group;
  cards: ValueCard[];
  onRename: (groupId: string, name: string) => void;
  onRemove: (groupId: string) => void;
}

function isDefaultName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed === "" || /^Group \d+$/.test(trimmed);
}

export function GroupColumn({ group, cards, onRename, onRemove }: GroupColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: group.id,
  });

  const nameIsDefault = isDefaultName(group.name);
  const isEmpty = cards.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`group flex min-h-[120px] w-full min-w-[260px] max-w-[260px] flex-col rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver
          ? "border-teal-500 bg-teal-50/50 dark:border-teal-400 dark:bg-teal-950/30"
          : "border-stone-300 bg-surface-muted dark:border-stone-600 dark:bg-stone-800/50"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          value={group.name}
          onChange={(e) => onRename(group.id, e.target.value)}
          className={`min-w-0 flex-1 rounded border border-stone-200 bg-white px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-stone-600 dark:bg-stone-700 ${
            nameIsDefault
              ? "italic text-stone-400 placeholder-stone-400 dark:text-stone-500 dark:placeholder-stone-500"
              : "text-stone-800 dark:text-stone-100"
          }`}
          placeholder="Group name"
          aria-label={`Group name: ${group.name}`}
        />
        {isEmpty && (
          <button
            type="button"
            onClick={() => onRemove(group.id)}
            className="shrink-0 text-xs text-stone-400 opacity-0 transition-opacity hover:text-stone-600 focus:opacity-100 focus:outline-none group-hover:opacity-100 dark:text-stone-500 dark:hover:text-stone-300"
            aria-label={`Remove ${group.name}`}
          >
            Remove
          </button>
        )}
      </div>
      <div className="max-h-[50vh] min-h-[60px] space-y-2 overflow-y-auto">
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
