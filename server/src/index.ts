import { createApp } from "./app"

const DEFAULT_PORT: number = 3000
const port: number = Number(process.env.PORT ?? DEFAULT_PORT)
const app = createApp()

app.listen(port, (): void => {
  console.log(`API listening on http://localhost:${port}`)
})
