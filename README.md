# Items Directory

A local search and discovery slice for the Mr D Senior Front End take-home.
An Express API searches a hand-authored catalog and enriches the current page
with live pricing. A SvelteKit client renders the search experience.

## Requirements

- Node.js 22 or newer (24 Active LTS preferred — see `.nvmrc`)
- [pnpm](https://pnpm.io) 11.20

## Setup

```bash
pnpm install
cp client/.env.example client/.env
```

## Scripts

| Command | Purpose |
|---|---|
| `pnpm typecheck` | Type-check every workspace package |
| `pnpm test` | Run tests once packages define them |
| `pnpm dev` | Run the API and client together |
| `pnpm build` | Build every package that defines a build script |
| `pnpm start` | Run production builds of the API and client |

The API listens on `http://localhost:3000`. The client listens on
`http://localhost:5173`. The client reads `PUBLIC_API_BASE_URL` from `client/.env`.

## Workspace

One pnpm workspace, three packages:

| Package | Role |
|---|---|
| `shared/` | Zod schemas and inferred types. TypeScript source only — no build step |
| `server/` | Express API |
| `client/` | SvelteKit UI |

## Current state

The catalog API and a SvelteKit page are in place. Search lives in the URL.
Category, sort, pagination and live Quotes land in later phases.

## Example requests

```bash
curl "http://localhost:3000/api/health"
curl "http://localhost:3000/api/categories"
curl "http://localhost:3000/api/items"
curl "http://localhost:3000/api/items?q=ham"
curl "http://localhost:3000/api/items?q=margherita&sort=price&order=asc"
curl "http://localhost:3000/api/items?category=Liquor"
curl "http://localhost:3000/api/items?q=gin&category=Liquor"
curl "http://localhost:3000/api/items?page=2&pageSize=6"
```

`GET /api/items` accepts `q`, `category`, `sort` (`price` | `popularity` | `name`),
`order` (`asc` | `desc`), `page`, and `pageSize` (1–48, default 6). Category is a
filter, not a search field.

See `SOLUTION.md` for the design and the trade-offs behind it.
