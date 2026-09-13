import cors from "cors"
import express from "express"
import type { Express, NextFunction, Request, Response } from "express"
import { AppError } from "./errors/app-error"
import { errorHandler } from "./middleware/error-handler"
import { requestLogger } from "./middleware/request-logger"
import { categoriesRouter } from "./routes/categories"
import { healthRouter } from "./routes/health"
import { itemsRouter } from "./routes/items"

const DEFAULT_CORS_ORIGIN: string = "http://localhost:5173"

export function createApp(): Express {
  const app: Express = express()
  const corsOrigin: string = process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN

  app.use(cors({ origin: corsOrigin }))
  app.use(express.json())
  app.use(requestLogger)

  app.use("/api/health", healthRouter)
  app.use("/api/categories", categoriesRouter)
  app.use("/api/items", itemsRouter)

  app.use((req: Request, _res: Response, next: NextFunction): void => {
    next(new AppError("NOT_FOUND", `Route not found: ${req.method} ${req.path}`, 404))
  })

  app.use(errorHandler)

  return app
}
