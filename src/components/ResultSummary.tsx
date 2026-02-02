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

  lines.push("Top groups");
  lines.push("-----------");
  topGroups.forEach((group) => {
    const cards = resolveCards(state, group.cardIds);
    lines.push(`${group.name}: ${cards.map((c) => c.label).join(", ")}`);
  });
  lines.push("");

  lines.push("All groups");
  lines.push("-----------");
  state.groups.forEach((group) => {
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
      <section className="space-y-3 rounded-lg border border-stone-200 bg-surface-muted p-4 dark:border-stone-700 dark:bg-stone-800/50">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Here&apos;s a snapshot of the values and themes that matter most to you
          right now.
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-stone-600 dark:text-stone-400">
          <li>
            When you face a decision, you might ask: which option best fits
            these values?
          </li>
          <li>
            You can return to this page anytime; your answers are saved in this
            browser.
          </li>
          <li>
            If you&apos;d like to refine your choices, use Back to revisit a
            step, or Reset to start over.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Top groups</h2>
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

      <section>
        <h2 className="mb-3 text-lg font-medium">All groups</h2>
        <ul className="space-y-4">
          {state.groups.map((group) => {
            const cards = resolveCards(state, group.cardIds);
            return (
              <li
                key={group.id}
                className="rounded-lg border border-stone-200 bg-surface-muted p-4 dark:border-stone-700 dark:bg-stone-800/50"
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

      <section className="flex flex-wrap gap-3">
        <Button onClick={handleExportJson}>Export JSON</Button>
        <Button variant="secondary" onClick={handleCopyText}>
          {copied ? "Copied" : "Copy text"}
        </Button>
      </section>
    </div>
  );
}
