# Lily Design System™ — Public Site

The living specification is the [spec/](spec/index.md) directory (entry
point `spec/index.md`). This file is the pointer AI coding agents and
humans should start from; see [index.md](index.md) for the human-oriented
project overview.

## What this is

A SvelteKit project (`@sveltejs/adapter-static`) that prerenders the
entire public marketing/docs site for the Lily Design System™, deployed by
GitHub Actions to <https://lilydesignsystem.com/>. It presents the
491-component headless catalog as browsable pages, teaches the seven
framework stacks, and explains why and how to adopt Lily. It does not
implement or ship any component library itself — see
[spec/index.md §2](spec/index.md#2-scope) for the exact scope split.

## Metadata

- **Package**: lilydesignsystem.github.io
- **License**: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for other terms
- **Contact**: Joel Parker Henderson (joel@joelparkerhenderson.com)

## Routes

- `/` — home
- `/components/` and `/components/<slug>/` — the 491-component catalog
  (one route per `components.tsv` row)
- `/examples/` — links to the seven worked example apps
- `/tutorials/` and `/tutorials/<framework>/` — one tutorial per framework
  pair, plus `/tutorials/theming/` and `/tutorials/helpers/`
- `/comparisons/`, `/why/`, `/about/`, `/help/`
- `/lily-claude-code/`, `/lily-claude-design/`, `/lily-figma/`

## Working rules

- Treat [`spec/index.md`](spec/index.md) as the single source of truth for
  this site's scope and content model; read it before making structural
  changes.
- `src/lib/components.ts` is **generated** from the main repo's
  `components.tsv` by the main repo's `bin/generate-registries` — never
  hand-edit it. See [spec/index.md §6](spec/index.md#6-the-component-catalog-srclibcomponentsts).
- Keep all prose, class hooks, and import paths current with the main
  repo's naming. In particular, the five `*-helpers` packages are named
  `theme-picker`, `locale-picker`, `text-size-picker`, `share-picker`, and
  `date-time-picker` (post-2026-07-28 rename) — never the older
  `*-select` / `*-button` / `*-chooser` forms, except where deliberately
  discussing history. This does not affect the catalog's own
  `theme-select` / `theme-select-option` components, which are unrelated
  and keep their names.
- Do not hand-write new component documentation prose in
  `src/routes/components/<slug>/+page.svelte` — port it from the
  canonical `components/{slug}/index.md` in the main repo. See
  [`src/routes/components/AGENTS.md`](src/routes/components/AGENTS.md).
- `bin/test` at the monorepo root gates this subproject: it checks that
  every catalog component has a route directory here
  (`test_lilydesignsystem_github_io`) and that `components.ts`'s entry
  count matches the catalog (`registry_count_or_err`). Run it after any
  change that touches the catalog or the component routes.
- Run `pnpm check` (svelte-check) and `pnpm test` (Playwright) before
  committing changes to `src/`.
- Do not touch any `lily-design-system-*` subproject, the monorepo root
  `bin/`, or the monorepo root `spec/` / `AGENTS/` from this subproject —
  those are owned elsewhere.

---

Lily™ and Lily Design System™ are trademarks.
