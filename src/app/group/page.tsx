"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCallback } from "react";
import { useSessionState } from "@/hooks/useSessionState";
import { GroupList } from "@/components/GroupList";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui";

function generateGroupId(): string {
  return `group-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function GroupPage() {
  const router = useRouter();
  const { state, hydrated, updateState, resetState } = useSessionState();

  const handleMoveCard = useCallback(
    (cardId: string, targetGroupId: string | null) => {
      updateState((prev) => {
        const removeFromGroups = (groups: { id: string; name: string; cardIds: string[] }[]) =>
          groups.map((g) => ({
            ...g,
            cardIds: g.cardIds.filter((id) => id !== cardId),
          }));
        const addToGroup = (
          groups: { id: string; name: string; cardIds: string[] }[],
          groupId: string
        ) =>
          groups.map((g) =>
            g.id === groupId
              ? { ...g, cardIds: [...g.cardIds, cardId] }
              : g
          );
        let nextGroups = removeFromGroups(prev.groups);
        if (targetGroupId) {
          nextGroups = addToGroup(nextGroups, targetGroupId);
        }
        return { ...prev, groups: nextGroups };
      });
    },
    [updateState]
  );

  const handleRenameGroup = useCallback(
    (groupId: string, name: string) => {
      updateState((prev) => ({
        ...prev,
        groups: prev.groups.map((g) =>
          g.id === groupId ? { ...g, name } : g
        ),
      }));
    },
    [updateState]
  );

  const handleAddGroup = useCallback(() => {
    const count = state?.groups.length ?? 0;
    updateState((prev) => ({
      ...prev,
      groups: [
        ...prev.groups,
        {
          id: generateGroupId(),
          name: `Theme ${count + 1}`,
          cardIds: [],
        },
      ],
    }));
  }, [state?.groups.length, updateState]);

  const handleRemoveGroup = useCallback(
    (groupId: string) => {
      updateState((prev) => ({
        ...prev,
        groups: prev.groups.filter((g) => g.id !== groupId),
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

  const hasNonEmptyGroup = state.groups.some((g) => g.cardIds.length > 0);
  const canContinue = hasNonEmptyGroup;

  const showOneValueHint =
    state.groups.length >= 3 &&
    state.groups.filter((g) => g.cardIds.length === 1).length >= 2;

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
        <p className="text-sm italic text-stone-500 dark:text-stone-400">
          These groups often point toward broader themes about what matters to
          you.
        </p>

        {showOneValueHint && (
          <p className="text-xs text-stone-400 dark:text-stone-500">
            If it helps, you can group values that feel connected or point in a
            similar direction.
          </p>
        )}

        <GroupList
          state={state}
          onMoveCard={handleMoveCard}
          onRenameGroup={handleRenameGroup}
          onAddGroup={handleAddGroup}
          onRemoveGroup={handleRemoveGroup}
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
