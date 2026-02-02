"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionState } from "@/hooks/useSessionState";
import { Button } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const { state, hydrated } = useSessionState();
  const hasProgress =
    hydrated &&
    state &&
    (state.selectedCardIds.length > 0 ||
      state.piles.length > 0 ||
      state.topPileIds.length > 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md space-y-8 text-center">
        <h1 className="text-2xl font-medium text-stone-800 dark:text-stone-100">
          Values Card Sort
        </h1>
        <div className="space-y-2 text-stone-600 dark:text-stone-400">
          <p>
            Clarify and reflect on what matters to you. Swipe or click through
            value cards, then group and prioritize.
          </p>
          <p className="text-sm">
            This exercise helps you notice which values tend to matter most to
            you—there are no right answers.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.push("/select")}
            className="min-w-[140px]"
          >
            {hasProgress ? "Continue" : "Start"}
          </Button>
        </div>
      </div>
    </main>
  );
}
