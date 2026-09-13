import { Router } from "express"
import { list } from "../controllers/items.controller"

export const itemsRouter: Router = Router()

itemsRouter.get("/", list)
