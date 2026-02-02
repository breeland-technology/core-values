"use client";

import { useCallback, useState } from "react";
import type { SessionState, Pile } from "@/lib/types";
import { resolveCards } from "@/lib/state-helpers";
import { exportStateJSON } from "@/lib/storage";
import { Button } from "@/components/ui";

interface ResultSummaryProps {
  state: SessionState;
}

function getTopPiles(state: SessionState): Pile[] {
  const byId = new Map(state.piles.map((p) => [p.id, p]));
  return state.topPileIds
    .map((id) => byId.get(id))
    .filter((p): p is Pile => p != null);
}

function formatAsText(state: SessionState): string {
  const topPiles = getTopPiles(state);
  const lines: string[] = ["Values Card Sort – Results", ""];

  lines.push("Top piles");
  lines.push("--------");
  topPiles.forEach((pile) => {
    const cards = resolveCards(state, pile.cardIds);
    lines.push(`${pile.name}: ${cards.map((c) => c.label).join(", ")}`);
  });
  lines.push("");

  lines.push("All piles");
  lines.push("---------");
  state.piles.forEach((pile) => {
    const cards = resolveCards(state, pile.cardIds);
    lines.push(`${pile.name}: ${cards.map((c) => c.label).join(", ")}`);
  });

  return lines.join("\n");
}

export function ResultSummary({ state }: ResultSummaryProps) {
  const [copied, setCopied] = useState(false);
  const topPiles = getTopPiles(state);

  const handleExportJson = useCallback(() => {
    const json = exportStateJSON(state);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "values-session.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const handleCopyText = useCallback(async () => {
    const text = formatAsText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback or ignore
    }
  }, [state]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-medium">Top piles</h2>
        <ul className="space-y-4">
          {topPiles.map((pile) => {
            const cards = resolveCards(state, pile.cardIds);
            return (
              <li
                key={pile.id}
                className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-800"
              >
                <h3 className="font-medium text-stone-800 dark:text-stone-100">
                  {pile.name}
                </h3>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {cards.map((c) => c.label).join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">All piles</h2>
        <ul className="space-y-4">
          {state.piles.map((pile) => {
            const cards = resolveCards(state, pile.cardIds);
            return (
              <li
                key={pile.id}
                className="rounded-lg border border-stone-200 bg-surface-muted p-4 dark:border-stone-700 dark:bg-stone-800/50"
              >
                <h3 className="font-medium text-stone-800 dark:text-stone-100">
                  {pile.name}
                </h3>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {cards.map((c) => c.label).join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-wrap gap-3">
        <Button onClick={handleExportJson}>Export JSON</Button>
        <Button variant="secondary" onClick={handleCopyText}>
          {copied ? "Copied" : "Copy text"}
        </Button>
      </section>
    </div>
  );
}
