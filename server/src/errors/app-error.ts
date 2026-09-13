import type { ErrorCode, ErrorDetail } from "@items-directory/shared"

export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly details: ErrorDetail[]

  public constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details: ErrorDetail[] = []
  ) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
