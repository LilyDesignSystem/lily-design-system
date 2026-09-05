# Lily Design System — Nunjucks 3 Helpers — Specification

Spec-driven plan and task list for the Nunjucks 3 helpers catalog. This file is
the single source of truth for the **catalog**; each helper subproject keeps
its own `spec/index.md` for its component-level contract. See [index.md](../index.md)
for the human-readable guide and [AGENTS.md](../AGENTS.md) for the agent pointer.

## 1. Purpose

The helpers catalog ships a small set of opinionated, reusable Nunjucks 3
components that sit alongside the headless
[`lily-design-system-nunjucks-headless`](../../lily-design-system-nunjucks-headless/)
library. Where the headless library ships pure markup primitives, each helper
wraps a complete lifecycle — selection, optional persistence, and DOM
application — for one small, common job.

## 2. Scope

In scope:

- A catalog of focused helper subprojects, each owning one user-preference
  dimension (theme, locale).
- Headless behaviour only: semantic markup, ARIA, keyboard, and class hooks.
- SSR / prerender safety; framework-idiomatic Nunjucks 3 source.

Out of scope:

- Bundled CSS, fonts, icons, or images (the consumer styles every helper).
- Data fetching, routing, animation choreography, or locale formatting.
- Hardcoded user-facing strings (all text arrives through props/parameters).

## 3. Catalog

| Helper                                                                                       | Purpose                                                                          |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`lily-design-system-nunjucks-theme-picker`](../lily-design-system-nunjucks-theme-picker/)   | Pick a visual theme; dynamic CSS load + `data-theme` swap, optional persistence. |
| [`lily-design-system-nunjucks-locale-picker`](../lily-design-system-nunjucks-locale-picker/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root.                  |
| [`lily-design-system-nunjucks-text-size-picker`](../lily-design-system-nunjucks-text-size-picker/) | Pick a text size; sets `data-text-size` on the document root.                                                                             |
| [`lily-design-system-nunjucks-motion-picker`](../lily-design-system-nunjucks-motion-picker/) | Pick a reduced-motion preference; sets `data-motion` on the document root. The macro cannot call `matchMedia` at render time, so it marks `motions[0]` selected server-side and `motion-picker.client.js` corrects it on init — this catalog's one documented deviation from the canonical contract. |
| [`lily-design-system-nunjucks-share-picker`](../lily-design-system-nunjucks-share-picker/) | Share the page: native share sheet, or a disclosure of consumer-supplied destinations + copy the URL. Owns an action, not a preference.   |
| [`lily-design-system-nunjucks-date-time-picker`](../lily-design-system-nunjucks-date-time-picker/) | Pick a date, a time, or both: a typeable text field plus an APG Date Picker Dialog, built client-side (no `Intl` in templates). Owns a form value, not a preference.                  |

## 4. Conventions

Every helper subproject follows the same shape:

- package.json — package manifest.
- `spec/index.md` — single source of truth (numbered § references).
- `AGENTS.md` + `CLAUDE.md` — agent metadata.
- `index.md` (+ `README.md` symlink) — human-readable guide.
- Component source: `{kebab}.njk`, `{kebab}.client.js`, `{kebab}.test.ts`.
- `docs/` and `examples/` — topic guides and runnable examples.
- Tests: vitest — one test per numbered §7 acceptance in the helper's spec.

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

- [x] Catalog ships all six helper subprojects: `theme-picker`,
      `locale-picker`, `text-size-picker`, `motion-picker`,
      `share-picker`, and `date-time-picker`.
- [x] Each helper has its component source, tests, `spec/index.md`, and package.json.
- [x] Each helper is headless (no bundled CSS/fonts/icons) and i18n-clean.
- [x] Catalog dir has `index.md`, `README.md` symlink, `AGENTS.md`,
      `CLAUDE.md`, `spec/index.md`, and `.git-subtree-push`.
- [x] `bin/test` passes for this subproject.

## 7. Status

All six helpers are implemented with Nunjucks 3 source, tests, docs, and a
package manifest. The catalog mirrors the canonical
[`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/)
reference with Nunjucks 3 idioms substituted, each as a macro + client.js
pair.

`share-picker` and `date-time-picker` are the two helpers that don't fit
the icon-button-opens-listbox shape the first four share: `share-picker`
renders a **disclosure** of real `<a>` elements and owns an action rather
than a preference; `date-time-picker` is a **form control** — a typeable
text field plus an APG Date Picker Dialog — and owns a form value.
Neither applies anything to the document or persists anything.
`date-time-picker` is also the hardest port in the catalog, since the
macro cannot render the calendar grid at all (no `Intl` in templates) —
`date-time-picker.client.js` builds it. See each helper's own
`spec/index.md` for its full architectural-decisions section, including
`motion-picker`'s and `date-time-picker`'s documented server/client
deviations.

## 8. References

- Canonical reference catalog: [`lily-design-system-svelte-helpers`](../../lily-design-system-svelte-helpers/).
- Headless sibling: [`lily-design-system-nunjucks-headless`](../../lily-design-system-nunjucks-headless/).
- Root specification: [../spec/index.md](../../spec/index.md) and [../AGENTS.md](../../AGENTS.md).
