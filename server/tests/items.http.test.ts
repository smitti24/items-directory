import { describe, expect, it } from "vitest"
import type { Express } from "express"
import request from "supertest"
import type { Response as SuperTestResponse } from "supertest"
import { errorResponseSchema, listResponseSchema } from "@items-directory/shared"
import type { ErrorResponse, Item, ListResponse } from "@items-directory/shared"
import { createApp } from "../src/app"

const app: Express = createApp()

describe("GET /api/items", () => {
  it("returns a paginated catalog page with Quotes", async () => {
    const response: SuperTestResponse = await request(app).get("/api/items")

    expect(response.status).toBe(200)
    const body: ListResponse = listResponseSchema.parse(response.body)
    expect(body.data.page).toBe(1)
    expect(body.data.pageSize).toBe(6)
    expect(body.data.items).toHaveLength(6)
    expect(body.data.total).toBe(48)
    expect(body.data.totalPages).toBe(8)
  })

  it("rejects an invalid pageSize", async () => {
    const response: SuperTestResponse = await request(app).get("/api/items").query({ pageSize: 99 })

    expect(response.status).toBe(400)
    const body: ErrorResponse = errorResponseSchema.parse(response.body)
    expect(body.error.code).toBe("VALIDATION_ERROR")
  })

  it("filters the catalog by category", async () => {
    const response: SuperTestResponse = await request(app)
      .get("/api/items")
      .query({ category: "Liquor", pageSize: 48 })

    expect(response.status).toBe(200)
    const body: ListResponse = listResponseSchema.parse(response.body)
    expect(body.data.total).toBe(8)
    expect(body.data.items).toHaveLength(8)
    expect(body.data.items.every((item: Item): boolean => item.category === "Liquor")).toBe(true)
  })

  it("rejects an unknown category", async () => {
    const response: SuperTestResponse = await request(app).get("/api/items").query({ category: "Baby" })

    expect(response.status).toBe(400)
    const body: ErrorResponse = errorResponseSchema.parse(response.body)
    expect(body.error.code).toBe("VALIDATION_ERROR")
  })
})

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const response: SuperTestResponse = await request(app).get("/api/health")
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: "ok" })
  })
})

describe("unknown routes", () => {
  it("return the shared error shape", async () => {
    const response: SuperTestResponse = await request(app).get("/api/missing")

    expect(response.status).toBe(404)
    const body: ErrorResponse = errorResponseSchema.parse(response.body)
    expect(body.error.code).toBe("NOT_FOUND")
  })
})
