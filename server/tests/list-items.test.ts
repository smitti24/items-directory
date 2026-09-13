import { describe, expect, it } from "vitest"
import type { CatalogItem, SearchQuery } from "@items-directory/shared"
import { listItems, listItemsFrom } from "../src/services/items.service"
import type { ListResult } from "../src/services/items.service"

const fixtureItems: CatalogItem[] = [
  {
    id: "itm_a",
    name: "Ham and Cheese Toastie",
    description: "Toasted sandwich",
    category: "Restaurant Meals",
    merchant: "Cafe Roux",
    basePrice: 69,
    popularity: 64,
    tags: ["ham", "toastie"]
  },
  {
    id: "itm_b",
    name: "Champagne Brut",
    description: "Sparkling wine",
    category: "Liquor",
    merchant: "Nicolas",
    basePrice: 459,
    popularity: 55,
    tags: ["champagne", "sparkling"]
  },
  {
    id: "itm_c",
    name: "Extra Virgin Olive Oil",
    description: "Cold-pressed oil",
    category: "Groceries",
    merchant: "Food Lover's Market",
    basePrice: 89.99,
    popularity: 70,
    tags: ["oil", "olive", "pantry"]
  },
  {
    id: "itm_d",
    name: "London Dry Gin",
    description: "Juniper gin",
    category: "Liquor",
    merchant: "Liquor City",
    basePrice: 289,
    popularity: 74,
    tags: ["gin", "spirits"]
  },
  {
    id: "itm_e",
    name: "Basmati Rice",
    description: "Long-grain rice",
    category: "Groceries",
    merchant: "Checkers",
    basePrice: 54.99,
    popularity: 68,
    tags: ["rice", "grains"]
  },
  {
    id: "itm_f",
    name: "Liquorice Allsorts",
    description: "Layered sweets",
    category: "Groceries",
    merchant: "Sweet Shop",
    basePrice: 29.99,
    popularity: 41,
    tags: ["sweets", "candy"]
  }
]

function query(overrides: Partial<SearchQuery> = {}): SearchQuery {
  return {
    q: undefined,
    category: undefined,
    sort: "popularity",
    order: "desc",
    page: 1,
    pageSize: 6,
    ...overrides
  }
}

function namesOf(items: CatalogItem[], searchQuery: SearchQuery): string[] {
  return listItemsFrom(items, searchQuery).items.map((item: CatalogItem): string => item.name)
}

describe("listItems", () => {
  it("matches word prefixes and not substrings", () => {
    expect(namesOf(fixtureItems, query({ q: "ham" }))).toEqual(["Ham and Cheese Toastie"])
    expect(namesOf(fixtureItems, query({ q: "gin" }))).toEqual(["London Dry Gin"])
    expect(namesOf(fixtureItems, query({ q: "rice" }))).toEqual(["Basmati Rice"])
  })

  it("requires every token to match", () => {
    expect(namesOf(fixtureItems, query({ q: "ham cheese" }))).toEqual(["Ham and Cheese Toastie"])
    expect(namesOf(fixtureItems, query({ q: "ham gin" }))).toEqual([])
  })

  it("sorts on catalog price", () => {
    const names: string[] = namesOf(fixtureItems, query({ sort: "price", order: "asc" }))
    expect(names[0]).toBe("Liquorice Allsorts")
    expect(names[names.length - 1]).toBe("Champagne Brut")
  })

  it("paginates after search and sort", () => {
    const result: ListResult = listItemsFrom(fixtureItems, query({ sort: "name", order: "asc", page: 2, pageSize: 2 }))
    expect(result.total).toBe(6)
    expect(result.totalPages).toBe(3)
    expect(result.items).toHaveLength(2)
    expect(result.items[0]?.name).toBe("Extra Virgin Olive Oil")
  })

  it("finds the same product from several merchants in the catalog", () => {
    const pizzas: CatalogItem[] = listItems(query({ q: "margherita", pageSize: 48 })).items
    const merchants: string[] = pizzas.map((item: CatalogItem): string => item.merchant)

    expect(merchants).toEqual(["Napoli Kitchen", "Doppio Zero", "Col'Cacchio"])
  })

  it("filters by category and still requires search tokens to match", () => {
    expect(namesOf(fixtureItems, query({ category: "Liquor" }))).toEqual([
      "London Dry Gin",
      "Champagne Brut"
    ])
    expect(namesOf(fixtureItems, query({ q: "rice", category: "Groceries" }))).toEqual([
      "Basmati Rice"
    ])
    expect(namesOf(fixtureItems, query({ q: "ham", category: "Liquor" }))).toEqual([])
  })
})
