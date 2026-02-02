"use client";

import { useDraggable } from "@dnd-kit/core";
import type { ValueCard as ValueCardType } from "@/lib/types";
import { ValueCard } from "./ValueCard";

interface DraggableCardProps {
  card: ValueCardType;
}

export function DraggableCard({ card }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    data: { card },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-50" : ""}
    >
      <ValueCard card={card} variant="group" />
    </div>
  );
}
