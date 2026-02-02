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
      <p className="text-xs text-stone-500 dark:text-stone-500">
        Choose your top {MAX_TOP_GROUPS} groups. You can select up to{" "}
        {MAX_TOP_GROUPS}.
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
              className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                selected
                  ? "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                  : "bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-600 dark:text-stone-100 dark:hover:bg-stone-500"
              }`}
            >
              {group.name}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        {set.size} of {MAX_TOP_GROUPS} selected
      </p>
    </div>
  );
}
