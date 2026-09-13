import type { Request, Response } from "express"
import type { HealthResponse } from "@items-directory/shared"

export function get(_req: Request, res: Response): void {
  const body: HealthResponse = { status: "ok" }
  res.status(200).json(body)
}
