import { z } from "zod"
import { categorySchema, itemSchema } from "./item.schema"

export const SORT_FIELDS = ["price", "popularity", "name"] as const
export const SORT_ORDERS = ["asc", "desc"] as const

export const DEFAULT_PAGE: number = 1
export const DEFAULT_PAGE_SIZE: number = 6
export const MAX_PAGE_SIZE: number = 48
export const DEFAULT_SORT: (typeof SORT_FIELDS)[number] = "popularity"
export const DEFAULT_ORDER: (typeof SORT_ORDERS)[number] = "desc"

export const sortFieldSchema = z.enum(SORT_FIELDS)
export const sortOrderSchema = z.enum(SORT_ORDERS)

function emptyToUndefined(value: string | undefined): string | undefined {
  if (value === undefined || value === "") {
    return undefined
  }

  return value
}

export const searchQuerySchema = z.object({
  q: z.string().trim().optional().transform(emptyToUndefined),
  category: categorySchema.optional(),
  sort: sortFieldSchema.default(DEFAULT_SORT),
  order: sortOrderSchema.default(DEFAULT_ORDER),
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE)
})

export const enrichmentMetaSchema = z.object({
  requested: z.number().int().nonnegative(),
  quoted: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative()
})

export const searchResponseSchema = z.object({
  data: z.object({
    items: z.array(itemSchema),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(MAX_PAGE_SIZE),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative()
  }),
  meta: z.object({
    tookMs: z.number().nonnegative(),
    enrichment: enrichmentMetaSchema
  })
})

export const categoriesResponseSchema = z.object({
  data: z.object({
    categories: z.array(categorySchema)
  })
})

export const healthResponseSchema = z.object({
  status: z.literal("ok")
})

export type SortField = z.infer<typeof sortFieldSchema>
export type SortOrder = z.infer<typeof sortOrderSchema>
export type SearchQuery = z.output<typeof searchQuerySchema>
export type SearchQueryInput = z.input<typeof searchQuerySchema>
export type EnrichmentMeta = z.infer<typeof enrichmentMetaSchema>
export type SearchResponse = z.infer<typeof searchResponseSchema>
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>
export type HealthResponse = z.infer<typeof healthResponseSchema>
