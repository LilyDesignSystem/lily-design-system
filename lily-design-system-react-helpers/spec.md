# Lily Design System — React 19 Helpers — Specification

Spec-driven plan and task list for the React 19 helpers catalog. This file is
the single source of truth for the **catalog**; each helper subproject keeps
its own `spec.md` for its component-level contract. See [index.md](./index.md)
for the human-readable guide and [AGENTS.md](./AGENTS.md) for the agent pointer.

## 1. Purpose

The helpers catalog ships a small set of opinionated, reusable React 19
components that sit alongside the headless
[`lily-design-system-react-headless`](../lily-design-system-react-headless/)
library. Where the headless library ships pure markup primitives, each helper
wraps a complete lifecycle — selection, optional persistence, and DOM
application — for one small, common job.

## 2. Scope

In scope:

- A catalog of focused helper subprojects, each owning one user-preference
  dimension (theme, locale).
- Headless behaviour only: semantic markup, ARIA, keyboard, and class hooks.
- SSR / prerender safety; framework-idiomatic React 19 source.

Out of scope:

- Bundled CSS, fonts, icons, or images (the consumer styles every helper).
- Data fetching, routing, animation choreography, or locale formatting.
- Hardcoded user-facing strings (all text arrives through props/parameters).

## 3. Catalog

| Helper | Purpose |
| ------ | ------- |
| [`lily-design-system-react-theme-picker`](./lily-design-system-react-theme-picker/) | Pick a visual theme; dynamic CSS load + `data-theme` swap, optional persistence. |
| [`lily-design-system-react-locale-picker`](./lily-design-system-react-locale-picker/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |

## 4. Conventions

Every helper subproject follows the same shape:

- package.json — package manifest.
- `spec.md` — single source of truth (numbered § references).
- `AGENTS.md` + `CLAUDE.md` — agent metadata.
- `index.md` (+ `README.md` symlink) — human-readable guide.
- Component source: `{Pascal}.tsx`, `{Pascal}.test.tsx`.
- `docs/` and `examples/` — topic guides and runnable examples.
- Tests: vitest + @testing-library/react — one test per numbered §7 acceptance in the helper's spec.

## 5. Design principles

- **Headless**: no bundled styles; one kebab-case class hook per root.
- **Accessible**: native semantics first; WCAG 2.2 AAA target.
- **i18n-clean**: every user-facing string is a prop/parameter; locale-aware
  helpers take the locale identifier and never pick a default.
- **SSR-safe**: DOM writes happen only after mount, never during render.
- **One job per helper**: each helper owns the full lifecycle of one
  preference dimension and composes cleanly with the others.
- **Spec-driven**: tests assert against numbered spec sections; docs link back.

## 6. Acceptance criteria

- [x] Catalog ships `theme-picker` and `locale-picker` helper subprojects.
- [x] Each helper has its component source, tests, `spec.md`, and package.json.
- [x] Each helper is headless (no bundled CSS/fonts/icons) and i18n-clean.
- [x] Catalog dir has `index.md`, `README.md` symlink, `AGENTS.md`,
      `CLAUDE.md`, `spec.md`, and `.git-subtree-push`.
- [x] `bin/test` passes for this subproject.

## 7. Status

Both helpers are implemented with React 19 source, tests, docs, and a package
manifest. The catalog mirrors the canonical
[`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
reference with React 19 idioms substituted.

## 8. References

- Canonical reference catalog: [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/).
- Headless sibling: [`lily-design-system-react-headless`](../lily-design-system-react-headless/).
- Root specification: [../spec.md](../spec.md) and [../AGENTS.md](../AGENTS.md).
