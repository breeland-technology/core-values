"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";

interface AddCustomValueProps {
  onAdd: (label: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function AddCustomValue({ onAdd, onClose, isOpen }: AddCustomValueProps) {
  const [label, setLabel] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = label.trim();
      if (trimmed) {
        onAdd(trimmed);
        setLabel("");
        onClose();
      }
    },
    [label, onAdd, onClose]
  );

  const handleClose = useCallback(() => {
    setLabel("");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-custom-value-title"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-stone-800">
        <h2 id="add-custom-value-title" className="mb-4 text-lg font-medium">
          Add your own value
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="custom-value-label" className="sr-only">
            Value label
          </label>
          <input
            id="custom-value-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Curiosity"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 placeholder:text-stone-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!label.trim()}>
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
