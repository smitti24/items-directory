import type { CatalogItem, ListQuery, ListResponse, SortField, SortOrder } from "@items-directory/shared"
import { findAllItems } from "../repositories/catalog.repository"

export type ListResult = ListResponse["data"]

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token: string): boolean => token.length > 0)
}

function searchableWords(item: CatalogItem): string[] {
  const tagWords: string[] = item.tags.flatMap((tag: string): string[] => tokenize(tag))
  return [...tokenize(item.name), ...tokenize(item.merchant), ...tagWords]
}

function itemMatchesQuery(item: CatalogItem, query: string): boolean {
  const tokens: string[] = tokenize(query)
  const words: string[] = searchableWords(item)

  return tokens.every((token: string): boolean => {
    return words.some((word: string): boolean => word.startsWith(token))
  })
}

function compareItems(left: CatalogItem, right: CatalogItem, sort: SortField): number {
  if (sort === "price") {
    return left.basePrice - right.basePrice
  }

  if (sort === "popularity") {
    return left.popularity - right.popularity
  }

  return left.name.localeCompare(right.name, "en", { sensitivity: "base" })
}

function sortItems(items: CatalogItem[], sort: SortField, order: SortOrder): CatalogItem[] {
  const direction: number = order === "asc" ? 1 : -1

  return [...items].sort((left: CatalogItem, right: CatalogItem): number => {
    return compareItems(left, right, sort) * direction
  })
}

export function listItemsFrom(items: CatalogItem[], query: ListQuery): ListResult {
  const searchText: string | undefined = query.q
  const matched: CatalogItem[] =
    searchText === undefined
      ? items
      : items.filter((item: CatalogItem): boolean => itemMatchesQuery(item, searchText))

  const sorted: CatalogItem[] = sortItems(matched, query.sort, query.order)
  const total: number = sorted.length
  const totalPages: number = total === 0 ? 0 : Math.ceil(total / query.pageSize)
  const start: number = (query.page - 1) * query.pageSize
  const pageItems: CatalogItem[] = sorted.slice(start, start + query.pageSize)

  return {
    items: pageItems,
    page: query.page,
    pageSize: query.pageSize,
    total,
    totalPages
  }
}

export function listItems(query: ListQuery): ListResult {
  return listItemsFrom(findAllItems(), query)
}
