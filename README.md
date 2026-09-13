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
```

## Scripts

| Command | Purpose |
|---|---|
| `pnpm typecheck` | Type-check every workspace package |
| `pnpm test` | Run tests once packages define them |
| `pnpm dev` | Run the API and client together |
| `pnpm build` | Build every package that defines a build script |
| `pnpm start` | Run production builds of the API and client |

`dev` and `start` become meaningful once the server and client packages implement
those scripts.

## Workspace

One pnpm workspace, three packages:

| Package | Role |
|---|---|
| `shared/` | Zod schemas and inferred types. TypeScript source only — no build step |
| `server/` | Express API |
| `client/` | SvelteKit UI |

## Current state

The workspace is scaffolded and the shared Zod contract lives in `shared/src`.
The catalog, search API, and SvelteKit client land in later phases. Example API
requests will be added here when the search route exists.

See `SOLUTION.md` for the design and the trade-offs behind it.
