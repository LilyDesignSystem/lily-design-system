# Lily Design System — HTML Helpers — Specification

Spec-driven plan and task list for the HTML helpers catalog. This file is
the single source of truth for the **catalog**; each helper subproject keeps
its own `spec/index.md` for its component-level contract. See [index.md](../index.md)
for the human-readable guide and [AGENTS.md](../AGENTS.md) for the agent pointer.

## 1. Purpose

The helpers catalog ships a small set of opinionated, reusable HTML
components that sit alongside the headless
[`lily-design-system-html-headless`](../../lily-design-system-html-headless/)
library. Where the headless library ships pure markup primitives, each helper
wraps a complete lifecycle — selection, optional persistence, and DOM
application — for one small, common job.

## 2. Scope

In scope:

- A catalog of focused helper subprojects, each owning one user-preference
  dimension (theme, locale).
- Headless behaviour only: semantic markup, ARIA, keyboard, and class hooks.
- SSR / prerender safety; framework-idiomatic HTML source.

Out of scope:

- Bundled CSS, fonts, icons, or images (the consumer styles every helper).
- Data fetching, routing, animation choreography, or locale formatting.
- Hardcoded user-facing strings (all text arrives through props/parameters).

## 3. Catalog

| Helper | Purpose |
| ------ | ------- |
| [`lily-design-system-html-theme-chooser`](../lily-design-system-html-theme-chooser/) | Pick a visual theme; dynamic CSS load + `data-theme` swap, optional persistence. |
| [`lily-design-system-html-locale-chooser`](../lily-design-system-html-locale-chooser/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |
| [`lily-design-system-html-text-size-chooser`](../lily-design-system-html-text-size-chooser/) | Pick a text size; sets `data-text-size` on the document root. |
| [`lily-design-system-html-share-chooser`](../lily-design-system-html-share-chooser/) | Share the page: native share sheet, or a disclosure list of consumer-supplied destinations + copy the URL. |

## 4. Conventions

Every helper subproject follows the same shape:

- package.json — package manifest.
- `spec/index.md` — single source of truth (numbered § references).
- `AGENTS.md` + `CLAUDE.md` — agent metadata.
- `index.md` (+ `README.md` symlink) — human-readable guide.
- Component source: `{kebab}.ts`, `{kebab}.test.ts` (custom element).
- `docs/` and `examples/` — topic guides and runnable examples.
- Tests: vitest — one test per numbered §7 acceptance in the helper's spec.

## 5. Design principles

- **Headless**: no bundled styles; one kebab-case class hook per root.
- **Accessible**: native semantics first; WCAG 2.2 AAA target.
- **i18n-clean**: every user-facing string is a prop/parameter; locale-aware
  helpers take the locale identifier and never pick a default.
- **SSR-safe**: DOM writes happen only after mount, never during render.
- **One job per helper**: each helper owns one job end to end and
  composes cleanly with the others. For the three preference helpers
  that job is the full lifecycle of one preference dimension; for
  `share-chooser` it is a single action, which applies nothing to the
  document and persists nothing.
- **Spec-driven**: tests assert against numbered spec sections; docs link back.

## 6. Acceptance criteria

- [x] Catalog ships `theme-chooser`, `locale-chooser`, `text-size-chooser`,
      and `share-chooser` helper subprojects.
- [x] Each helper has its component source, tests, `spec/index.md`, and package.json.
- [x] Each helper is headless (no bundled CSS/fonts/icons) and i18n-clean.
- [x] Catalog dir has `index.md`, `README.md` symlink, `AGENTS.md`,
      `CLAUDE.md`, `spec/index.md`, and `.git-subtree-push`.
- [x] `bin/test` passes for this subproject.

## 7. Status

All four helpers are implemented with HTML source, tests, docs, and a
package manifest. The catalog mirrors the canonical
[`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/)
reference with HTML idioms substituted.

`share-chooser` (0.1.0) is the newest and the first non-preference
helper. It is also the one place the catalog's single-rendering-shape
rule is deliberately broken: its items are links, so it renders a
**disclosure** with real `<a>` elements rather than the APG listbox the
preference helpers use. See its
[`spec/index.md` §3](../lily-design-system-html-share-chooser/spec/index.md#3-architectural-decisions).

## 8. References

- Canonical reference catalog: [`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/).
- Headless sibling: [`lily-design-system-html-headless`](../../lily-design-system-html-headless/).
- Root specification: [../spec/index.md](../../spec/index.md) and [../AGENTS.md](../../AGENTS.md).
