"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
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
import { ValueCard as ValueCardComponent } from "./ValueCard";

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
  onRemovePile: (pileId: string) => void;
}

function PoolDroppable({ cards }: { cards: ValueCard[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: POOL_ID });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] max-h-[60vh] overflow-y-auto rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver
          ? "border-teal-500 bg-teal-50/50 dark:border-teal-400 dark:bg-teal-950/30"
          : "border-stone-200 bg-stone-100/80 dark:border-stone-600 dark:bg-stone-800/30"
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
  onRemovePile,
}: PileListProps) {
  const [activeCard, setActiveCard] = useState<ValueCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const card = event.active.data.current?.card as ValueCard | undefined;
    if (card) setActiveCard(card);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveCard(null);
      if (!over) return;
      const cardId = String(active.id);
      const targetId = String(over.id);
      if (targetId === POOL_ID) {
        onMoveCard(cardId, null);
      } else {
        onMoveCard(cardId, targetId);
      }
    },
    [onMoveCard]
  );

  const unassignedIds = getUnassignedCardIds(state);
  const unassignedCards = resolveCards(state, unassignedIds);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DragOverlay dropAnimation={null}>
        {activeCard ? (
          <div className="cursor-grabbing rounded-lg border border-stone-200 bg-white shadow-lg dark:border-stone-700 dark:bg-stone-800">
            <ValueCardComponent card={activeCard} variant="group" />
          </div>
        ) : null}
      </DragOverlay>
      <div className="space-y-4">
        <div className="flex min-h-0 gap-4">
          {/* Left panel: Unassigned */}
          <div className="flex w-64 min-w-[240px] flex-shrink-0 flex-col">
            <h3 className="mb-2 text-sm font-medium text-stone-600 dark:text-stone-400">
              Unassigned
            </h3>
            <PoolDroppable cards={unassignedCards} />
          </div>
          {/* Right panel: groups (wrap) */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-4">
              {state.piles.map((pile) => (
                <div
                  key={pile.id}
                  className="w-[260px] min-w-[260px] flex-shrink-0"
                >
                  <PileColumn
                    pile={pile}
                    cards={resolveCards(state, pile.cardIds)}
                    onRename={onRenamePile}
                    onRemove={onRemovePile}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={onAddPile}
                className="flex min-h-[120px] w-[260px] min-w-[260px] flex-shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-surface-muted p-4 text-sm text-stone-600 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-stone-600 dark:bg-stone-800/50 dark:text-stone-400 dark:hover:border-teal-400 dark:hover:text-teal-400"
              >
                + New group
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}