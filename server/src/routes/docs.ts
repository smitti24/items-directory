import { Router } from "express"
import * as swaggerUi from "swagger-ui-express"
import { buildOpenApiDocument } from "../openapi/document"

export const docsRouter: Router = Router()
docsRouter.use(swaggerUi.serve)
docsRouter.get(
  "/",
  swaggerUi.setup(buildOpenApiDocument(), {
    customSiteTitle: "Items Directory API"
  })
)
