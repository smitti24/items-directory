import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import type { ErrorResponse } from "@items-directory/shared"
import { AppError } from "../errors/app-error"
import { detailsFromZodError } from "../errors/zod-details"

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    const body: ErrorResponse = {
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    }
    res.status(error.statusCode).json(body)
    return
  }

  if (error instanceof ZodError) {
    const body: ErrorResponse = {
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: detailsFromZodError(error)
      }
    }
    res.status(400).json(body)
    return
  }

  console.error(error)

  const body: ErrorResponse = {
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
      details: []
    }
  }
  res.status(500).json(body)
}
