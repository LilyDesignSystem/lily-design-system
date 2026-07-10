# Trademarks

## Summary

"Lily" and "Lily Design System" are trademarks. This topic records the marks,
how they are attributed in the project's documentation, and the mechanical
convention for applying the ™ symbol and the trademark footer.

## Scope

**Covers:** the trademark marks themselves, the first-occurrence ™ convention,
and the standard footer line — applied across the human-facing documentation of
the whole repository (every subproject, component doc, `docs/`, and the `spec/`
topic docs), the rendered example apps and the `lilydesignsystem.github.io`
site, and the `LICENSE` file.

**Excludes:** the software licence (see [LICENSE.md](../LICENSE.md) — the code is
offered under MIT / Apache-2.0 / GPL-2.0 / GPL-3.0 / BSD-3-Clause), and any
registration status. A trademark claim (™) is an assertion of use; it is
independent of the open-source code licence and of registered-mark status (®).

## Marks

| Mark | Applies to |
| ---- | ---------- |
| Lily™ | The design system's short name, the `lily` package, and the project as a whole. |
| Lily Design System™ | The full name of the project. |

## Principles and rules

- **Mark the first occurrence.** In a given document, add the ™ symbol to the
  **first** occurrence of `Lily Design System` (→ `Lily Design System™`) and to
  the **first** standalone occurrence of `Lily` — i.e. `Lily` not immediately
  followed by `Design System` (→ `Lily™`). Later occurrences are left unmarked
  to keep prose readable.
- **Use the ™ glyph.** Use the actual `™` character (U+2122), not the ASCII
  `(tm)`. The `(tm)` spelling is acceptable only where a plain-text medium
  cannot render the glyph.
- **Do not mark identifiers.** Package names, file paths, URLs, kebab-case
  class hooks (e.g. `lily.md`, `theme-select`), and code should not carry the ™
  symbol — only human-facing prose does.
- **Footer on each page.** Every human-facing page ends with the standard footer
  line below, set off by a horizontal rule — including component and subproject
  docs that never mention the marks in prose, since the footer is itself the
  trademark notice.
- **Rendered pages carry a footer too.** The example apps and the
  `lilydesignsystem.github.io` site render the same notice at the bottom of
  every page, placed once in each app's shared layout (or footer partial) so it
  appears site-wide. The `github.io` site additionally marks its visible header
  (`Lily Design System™`) and the first standalone `Lily™` in its intro copy.
- **The LICENSE carries the notice.** `LICENSE.md` ends with the footer line,
  noting that the ™ claim is independent of the content license.

### Standard footer

```markdown
---

Lily™ and Lily Design System™ are trademarks.
```

## Where applied

The first-occurrence convention and footer are applied across the repository.

**Human-facing markdown** — the ™ marks (where the words occur in prose) and the
footer are applied to:

| Scope | Which files |
| ----- | ----------- |
| Top-level docs | [AGENTS.md](../AGENTS.md), [CHANGELOG.md](../CHANGELOG.md), [index.md](../index.md) (`README.md` symlinks to it), [spec/index.md](index.md) |
| Spec topic docs | every `spec/**/*.md` (this file included) |
| Subproject + component docs | every `index.md` across all 21 subprojects, the 491 component directories, and `lilydesignsystem.github.io` |
| Reference docs | every `docs/**/*.md` (e.g. the helper packages' guides) |

**Rendered pages** — the footer is placed once in each app's shared layout so it
renders site-wide:

| Surface | Where the footer lives |
| ------- | ---------------------- |
| SvelteKit / React / Vue / Blazor / Angular example apps | the root layout (`+layout.svelte`, `app/layout.tsx`, `app.vue`, `MainLayout.razor`, `app.ts`) |
| Nunjucks Eleventy example app | the `footer.njk` partial |
| HTML+CSS+JS example app | each static page's site `<footer>` |
| `lilydesignsystem.github.io` | the site layout footer; plus the header `<span>` mark and the intro's first `Lily™` |

**LICENSE** — [LICENSE.md](../LICENSE.md) ends with the footer, noting the mark
is independent of the content license.

**Deliberately unmarked** — machine-readable metadata (`AGENTS.md` under
subprojects/components), `CLAUDE.md` loaders, and per-subproject/per-component
`spec/index.md` plan files carry neither the prose mark nor the footer, as do
package names, file paths, URLs, and kebab-case class hooks.

## Acceptance criteria

- [x] "Lily" and "Lily Design System" are declared as trademarks.
- [x] The ™ symbol is applied to the first `Lily Design System` and first
      standalone `Lily` in every human-facing markdown page that names the
      project (top-level docs, spec topic docs, subproject + component `index.md`,
      `docs/`, and the `github.io` site content).
- [x] Every human-facing markdown page ends with the standard trademark footer.
- [x] The example apps and the `github.io` site render the footer site-wide from
      their shared layout; the `github.io` header and intro carry the ™ marks.
- [x] `LICENSE.md` carries the trademark notice.
- [x] Identifiers, paths, code hooks, machine-readable `AGENTS.md`, `CLAUDE.md`
      loaders, and `spec/index.md` plan files are left unmarked.

## Related topics

- [overview](overview/index.md) — vision, scope, key facts.
- [citations](citations/index.md) — the design systems Lily learns from.

## Sources

- [AGENTS.md](../AGENTS.md), [CHANGELOG.md](../CHANGELOG.md),
  [index.md](../index.md), [spec/index.md](index.md) — top-level marked documents.
- [LICENSE.md](../LICENSE.md) — the content licence (distinct from these marks),
  now carrying the trademark notice.

---

Lily™ and Lily Design System™ are trademarks.
