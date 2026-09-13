import { CATEGORIES, catalogItemSchema } from "@items-directory/shared"
import type { CatalogItem } from "@items-directory/shared"
import catalogJson from "./catalog.json" with { type: "json" }

const EXPECTED_PER_CATEGORY: number = 8
const EXPECTED_ITEM_COUNT: number = CATEGORIES.length * EXPECTED_PER_CATEGORY

const catalogSchema = catalogItemSchema.array().length(EXPECTED_ITEM_COUNT)

function assertUniqueIds(items: CatalogItem[]): void {
  const ids: string[] = items.map((item: CatalogItem): string => item.id)
  const uniqueIds: Set<string> = new Set(ids)

  if (uniqueIds.size !== ids.length) {
    throw new Error("Catalog contains duplicate Item ids")
  }
}

function assertCategoryCounts(items: CatalogItem[]): void {
  for (const category of CATEGORIES) {
    const count: number = items.filter(
      (item: CatalogItem): boolean => item.category === category
    ).length

    if (count !== EXPECTED_PER_CATEGORY) {
      throw new Error(
        `Category ${category} has ${count} Items, expected ${EXPECTED_PER_CATEGORY}`
      )
    }
  }
}

export function loadCatalog(): CatalogItem[] {
  const items: CatalogItem[] = catalogSchema.parse(catalogJson)
  assertUniqueIds(items)
  assertCategoryCounts(items)
  return items
}

export const catalog: CatalogItem[] = loadCatalog()
