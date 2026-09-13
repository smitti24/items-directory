import { DEFAULT_ORDER, DEFAULT_PAGE, DEFAULT_SORT } from "@items-directory/shared"

export type CatalogQuery = {
  q: string
  category: string
  sort: string
  order: string
  page: number
}

export function catalogHref(query: CatalogQuery): string {
  const params: URLSearchParams = new URLSearchParams()

  if (query.q !== "") {
    params.set("q", query.q)
  }

  if (query.category !== "") {
    params.set("category", query.category)
  }

  if (query.sort !== DEFAULT_SORT) {
    params.set("sort", query.sort)
  }

  if (query.order !== DEFAULT_ORDER) {
    params.set("order", query.order)
  }

  if (query.page !== DEFAULT_PAGE) {
    params.set("page", String(query.page))
  }

  const search: string = params.toString()
  return search === "" ? "/" : `/?${search}`
}
