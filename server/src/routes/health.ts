import { Router } from "express"
import { get } from "../controllers/health.controller"

export const healthRouter: Router = Router()

healthRouter.get("/", get)
