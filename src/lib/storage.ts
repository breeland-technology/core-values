import type { SessionState } from "./types";
import { createInitialSessionState } from "./types";
import { STORAGE_KEY, SCHEMA_VERSION } from "./constants";

function isClient(): boolean {
  return typeof window !== "undefined";
}

function normalizeState(parsed: Record<string, unknown>): SessionState {
  const groups = Array.isArray(parsed.groups)
    ? parsed.groups
    : Array.isArray(parsed.piles)
      ? parsed.piles
      : [];
  const topGroupIds = Array.isArray(parsed.topGroupIds)
    ? parsed.topGroupIds
    : Array.isArray(parsed.topPileIds)
      ? parsed.topPileIds
      : [];
  return {
    ...parsed,
    groups,
    topGroupIds,
  } as SessionState;
}

export function loadState(): SessionState | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (
      typeof parsed?.schemaVersion !== "number" ||
      parsed.schemaVersion !== SCHEMA_VERSION
    ) {
      return null;
    }
    if (!Array.isArray(parsed.discardedCardIds)) {
      parsed.discardedCardIds = [];
    }
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

export function saveState(state: SessionState): void {
  if (!isClient()) return;
  const toSave: SessionState = {
    ...state,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore quota or other errors
  }
}

export function exportStateJSON(state: SessionState): string {
  return JSON.stringify(state, null, 2);
}

export function importStateJSON(json: string): SessionState | null {
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    if (
      typeof parsed?.schemaVersion !== "number" ||
      parsed.schemaVersion !== SCHEMA_VERSION
    ) {
      return null;
    }
    return normalizeState({
      ...parsed,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return null;
  }
}

export function clearState(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function resetState(): SessionState {
  const initial = createInitialSessionState();
  saveState(initial);
  return initial;
}
