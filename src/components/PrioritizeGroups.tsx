"use client";

import type { Group } from "@/lib/types";
import { MAX_TOP_GROUPS } from "@/lib/constants";

interface PrioritizeGroupsProps {
  groups: Group[];
  selectedGroupIds: string[];
  onToggle: (groupId: string) => void;
}

export function PrioritizeGroups({
  groups,
  selectedGroupIds,
  onToggle,
}: PrioritizeGroupsProps) {
  const set = new Set(selectedGroupIds);
  const canSelectMore = set.size < MAX_TOP_GROUPS;

  return (
    <div className="space-y-4">
      <p className="text-xs text-stone-400 dark:text-stone-500">
        You&apos;re not ranking them—just marking what matters most.
      </p>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => {
          const selected = set.has(group.id);
          const disabled = !selected && !canSelectMore;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => !disabled && onToggle(group.id)}
              disabled={disabled}
              aria-pressed={selected}
              className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 ${
                selected
                  ? "bg-stone-700 text-white border-2 border-stone-600 hover:bg-stone-600 dark:bg-stone-600 dark:border-stone-500 dark:hover:bg-stone-500"
                  : "bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-600 dark:text-stone-100 dark:hover:bg-stone-500"
              }`}
            >
              {selected && (
                <span className="text-[0.65rem] opacity-90" aria-hidden>
                  ✓
                </span>
              )}
              {group.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
