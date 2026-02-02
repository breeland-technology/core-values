export type ValueCardSource = "catalog" | "custom";

export interface ValueCard {
  id: string;
  label: string;
  source: ValueCardSource;
  tag?: string;
}

export interface Pile {
  id: string;
  name: string;
  cardIds: string[];
}

export interface SessionState {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  selectedCardIds: string[];
  discardedCardIds: string[];
  customCards: ValueCard[];
  piles: Pile[];
  topPileIds: string[];
}

export interface CatalogValue {
  id: string;
  label: string;
  tag?: string;
}

export interface ValuesCatalog {
  values: CatalogValue[];
}

export function createInitialSessionState(): SessionState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    selectedCardIds: [],
    discardedCardIds: [],
    customCards: [],
    piles: [],
    topPileIds: [],
  };
}
