"use client";

import { useCallback, useEffect } from "react";
import type { ValueCard as ValueCardType } from "@/lib/types";
import { ValueCard } from "./ValueCard";
import { Button } from "./ui";

interface CardDeckProps {
  currentCard: ValueCardType | null;
  remainingCount: number;
  onYes: () => void;
  onNo: () => void;
}

export function CardDeck({
  currentCard,
  remainingCount,
  onYes,
  onNo,
}: CardDeckProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!currentCard) return;
      if (e.key === "y" || e.key === "Y" || e.key === "ArrowRight") {
        e.preventDefault();
        onYes();
      } else if (e.key === "n" || e.key === "N" || e.key === "ArrowLeft") {
        e.preventDefault();
        onNo();
      }
    },
    [currentCard, onYes, onNo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!currentCard) {
    return (
      <div className="rounded-lg border border-stone-200 bg-surface-muted p-8 text-center text-stone-600 dark:border-stone-700 dark:text-stone-400">
        <p>No more cards to review.</p>
        <p className="mt-1 text-sm">Add a custom value or continue to grouping.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        {remainingCount} card{remainingCount !== 1 ? "s" : ""} left
      </p>
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <ValueCard card={currentCard} variant="select" />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onNo}
          className="min-w-[100px]"
          aria-label="No, skip this value"
        >
          No
        </Button>
        <Button
          type="button"
          onClick={onYes}
          className="min-w-[100px]"
          aria-label="Yes, keep this value"
        >
          Yes
        </Button>
      </div>
      <p className="text-center text-xs text-stone-400 dark:text-stone-500">
        Keyboard: Y / N or arrow keys
      </p>
    </div>
  );
}
