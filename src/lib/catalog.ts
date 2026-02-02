import type { ValueCard, ValuesCatalog } from "./types";
import catalogData from "@/data/values-catalog.json";

const catalog = catalogData as ValuesCatalog;

export function getCatalogValues(): ValueCard[] {
  return catalog.values.map((v) => ({
    id: v.id,
    label: v.label,
    source: "catalog" as const,
    tag: v.tag,
  }));
}

export function getCatalogValueById(id: string): ValueCard | undefined {
  const entry = catalog.values.find((v) => v.id === id);
  if (!entry) return undefined;
  return {
    id: entry.id,
    label: entry.label,
    source: "catalog",
    tag: entry.tag,
  };
}
