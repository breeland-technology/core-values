"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import { useSessionState } from "@/hooks/useSessionState";
import { PileList } from "@/components/PileList";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui";

function generatePileId(): string {
  return `pile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function GroupPage() {
  const router = useRouter();
  const { state, hydrated, updateState, resetState } = useSessionState();

  const handleMoveCard = useCallback(
    (cardId: string, targetPileId: string | null) => {
      updateState((prev) => {
        const removeFromPiles = (piles: { id: string; name: string; cardIds: string[] }[]) =>
          piles.map((p) => ({
            ...p,
            cardIds: p.cardIds.filter((id) => id !== cardId),
          }));
        const addToPile = (
          piles: { id: string; name: string; cardIds: string[] }[],
          pileId: string
        ) =>
          piles.map((p) =>
            p.id === pileId
              ? { ...p, cardIds: [...p.cardIds, cardId] }
              : p
          );
        let nextPiles = removeFromPiles(prev.piles);
        if (targetPileId) {
          nextPiles = addToPile(nextPiles, targetPileId);
        }
        return { ...prev, piles: nextPiles };
      });
    },
    [updateState]
  );

  const handleRenamePile = useCallback(
    (pileId: string, name: string) => {
      updateState((prev) => ({
        ...prev,
        piles: prev.piles.map((p) =>
          p.id === pileId ? { ...p, name } : p
        ),
      }));
    },
    [updateState]
  );

  const handleAddPile = useCallback(() => {
    const count = state?.piles.length ?? 0;
    updateState((prev) => ({
      ...prev,
      piles: [
        ...prev.piles,
        {
          id: generatePileId(),
          name: `Group ${count + 1}`,
          cardIds: [],
        },
      ],
    }));
  }, [state?.piles.length, updateState]);

  const handleRemovePile = useCallback(
    (pileId: string) => {
      updateState((prev) => ({
        ...prev,
        piles: prev.piles.filter((p) => p.id !== pileId),
      }));
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

  const selectedCount = state.selectedCardIds.length;
  if (selectedCount === 0) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <header className="flex items-center justify-between">
            <Link
              href="/select"
              className="text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Back
            </Link>
            <Button variant="ghost" onClick={handleReset} className="text-sm">
              Reset
            </Button>
          </header>
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            No values selected yet. Go back to select values first.
          </p>
          <Button onClick={() => router.push("/select")}>Go to Select</Button>
        </div>
      </main>
    );
  }

  const hasNonEmptyGroup = state.piles.some((p) => p.cardIds.length > 0);
  const canContinue = hasNonEmptyGroup;

  const showOneValueHint =
    state.piles.length >= 3 &&
    state.piles.filter((p) => p.cardIds.length === 1).length >= 2;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/select"
              className="text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            >
              Back
            </Link>
            <h1 className="text-lg font-medium">Group values</h1>
            <Button variant="ghost" onClick={handleReset} className="text-sm">
              Reset
            </Button>
          </div>
          <StepIndicator step={2} />
        </header>

        <p className="text-sm text-stone-600 dark:text-stone-400">
          Group values that feel related in a way that makes sense to you. You
          can create new groups, move values between them, or leave some
          unassigned.
        </p>

        {showOneValueHint && (
          <p className="text-xs text-stone-400 dark:text-stone-500">
            If it helps, you can group values that feel connected or point in a
            similar direction.
          </p>
        )}

        <PileList
          state={state}
          onMoveCard={handleMoveCard}
          onRenamePile={handleRenamePile}
          onAddPile={handleAddPile}
          onRemovePile={handleRemovePile}
        />

        <div className="flex flex-col items-end gap-1">
          {!canContinue && (
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Create at least one group to continue.
            </p>
          )}
          <Button
            onClick={() => router.push("/prioritize")}
            disabled={!canContinue}
            className="min-w-[160px]"
          >
            Continue to Prioritize
          </Button>
        </div>
      </div>
    </main>
  );
}
