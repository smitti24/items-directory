# Solution

## Initial prompt given to Claude Code

> Please go over this spec, I have never used SvelteKit before, however I am quite
> proficient in Javascript and understand how data flows. I have also quickly gone
> over the SvelteKit documentation here: https://svelte.dev/docs to get the basics.
> I see that it uses the fetch api, but also makes mention of a load function. On
> the docs, they also specify a recommended folder structure. I would like us to
> stick with that same structure as far as possible.
>
> For our UI we will be using Tailwind, I noted that SvelteKit supports Tailwind.
> Please recommend a library like Material UI or shadcn that we could use to make
> our component and page elements easier to build.
>
> We will go at this piece by piece, and compare each paradigm to either Angular or
> React to help me gain confidence and understanding of the language. Try Angular
> where possible because I'm very fluent with Angular.
>
> The back end will be written in Node, Express, TypeScript, this I am much more
> familiar with. So for the backend, I would like us to use the repository pattern,
> Controllers, Services and Routes. We also need to ensure we have middleware
> implemented, especially for global error handling. Since this is a local app, we
> can skip authentication. We are also going to be using Zod for our schema
> validation both on client side and server side.
>
> Please gather all the information you need, the next part is where I will add the
> necessary skills and agents for us to use. Then I will invoke the next skills we
> need which will probably be the planning skill, so you and I can gain a mutual
> understanding of exactly what needs to be done, and what I would like us to do.

## AI assistance

This project was built with Claude Code. Rather than working from the model's
defaults, I configured the session with a specific set of agents and skills so
that the architecture, review standards, and framework guidance were explicit
and consistent. The selection below is deliberate, and the exclusions were too:
no test-first workflow skills, and no React-specific frontend skills that would
have conflicted with Svelte.

### Agents

| Agent                 | Used for                                                              |
| --------------------- | --------------------------------------------------------------------- |
| `grill-me-with-docs`  | Stress-testing the plan and pinning the design decisions before code  |
| `planner`             | Breaking the assignment into ordered, reviewable implementation steps |
| `architect`           | System design and technical trade-off decisions                       |
| `code-reviewer`       | General quality, security, and maintainability review                 |
| `typescript-reviewer` | Type safety, async correctness, and idiomatic TypeScript              |

### Server-side skills

- `backend-patterns` — Node.js and Express architecture and data access
- `api-design` — REST resource naming, status codes, pagination, filtering, and error responses
- `error-handling` — typed errors, retries, and user-facing failure messages
- `contract-first` — keeping the client and server agreed on one schema
- `coding-standards` — baseline naming, readability, and immutability conventions

### Client-side skills

Svelte and SvelteKit guidance came from the `svelte-skills` package, a
community-maintained collection derived from the official Svelte 5 and
SvelteKit 2 documentation published at
[svelte.dev](https://svelte.dev/docs). Nine of its sixteen skills were
installed:

- `sveltekit-overview` — project structure, routing, and rendering modes
- `sveltekit-data` — `load` functions, form actions, and page options
- `sveltekit-advanced` — state management, hooks, environment variables, and error handling
- `sveltekit-config` — build configuration, adapters, and performance
- `svelte-runes` — the Svelte 5 reactivity system
- `svelte-template-syntax` — template blocks, bindings, and directives
- `svelte-styling` — scoped styles and Tailwind integration
- `svelte-lifecycle` — lifecycle hooks, stores, context, and testing
- `svelte-cli` — the `sv` CLI for scaffolding and integrations

Alongside those:

- `vite-patterns` — Vite configuration, dev proxy setup, and build optimisation
- `design-system` — visual consistency and styling review
- `frontend-a11y` — semantic HTML, keyboard navigation, and screen reader support

### Skills invocation order

1. `plan` — requirements, risks, and the phased implementation plan
2. `vault-grill` — stress-testing that plan and recording the decisions
3. Implementation, phase by phase, with `code-reviewer` and `typescript-reviewer` after each

Runes - syntax marked with $
$state
$effect
$props

Svelte 5 runes are the closest thing I have found to Angular signals. The `$`
is just how Svelte marks them.

- `$state` is like `signal()` — writable state the component owns
- `$derived` is like `computed()` — a value that updates when its inputs change
- `$effect` is like `effect()` — runs when the values it reads change
- `$props()` is how a component receives inputs, similar to `@Input()`

On this page I used `$state` for the draft search text and the busy flag,
`$derived` for anything that comes off the URL, and `$effect` to keep the
search box in sync when you hit back.

## How the app is structured

One pnpm workspace, three packages:

- `shared/` — Zod schemas and the types inferred from them. No build step.
  Both sides import the TypeScript source directly.
- `server/` — Express 5. Repository, service, controller, route, plus a
  global error handler.
- `client/` — SvelteKit 2 + Svelte 5. I stuck to their recommended folder
  structure.

Clone, `pnpm install`, `pnpm dev`. API on 3000, UI on 5173.

I kept TypeScript on 6.0.3, not 7, because `svelte-check` does not support 7
yet. Node 24 is Active LTS, which covers the brief's "LTS 18+".

## Shared schemas

The Zod schemas in `shared/` are the contract. The server validates requests
with them, the client parses responses with them, and Swagger is generated
from them. If the shape changes, it changes in one place.

I did not want to write types by hand on both sides and hope they stay in
sync.

## Domain

An Item is one merchant's offer, not a product. "Margherita Pizza from Napoli
Kitchen" is one Item. The same pizza from another restaurant is a different
Item, with its own price and its own availability. That is how a marketplace
actually works, so the catalog has the same product from more than one
merchant on purpose.

A Quote is the live answer for that Item right now:

- **Available** — we have a price and an ETA
- **Sold out** — the merchant answered and cannot fulfil it (`itm_004`)
- **No Quote** — we do not have a live answer (`itm_011`). The card falls
  back to the catalog price and says the price is unavailable

I did not want a missing Quote to look like sold out. Those are two different
things. If we do not know, we should say we do not know, not invent a lost
sale.

Quotes are attached in the items service after search, filter, sort and
pagination have already run. Search always works off the catalog, never off
a live Quote.

The catalog itself is 48 hand-authored Items, six categories, eight each,
priced in rand. I wrote it by hand. Generated names would have made search
look broken, and real Mr D catalogue data is not ours to copy.

## Search, filter, sort, page

Search is case-insensitive word-prefix matching over name, merchant and tags.
Tokens are ANDed. Type `ham` and you get ham, not Champagne. Substring
matching would have been easier, and quietly terrible.

Category is a filter, not a search field. If it was both, you could type
"Liquor" with Groceries selected and get an empty page for no reason you can
see.

Sort is popularity, name, or catalog price. The control says catalog price
because that is the number we always have. Live prices on the card may
differ, which is why there is a note under the results when you sort by
price.

Page size is 6. That keeps pagination visible even after you filter.

## The URL is the state

Search, category, sort and page all live in the address bar. Change a
control, we navigate, and `load` runs again. Copy the URL into a new tab and
you get the same view.

In Angular this is `Router.navigate` with `queryParams`, plus a subscription
to `ActivatedRoute.queryParams`. The SvelteKit `load` function is the closest
thing to a route resolver.

Typing is debounced by 300ms. While you type we replace the history entry, so
the back button does not walk through every keystroke.

## Loading and errors

When a request is in flight we show skeleton cards at the same size as the
real ones, so the layout does not jump around.

If the API is down, I do not replace the whole page. `load` catches the
failure and returns either items or an error. The error shows in the results
area. Search, category and sort stay usable, and Retry re-runs the load.
SvelteKit's default is to throw from `load` and render `+error.svelte`, which
would wipe the controls you need to recover. That felt like the wrong
boundary.

Empty results get the same treatment — a panel in the results area, with a
clear-filters action.

## UI

`+page.svelte` is the only container. It owns URL state and passes plain
props down. `ItemCard`, `ItemGrid` and `StatusPanel` are presentational —
props in, callbacks out. No fetching, no routing.

I did not pull in a component library in the end. Tailwind plus a small set
of Mr D tokens in `layout.css` was enough.

## What I left out

- Authentication — local app, the brief said we can skip it
- Accessibility work beyond semantic HTML — out of scope for this take-home
- A real database — a JSON catalog is honest for a search slice, and
  clone-and-run stays one command
- Typeahead suggestions — prefix search plus debounce already covers the
  interaction
- Caching — not needed at this size, and it would hide the loading states

## Tests

The brief asked for at least one server-side test. I covered search matching
(including the Champagne / ham case), category filtering, pagination,
validation errors, and that Swagger actually serves.
