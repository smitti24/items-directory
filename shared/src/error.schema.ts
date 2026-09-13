import { z } from "zod"

export const ERROR_CODES = [
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "INTERNAL_ERROR"
] as const

export const errorCodeSchema = z.enum(ERROR_CODES)

export const errorDetailSchema = z.object({
  path: z.string(),
  message: z.string().min(1)
})

export const errorResponseSchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message: z.string().min(1),
    details: z.array(errorDetailSchema).default([])
  })
})

export type ErrorCode = z.infer<typeof errorCodeSchema>
export type ErrorDetail = z.infer<typeof errorDetailSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
