import type { Request, Response } from "express"
import { searchQuerySchema } from "@items-directory/shared"
import type { ListResponse } from "@items-directory/shared"
import { AppError } from "../errors/app-error"
import { detailsFromZodError } from "../errors/zod-details"
import { listItems } from "../services/items.service"
import type { ListResult } from "../services/items.service"

export function list(req: Request, res: Response): void {
  const parsed: ReturnType<typeof searchQuerySchema.safeParse> = searchQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Request validation failed",
      400,
      detailsFromZodError(parsed.error)
    )
  }

  const startedAt: number = Date.now()
  const catalogPage: ListResult = listItems(parsed.data)
  const body: ListResponse = {
    data: {
      items: catalogPage.items,
      page: catalogPage.page,
      pageSize: catalogPage.pageSize,
      total: catalogPage.total,
      totalPages: catalogPage.totalPages
    },
    meta: {
      tookMs: Date.now() - startedAt
    }
  }

  res.status(200).json(body)
}
