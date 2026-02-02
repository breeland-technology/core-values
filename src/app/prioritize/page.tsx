"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import { useSessionState } from "@/hooks/useSessionState";
import { PrioritizeGroups } from "@/components/PrioritizeGroups";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui";
import { MAX_TOP_GROUPS } from "@/lib/constants";

export default function PrioritizePage() {
  const router = useRouter();
  const { state, hydrated, updateState, resetState } = useSessionState();

  const handleToggle = useCallback(
    (groupId: string) => {
      updateState((prev) => {
        const set = new Set(prev.topGroupIds);
        if (set.has(groupId)) {
          set.delete(groupId);
        } else if (set.size < MAX_TOP_GROUPS) {
          set.add(groupId);
        }
        return { ...prev, topGroupIds: Array.from(set) };
      });
    },
    [updateState]
  );

  const handleReset = useCallback(() => {
    resetState();
    router.push("/");
  }, [resetState, router]);

  if (!hydrated || !state) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-stone-500">Loading…</p>
      </main>
    );
  }

  if (state.groups.length === 0) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <header className="flex items-center justify-between">
            <Link
              href="/group"
              className="text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Back
            </Link>
            <Button variant="ghost" onClick={handleReset} className="text-sm">
              Reset
            </Button>
          </header>
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            No groups yet. Go back to group values first.
          </p>
          <Button onClick={() => router.push("/group")}>Go to Group</Button>
        </div>
      </main>
    );
  }

  const canContinue = state.topGroupIds.length >= 1;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/group"
              className="text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Back
            </Link>
            <h1 className="text-lg font-medium">Prioritize</h1>
            <Button variant="ghost" onClick={handleReset} className="text-sm">
              Reset
            </Button>
          </div>
          <StepIndicator step={3} />
        </header>

        <p className="text-sm text-stone-600 dark:text-stone-400">
          Which of these groups feel most central to you right now? Choose up to{" "}
          {MAX_TOP_GROUPS} groups—we suggest picking {MAX_TOP_GROUPS}. You&apos;re
          not ranking them, just marking the ones that matter most.
        </p>
        <PrioritizeGroups
          groups={state.groups}
          selectedGroupIds={state.topGroupIds}
          onToggle={handleToggle}
        />

        <div className="flex justify-end">
          <Button
            onClick={() => router.push("/result")}
            disabled={!canContinue}
            className="min-w-[160px]"
          >
            See results
          </Button>
        </div>
      </div>
    </main>
  );
}
