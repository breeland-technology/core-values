import type { SessionState, ValueCard } from "./types";
import { getCatalogValues, getCatalogValueById } from "./catalog";

export function getFullDeck(state: SessionState): ValueCard[] {
  const catalog = getCatalogValues();
  const custom = state.customCards;
  const catalogIds = new Set(catalog.map((c) => c.id));
  const customOnly = custom.filter((c) => !catalogIds.has(c.id));
  return [...catalog, ...customOnly];
}

export function getCurrentCard(state: SessionState): ValueCard | null {
  const deck = getFullDeck(state);
  const selected = new Set(state.selectedCardIds);
  const discarded = new Set(state.discardedCardIds);
  return deck.find(
    (c) => !selected.has(c.id) && !discarded.has(c.id)
  ) ?? null;
}

export function getRemainingCount(state: SessionState): number {
  const deck = getFullDeck(state);
  const decided = new Set([
    ...state.selectedCardIds,
    ...state.discardedCardIds,
  ]);
  return deck.filter((c) => !decided.has(c.id)).length;
}

export function resolveCards(state: SessionState, cardIds: string[]): ValueCard[] {
  const catalogById = new Map(
    getCatalogValues().map((c) => [c.id, c])
  );
  state.customCards.forEach((c) => catalogById.set(c.id, c));
  return cardIds
    .map((id) => catalogById.get(id) ?? getCatalogValueById(id))
    .filter((c): c is ValueCard => c != null);
}

export function getSelectedCards(state: SessionState): ValueCard[] {
  return resolveCards(state, state.selectedCardIds);
}
