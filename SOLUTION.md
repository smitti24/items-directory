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
| `grill-me-with-docs`  |                                                                       |
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
