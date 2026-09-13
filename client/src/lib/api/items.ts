import { env } from "$env/dynamic/public"
import { errorResponseSchema, listResponseSchema } from "@items-directory/shared"
import type { CatalogItem, ListResponse } from "@items-directory/shared"

export type ItemsPage = {
  ok: true
  items: CatalogItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ItemsPageError = {
  ok: false
  message: string
}

export type ItemsLoadResult = ItemsPage | ItemsPageError

const DEFAULT_API_BASE_URL: string = "http://localhost:3000"

function apiBaseUrl(): string {
  return env.PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
}

export async function fetchItemPage(fetchFn: typeof fetch): Promise<ItemsLoadResult> {
  const url: string = `${apiBaseUrl()}/api/items`

  try {
    const response: Response = await fetchFn(url)
    const json: unknown = await response.json()

    if (!response.ok) {
      const parsed: ReturnType<typeof errorResponseSchema.safeParse> =
        errorResponseSchema.safeParse(json)
      const message: string = parsed.success
        ? parsed.data.error.message
        : "The catalog request failed"

      return { ok: false, message }
    }

    const parsedBody: ReturnType<typeof listResponseSchema.safeParse> =
      listResponseSchema.safeParse(json)

    if (!parsedBody.success) {
      return { ok: false, message: "The catalog response did not match the expected shape" }
    }

    const body: ListResponse = parsedBody.data

    return {
      ok: true,
      items: body.data.items,
      page: body.data.page,
      pageSize: body.data.pageSize,
      total: body.data.total,
      totalPages: body.data.totalPages
    }
  } catch {
    return {
      ok: false,
      message: "Could not reach the catalog API. Is it running on port 3000?"
    }
  }
}
