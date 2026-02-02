"use client";

import { useCallback, useEffect, useState } from "react";
import type { SessionState } from "@/lib/types";
import { createInitialSessionState } from "@/lib/types";
import {
  loadState,
  saveState,
  resetState as storageResetState,
} from "@/lib/storage";

export function useSessionState() {
  const [state, setState] = useState<SessionState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded ?? createInitialSessionState());
    setHydrated(true);
  }, []);

  const updateState = useCallback((updater: (prev: SessionState) => SessionState) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const resetState = useCallback(() => {
    const initial = storageResetState();
    setState(initial);
    return initial;
  }, []);

  const replaceState = useCallback((newState: SessionState) => {
    saveState(newState);
    setState(newState);
  }, []);

  return { state, hydrated, updateState, resetState, replaceState };
}
