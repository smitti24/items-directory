import tailwindcss from "@tailwindcss/vite"
import adapter from "@sveltejs/adapter-node"
import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        runes: ({ filename }: { filename: string }): boolean | undefined => {
          return filename.split(/[/\\]/).includes("node_modules") ? undefined : true
        }
      },
      adapter: adapter()
    })
  ],
  server: {
    port: 5173,
    strictPort: true
  }
})
