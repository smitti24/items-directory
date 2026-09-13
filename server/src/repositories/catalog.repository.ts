import type { CatalogItem } from "@items-directory/shared"
import { catalog } from "../data/load-catalog"

export function findAllItems(): CatalogItem[] {
  return [...catalog]
}
