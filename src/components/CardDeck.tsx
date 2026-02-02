"use client";

import { useCallback, useEffect } from "react";
import type { ValueCard as ValueCardType } from "@/lib/types";
import { ValueCard } from "./ValueCard";
import { Button } from "./ui";

interface CardDeckProps {
  currentCard: ValueCardType | null;
  remainingCount: number;
  onVeryImportant: () => void;
  onSomewhatImportant: () => void;
  onNotImportant: () => void;
}

export function CardDeck({
  currentCard,
  remainingCount,
  onVeryImportant,
  onSomewhatImportant,
  onNotImportant,
}: CardDeckProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!currentCard) return;
      if (e.key === "1" || e.key === "v" || e.key === "V") {
        e.preventDefault();
        onVeryImportant();
      } else if (e.key === "2" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        onSomewhatImportant();
      } else if (e.key === "3" || e.key === "n" || e.key === "N") {
        e.preventDefault();
        onNotImportant();
      }
    },
    [currentCard, onVeryImportant, onSomewhatImportant, onNotImportant]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!currentCard) {
    return (
      <div className="rounded-lg border border-stone-200 bg-surface-muted p-8 text-center text-stone-600 dark:border-stone-700 dark:text-stone-400">
        <p>No more cards to review.</p>
        <p className="mt-1 text-sm">
          Only Very important values go to the groups step. Add a custom value
          or continue.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        {remainingCount} card{remainingCount !== 1 ? "s" : ""} left
      </p>
      <p className="text-center text-sm font-medium text-stone-700 dark:text-stone-300">
        How important is it for you to live by this value?
      </p>
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <ValueCard card={currentCard} variant="select" />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onVeryImportant}
          className="min-w-[120px]"
          aria-label="Very important"
        >
          Very important
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onSomewhatImportant}
          className="min-w-[120px]"
          aria-label="Somewhat important"
        >
          Somewhat important
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onNotImportant}
          className="min-w-[120px]"
          aria-label="Not important"
        >
          Not important
        </Button>
      </div>
      <p className="text-center text-xs text-stone-400 dark:text-stone-500">
        Keyboard: 1 / 2 / 3 or V / S / N
      </p>
    </div>
  );
}
