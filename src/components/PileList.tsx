"use client";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import type { SessionState, Pile } from "@/lib/types";
import { resolveCards } from "@/lib/state-helpers";
import type { ValueCard } from "@/lib/types";
import { PileColumn } from "./PileColumn";
import { DraggableCard } from "./DraggableCard";

const POOL_ID = "pool";

function getCardIdsInPiles(piles: Pile[]): Set<string> {
  const set = new Set<string>();
  piles.forEach((p) => p.cardIds.forEach((id) => set.add(id)));
  return set;
}

function getUnassignedCardIds(state: SessionState): string[] {
  const inPiles = getCardIdsInPiles(state.piles);
  return state.selectedCardIds.filter((id) => !inPiles.has(id));
}

interface PileListProps {
  state: SessionState;
  onMoveCard: (cardId: string, targetPileId: string | null) => void;
  onRenamePile: (pileId: string, name: string) => void;
  onAddPile: () => void;
}

function PoolDroppable({ cards }: { cards: ValueCard[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: POOL_ID });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver
          ? "border-teal-500 bg-teal-50/50 dark:border-teal-400 dark:bg-teal-950/30"
          : "border-stone-300 bg-surface-muted dark:border-stone-600 dark:bg-stone-800/50"
      }`}
    >
      <div className="space-y-2">
        {cards.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}
        {cards.length === 0 && (
          <p className="py-4 text-center text-sm text-stone-400 dark:text-stone-500">
            Drop cards here
          </p>
        )}
      </div>
    </div>
  );
}

export function PileList({
  state,
  onMoveCard,
  onRenamePile,
  onAddPile,
}: PileListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const cardId = String(active.id);
    const targetId = String(over.id);
    if (targetId === POOL_ID) {
      onMoveCard(cardId, null);
    } else {
      onMoveCard(cardId, targetId);
    }
  };

  const unassignedIds = getUnassignedCardIds(state);
  const unassignedCards = resolveCards(state, unassignedIds);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[200px] max-w-[280px]">
            <h3 className="mb-2 text-sm font-medium text-stone-600 dark:text-stone-400">
              Unassigned
            </h3>
            <PoolDroppable cards={unassignedCards} />
          </div>
          {state.piles.map((pile) => (
            <div key={pile.id} className="min-w-[200px] max-w-[280px]">
              <PileColumn
                pile={pile}
                cards={resolveCards(state, pile.cardIds)}
                onRename={onRenamePile}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onAddPile}
          className="rounded-lg border-2 border-dashed border-stone-300 px-4 py-2 text-sm text-stone-600 hover:border-teal-500 hover:text-teal-600 dark:border-stone-600 dark:text-stone-400 dark:hover:border-teal-400 dark:hover:text-teal-400"
        >
          + New pile
        </button>
      </div>
    </DndContext>
  );
}