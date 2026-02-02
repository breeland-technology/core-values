"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useSessionState } from "@/hooks/useSessionState";
import {
  getCurrentCard,
  getRemainingCount,
} from "@/lib/state-helpers";
import { CardDeck } from "@/components/CardDeck";
import { AddCustomValue } from "@/components/AddCustomValue";
import { Button } from "@/components/ui";
import type { ValueCard } from "@/lib/types";

function generateCustomId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function SelectPage() {
  const router = useRouter();
  const { state, hydrated, updateState, resetState } = useSessionState();
  const [showAddCustom, setShowAddCustom] = useState(false);

  const handleYes = useCallback(() => {
    if (!state) return;
    const current = getCurrentCard(state);
    if (!current) return;
    updateState((prev) => ({
      ...prev,
      selectedCardIds: [...prev.selectedCardIds, current.id],
    }));
  }, [state, updateState]);

  const handleNo = useCallback(() => {
    if (!state) return;
    const current = getCurrentCard(state);
    if (!current) return;
    updateState((prev) => ({
      ...prev,
      discardedCardIds: [...prev.discardedCardIds, current.id],
    }));
  }, [state, updateState]);

  const handleAddCustom = useCallback(
    (label: string) => {
      const card: ValueCard = {
        id: generateCustomId(),
        label: label.trim(),
        source: "custom",
      };
      updateState((prev) => ({
        ...prev,
        customCards: [...prev.customCards, card],
        selectedCardIds: [...prev.selectedCardIds, card.id],
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

  const currentCard = getCurrentCard(state);
  const remainingCount = getRemainingCount(state);
  const selectedCount = state.selectedCardIds.length;
  const canContinue = selectedCount > 0;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-lg space-y-6">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
          >
            Back
          </Link>
          <h1 className="text-lg font-medium">Select values</h1>
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="text-sm"
          >
            Reset
          </Button>
        </header>

        <p className="text-sm text-stone-600 dark:text-stone-400">
          Swipe or click Yes to keep a value, No to skip. You can add your own
          values below.
        </p>

        <CardDeck
          currentCard={currentCard}
          remainingCount={remainingCount}
          onYes={handleYes}
          onNo={handleNo}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAddCustom(true)}
            className="text-sm"
          >
            Add your own value
          </Button>
          <Button
            onClick={() => router.push("/group")}
            disabled={!canContinue}
            className="min-w-[160px]"
          >
            Continue to Group ({selectedCount} selected)
          </Button>
        </div>
      </div>

      <AddCustomValue
        isOpen={showAddCustom}
        onAdd={handleAddCustom}
        onClose={() => setShowAddCustom(false)}
      />
    </main>
  );
}
