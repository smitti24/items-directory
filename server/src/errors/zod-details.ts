import type { ZodError } from "zod"
import type { ErrorDetail } from "@items-directory/shared"

export function detailsFromZodError(error: ZodError): ErrorDetail[] {
  return error.issues.map((issue): ErrorDetail => {
    const path: string = issue.path.join(".")
    const message: string = issue.message
    return { path, message }
  })
}
