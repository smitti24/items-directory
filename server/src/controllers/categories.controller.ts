import type { Request, Response } from "express"
import { CATEGORIES } from "@items-directory/shared"
import type { CategoriesResponse } from "@items-directory/shared"

export function list(_req: Request, res: Response): void {
  const body: CategoriesResponse = {
    data: {
      categories: [...CATEGORIES]
    }
  }

  res.status(200).json(body)
}
