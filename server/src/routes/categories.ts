import { Router } from "express"
import { list } from "../controllers/categories.controller"

export const categoriesRouter: Router = Router()

categoriesRouter.get("/", list)
