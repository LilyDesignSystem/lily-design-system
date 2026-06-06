# Lily Design System — React Helpers

A catalog of opinionated, reusable React 19 helper components that sit
alongside the headless [`lily-design-system-react-headless`](../lily-design-system-react-headless/)
library. Where the headless library ships pure markup primitives,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job.

## Catalog

| Helper                                                                                  | Purpose                                                        |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`lily-design-system-react-theme-picker`](./lily-design-system-react-theme-picker/)     | Pick a visual theme; dynamic CSS load + `data-theme` swap.     |
| [`lily-design-system-react-locale-picker`](./lily-design-system-react-locale-picker/)   | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |

## Conventions

Every helper subproject follows the same shape:

```
lily-design-system-react-<name>/
├── spec.md                  ← single source of truth (SDD)
├── AGENTS.md                ← AI-agent metadata pointer
├── AGENTS/                  ← topic guides for AI coding agents
├── CLAUDE.md                ← loads AGENTS.md
├── CHANGELOG.md             ← per-version history
├── index.md                 ← human-readable guide
├── index.ts                 ← barrel re-export
├── {Pascal}.tsx             ← the component
├── {Pascal}.test.tsx        ← vitest spec (one test per §7 acceptance)
├── docs/                    ← topic guides for humans
└── examples/                ← runnable React 19 examples
```

Shared design decisions across the catalog:

- **React 19 function components** with TypeScript. Hooks
  (`useState`, `useEffect`, `useRef`) only — no class components,
  no legacy lifecycle methods.
- **TypeScript** on the public surface; types exported from
  `index.ts`.
- **Headless**: no bundled CSS, fonts, icons, or images. Consumer
  styles every visual aspect via a kebab-case class hook.
- **SSR-safe**: no DOM writes outside `useEffect`. Compiles cleanly
  under Next.js App Router (server components), Remix, Vite SSR,
  and React Server Components — components that touch the DOM carry
  the `"use client"` directive.
- **Controlled or uncontrolled**: every helper accepts a controlled
  `value` + `onChange` pair OR runs internally with `useState`.
- **i18n-clean**: every user-facing string comes from a prop. No
  hardcoded English (or any other natural language).
- **One job per helper**: each helper owns the entire lifecycle of
  one user-preference dimension (theme, language, etc.) and composes
  cleanly with the others.
- **Spec-driven**: every helper has a `spec.md` numbered with §
  references; tests assert against those numbers; docs link back.
- **Render-prop children**: when consumers need to override the
  default markup, they pass a `children` function that receives the
  picker's `ChildArgs` (state + setter + helpers).
- **Rest-prop spread**: every helper spreads `...restProps` onto the
  root `<fieldset>` so consumers can pass arbitrary HTML attributes
  (`id`, `data-*`, event handlers, ARIA overrides).

## Differences from the headless library

The headless library mirrors the canonical 492-component catalog.
Each component is a pure container with no lifecycle. A consumer
typing on top of `ThemePicker` from `lily-design-system-react-headless`
writes their own radio markup, their own persistence, and their own
loading.

The helpers in this directory are higher-level: they own the
lifecycle, they own the dynamic loading or attribute application, and
they expose a smaller, more opinionated API. Both layers can coexist
in one app; the helpers are not a replacement.

## Differences from the Svelte helpers

The Svelte and React helper catalogs are kept in lock-step: every
helper here mirrors a sibling in
[`../lily-design-system-svelte-helpers/`](../lily-design-system-svelte-helpers/),
sharing the same spec numbering, the same `data-*` attributes, the
same class hooks, and the same `locales.tsv` source data. The only
intentional divergences are framework idioms:

| Concern              | Svelte                                  | React                                       |
| -------------------- | --------------------------------------- | ------------------------------------------- |
| Reactivity           | Runes (`$state`, `$effect`, `$bindable`)| Hooks (`useState`, `useEffect`, `useRef`)   |
| Two-way binding      | `bind:value={…}`                        | Controlled `value` + `onChange` callback    |
| Custom rendering     | `Snippet<[ChildArgs]>`                  | `(args: ChildArgs) => React.ReactNode`      |
| File extension       | `.svelte`                               | `.tsx`                                      |
| Effect site          | `$effect(...)` inside `<script>`        | `useEffect(...)` inside the component body  |
| Rest props           | `{...restProps}` on root                | `{...restProps}` on root                    |
| Server boundary      | SvelteKit `+layout.server.ts`           | Next.js `"use client"` directive            |
| Cookie persistence   | `transformPageChunk` in `hooks.server.ts` | Cookie read in a server component, value piped to a client component |

The behavioural contract, the §7 acceptance criteria, the DOM the
helpers produce, and the `data-theme` / `lang` / `dir` attribute
they write are all identical. Code that depends on a Lily helper's
DOM contract works across both frameworks.

## AGENTS files

See [`./AGENTS.md`](./AGENTS.md) for the canonical AI-coding
entrypoint. Per-topic AGENTS files live in
[`./AGENTS/`](./AGENTS/).

| File                                              | Topic                                            |
| ------------------------------------------------- | ------------------------------------------------ |
| [AGENTS.md](./AGENTS.md)                          | Entrypoint + catalog pointer.                    |
| [AGENTS/conventions.md](./AGENTS/conventions.md)  | React idioms used across the catalog.            |
| [AGENTS/testing.md](./AGENTS/testing.md)          | vitest + jsdom + RTL test conventions.           |
| [AGENTS/accessibility.md](./AGENTS/accessibility.md) | WCAG 2.2 AAA contract; APG patterns.          |
| [AGENTS/ssr.md](./AGENTS/ssr.md)                  | Next.js App Router, Remix, RSC boundaries.       |
| [AGENTS/shared/](./AGENTS/shared/)                | Cross-framework Lily design principles.          |

## Cross-helper compatibility

The two pickers in the current catalog are deliberately compatible:

- `ThemePicker` and `LocalePicker` both render a
  `<fieldset role="radiogroup" aria-label="…">` so a row of pickers
  in the same banner has consistent semantics.
- The two pickers do not share state. Each owns its own
  `localStorage` key, its own `data-*` attribute, and its own
  managed DOM nodes.
- The class hooks (`theme-picker`, `locale-picker`) are independent
  so a single stylesheet rule can target either.

Mounting both pickers in one banner is the recommended pattern when
your app has both a colour scheme and a language preference.

## License

Each helper is dual-licensed under MIT or Apache-2.0 or GPL-2.0 or
GPL-3.0 or BSD-3-Clause. Contact joel@joelparkerhenderson.com for
other terms.

## Tracking

- Catalog version: 0.1.0
- Created: 2026-06-05
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
