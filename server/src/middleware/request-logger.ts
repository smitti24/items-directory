import type { NextFunction, Request, Response } from "express"

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startedAt: number = Date.now()

  res.on("finish", (): void => {
    const tookMs: number = Date.now() - startedAt
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${tookMs}ms`)
  })

  next()
}
