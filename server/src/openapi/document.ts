import { z } from "zod"
import {
  DEFAULT_ORDER,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_SORT,
  categoriesResponseSchema,
  categorySchema,
  errorResponseSchema,
  healthResponseSchema,
  listResponseSchema,
  sortFieldSchema,
  sortOrderSchema
} from "@items-directory/shared"

export type OpenApiSchema = Record<string, unknown>

export type OpenApiQueryParameter = {
  name: string
  in: "query"
  required: false
  description: string
  schema: OpenApiSchema
}

export type OpenApiDocument = {
  openapi: string
  info: {
    title: string
    version: string
    description: string
  }
  paths: Record<string, unknown>
}

function toOpenApiSchema(schema: z.ZodType): OpenApiSchema {
  const jsonSchema: OpenApiSchema = z.toJSONSchema(schema, {
    target: "openapi-3.0"
  }) as OpenApiSchema

  delete jsonSchema.$schema
  return jsonSchema
}

function queryParameters(): OpenApiQueryParameter[] {
  return [
    {
      name: "q",
      in: "query",
      required: false,
      description: "Word-prefix search over name, merchant, and tags. Tokens are ANDed.",
      schema: { type: "string" }
    },
    {
      name: "category",
      in: "query",
      required: false,
      description: "Filter by Category. Not a search field.",
      schema: toOpenApiSchema(categorySchema)
    },
    {
      name: "sort",
      in: "query",
      required: false,
      description: "Sort field. Price sorts on catalog Base Price.",
      schema: { ...toOpenApiSchema(sortFieldSchema), default: DEFAULT_SORT }
    },
    {
      name: "order",
      in: "query",
      required: false,
      description: "Sort direction.",
      schema: { ...toOpenApiSchema(sortOrderSchema), default: DEFAULT_ORDER }
    },
    {
      name: "page",
      in: "query",
      required: false,
      description: "1-based page index.",
      schema: { type: "integer", minimum: 1, default: DEFAULT_PAGE }
    },
    {
      name: "pageSize",
      in: "query",
      required: false,
      description: `Items per page (1–${String(MAX_PAGE_SIZE)}).`,
      schema: {
        type: "integer",
        minimum: 1,
        maximum: MAX_PAGE_SIZE,
        default: DEFAULT_PAGE_SIZE
      }
    }
  ]
}

function jsonResponse(schema: z.ZodType, description: string): Record<string, unknown> {
  return {
    description,
    content: {
      "application/json": {
        schema: toOpenApiSchema(schema)
      }
    }
  }
}

export function buildOpenApiDocument(): OpenApiDocument {
  const errorResponse: Record<string, unknown> = jsonResponse(
    errorResponseSchema,
    "Shared error shape"
  )

  return {
    openapi: "3.0.3",
    info: {
      title: "Items Directory API",
      version: "1.0.0",
      description:
        "Search a local catalog of Items. Each Item may include a Quote with availability, price, and delivery estimate."
    },
    paths: {
      "/api/health": {
        get: {
          summary: "Liveness",
          responses: {
            "200": jsonResponse(healthResponseSchema, "API is up")
          }
        }
      },
      "/api/categories": {
        get: {
          summary: "List Categories",
          responses: {
            "200": jsonResponse(categoriesResponseSchema, "Fixed Category list")
          }
        }
      },
      "/api/items": {
        get: {
          summary: "Search catalog Items",
          parameters: queryParameters(),
          responses: {
            "200": jsonResponse(listResponseSchema, "One catalog page, with Quotes when available"),
            "400": errorResponse
          }
        }
      }
    }
  }
}
