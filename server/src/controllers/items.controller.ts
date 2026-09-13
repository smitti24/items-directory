import type { Request, Response } from "express"
import { listQuerySchema } from "@items-directory/shared"
import type { ListResponse } from "@items-directory/shared"
import { AppError } from "../errors/app-error"
import { detailsFromZodError } from "../errors/zod-details"
import { listItems } from "../services/items.service"
import type { ListResult } from "../services/items.service"

export function list(req: Request, res: Response): void {
  const parsed: ReturnType<typeof listQuerySchema.safeParse> = listQuerySchema.safeParse(req.query)

  if (!parsed.success) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Request validation failed",
      400,
      detailsFromZodError(parsed.error)
    )
  }

  const startedAt: number = Date.now()
  const result: ListResult = listItems(parsed.data)
  const body: ListResponse = {
    data: result,
    meta: { tookMs: Date.now() - startedAt }
  }

  res.status(200).json(body)
}
