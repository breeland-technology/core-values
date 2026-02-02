"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import { useSessionState } from "@/hooks/useSessionState";
import { ResultSummary } from "@/components/ResultSummary";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui";

export default function ResultPage() {
  const router = useRouter();
  const { state, hydrated, resetState } = useSessionState();

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
              href="/prioritize"
              className="text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Back
            </Link>
            <Button variant="ghost" onClick={handleReset} className="text-sm">
              Reset
            </Button>
          </header>
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            No groups yet. Complete the group and prioritize steps first.
          </p>
          <Button onClick={() => router.push("/prioritize")}>
            Go to Prioritize
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/prioritize"
              className="text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Back
            </Link>
            <h1 className="text-lg font-medium">Results</h1>
            <Button variant="ghost" onClick={handleReset} className="text-sm">
              Reset
            </Button>
          </div>
          <StepIndicator step={4} />
        </header>

        <ResultSummary state={state} />
      </div>
    </main>
  );
}
