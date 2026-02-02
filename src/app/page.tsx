"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useSessionState } from "@/hooks/useSessionState";
import { Button } from "@/components/ui";
import { importStateJSON } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const { state, hydrated, replaceState } = useSessionState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasProgress =
    hydrated &&
    state &&
    (state.selectedCardIds.length > 0 ||
      state.piles.length > 0 ||
      state.topPileIds.length > 0);

  const handleImportJson = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = String(reader.result);
          const imported = importStateJSON(json);
          if (imported) {
            replaceState(imported);
          }
        } catch {
          // ignore invalid file
        }
        e.target.value = "";
      };
      reader.readAsText(file);
    },
    [replaceState]
  );

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center p-6">
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
      </div>
      <div className="flex justify-center pb-8">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden
        />
        <Button
          type="button"
          variant="ghost"
          onClick={handleImportJson}
          className="text-sm text-stone-500 dark:text-stone-400"
        >
          Import from JSON
        </Button>
      </div>
    </main>
  );
}
