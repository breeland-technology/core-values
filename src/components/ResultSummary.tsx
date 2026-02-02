"use client";

import { useCallback, useState } from "react";
import type { SessionState, Group } from "@/lib/types";
import { resolveCards } from "@/lib/state-helpers";
import { exportStateJSON } from "@/lib/storage";
import { Button } from "@/components/ui";

interface ResultSummaryProps {
  state: SessionState;
}

function getTopGroups(state: SessionState): Group[] {
  const byId = new Map(state.groups.map((g) => [g.id, g]));
  return state.topGroupIds
    .map((id) => byId.get(id))
    .filter((g): g is Group => g != null);
}

function formatAsText(state: SessionState): string {
  const topGroups = getTopGroups(state);
  const lines: string[] = ["Values Card Sort – Results", ""];

  lines.push("Top value themes");
  lines.push("-----------------");
  topGroups.forEach((group) => {
    const cards = resolveCards(state, group.cardIds);
    lines.push(`${group.name}: ${cards.map((c) => c.label).join(", ")}`);
  });

  return lines.join("\n");
}

export function ResultSummary({ state }: ResultSummaryProps) {
  const [copied, setCopied] = useState(false);
  const topGroups = getTopGroups(state);

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
      <p className="text-base font-semibold text-stone-600 dark:text-stone-400">
        Here&apos;s a snapshot of the values and themes that feel most central to you
        right now.
      </p>

      <section>
        <h2 className="mb-3 text-lg font-medium">Top value themes</h2>
        <ul className="space-y-4">
          {topGroups.map((group) => {
            const cards = resolveCards(state, group.cardIds);
            return (
              <li
                key={group.id}
                className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-800"
              >
                <h3 className="font-medium text-stone-800 dark:text-stone-100">
                  {group.name}
                </h3>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {cards.map((c) => c.label).join(", ")}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3 text-center">
        <p className="mb-12 text-base font-semibold text-stone-600 dark:text-stone-400">
          There&apos;s nothing you need to do with this right now.
        </p>
        <p className="text-base text-stone-600 dark:text-stone-400">
          When facing a decision, you might ask:
        </p>
        <p className="text-base font-semibold italic text-stone-600 dark:text-stone-400">
          &ldquo;Which option best fits these values?&rdquo;
        </p>
      </section>

      <p className="text-center text-xs text-stone-500 dark:text-stone-400">
        You can return to this page anytime — your answers are saved in this
        browser.
        <br />
        Use Back to revisit a step, or Reset to start over.
      </p>

      <section className="flex flex-wrap justify-center gap-3">
        <Button onClick={handleExportJson}>Export JSON</Button>
        <Button variant="secondary" onClick={handleCopyText}>
          {copied ? "Copied" : "Copy summary"}
        </Button>
      </section>
    </div>
  );
}
