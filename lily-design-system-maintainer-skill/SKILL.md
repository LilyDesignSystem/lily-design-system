---
name: lily-design-system-maintainer-skill
description: Technical workflow for maintainers of the Lily Design System monorepo — the required-files layout for subprojects and components, the AGENTS.md sync model, the bin/ tooling (test, sync, sync-special-files, generate-registries, publish-headless, publish-helpers, git-subtree-push), the per-framework implementation conventions, and the spec-driven development workflow. Use when adding, changing, or auditing a component, subproject, or helper in this repository, or when running its verification, sync, or publish tooling.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — maintainer workflow

Technical reference for working inside the `lily-design-system` monorepo
itself — not for consumers of a published package (see
[`lily-skill`](../lily-skill/) for that). Everything here assumes a clone of
the canonical monorepo with `spec/index.md` as the living specification and
`AGENTS.md` → `AGENTS/*.md` as the binding design-principle rules.

## Repository shape

- **21 implementation subprojects**: 7 headless libraries, 7 example apps, 7
  helper catalogs, one per framework (HTML, Svelte, React, Vue, Angular,
  Blazor, Nunjucks). Each is also a `git subtree` pushed to its own
  standalone public repo — directory names all start with the
  `lily-design-system-` prefix, which is exactly what `bin/list-implementations`
  and `bin/sync-special-files` scope on. Don't create a top-level dir with
  that prefix unless it genuinely is a subtree-pushed subproject.
- **491 component directories** under `components/{slug}/`.
- **Root canon**: `components.tsv` (the catalog), `css-style-sheet-template.css`
  (one class hook per component), `AGENTS/*.md` (design-principle rules,
  loaded into every subproject's own `AGENTS.md` via `@AGENTS/{file}.md`),
  `themes/` (45 reference stylesheets), `spec/` (the specification, entered
  via `spec/index.md`).

## Required files, and how to get them right the first time

Don't hand-write these — scaffold, then fill in content.

**Per subproject** (`bin/create-implementation-directory {name}`):
`index.md`, `README.md` (symlink → `index.md`), `AGENTS.md`, `CLAUDE.md`
(just `@AGENTS.md`), `spec/index.md`. Then, because it's public:
`.git-subtree-push` (one line: the directory name) and the 14 "special
files" a public repo needs — LICENSE.md, CITATION.cff, NEWS.md,
COMPARISONS.md, BENCHMARKS.md, INSTALL.md, CONTRIBUTING.md, CODEOWNERS,
MAINTAINERS.md, CHANGELOG.md, AI_STATEMENT.md, GOVERNANCE.md, SECURITY.md,
CODE_OF_CONDUCT.md, RFC.md — propagated by `bin/sync-special-files`, which
auto-discovers any dir matching `lily-design-system-*`. Run it after
scaffolding a new subproject; it's idempotent, so running it again later is
always safe. Full contract: [spec/special-files-for-public-repos/index.md](../spec/special-files-for-public-repos/index.md).

**Per component** (`bin/create-component-directory {slug}`): `index.md`
(When to Use / When Not to Use / Usage / Props / ARIA / Keyboard /
References, in that order — see `spec/index.md §8`), `README.md` (symlink),
`AGENTS.md` (canonical machine-readable metadata: HTML tag, ARIA, keyboard,
props — the single source of truth the headless implementations conform
to), `CLAUDE.md`, `spec/index.md`.

`bin/test` verifies every one of the above, across the whole repo, in one
pass — run it before every commit that touches a subproject or component
directory.

## Adding a component to the catalog

1. Add the row to `components.tsv` (slug, PascalCase name, description) —
   this is the canonical source; everything else is generated or hand-ported
   from it.
2. `bin/create-component-directory {slug}`; write `index.md` and `AGENTS.md`
   per `spec/components/index.md`'s quality standards (framework-agnostic
   guidance, a named Lily alternative in "When Not to Use", semantic-HTML +
   ARIA in the usage example, no hardcoded strings).
3. Add the class hook to `css-style-sheet-template.css`.
4. Implement in all 7 headless libraries, following [`AGENTS/headless.md`](../AGENTS/headless.md):
   most-specific semantic element first, kebab-case base class + consumer
   class hook as the first root attribute, rest-props spread on the root,
   zero CSS, ARIA/keyboard baked in per the component's `AGENTS.md` contract.
5. Copy the implementation into all 7 example apps (the copy-pattern — see
   [`spec/frameworks/index.md`](../spec/frameworks/index.md)); add a demo entry
   (canonical source: the SvelteKit `component-demos.ts` map), then
   `bin/generate-registries` to regenerate every other app's registry from
   `components.tsv` + that demo map.
6. Write tests in every framework that has a runnable suite (vitest/bUnit/
   WebDriverIO per subproject) and a Storybook story where the library has
   Storybook wired.
7. `bin/test`, then `bin/sync` to propagate any shared root files that
   changed.

## The `bin/` tools

| Script | Purpose |
| --- | --- |
| `list-components-as-kebab-case` / `-as-pascal-case` | Enumerate the catalog. |
| `list-implementations` | Enumerate the 21 `lily-design-system-*` subprojects. |
| `create-component-directory` / `create-implementation-directory` | Scaffold the required-files skeleton. |
| `test` | Verify required files + catalog consistency + per-framework coverage across the whole repo. Exits non-zero on failure. Run this before every commit. |
| `sync` | rsync shared root files (`AGENTS.md`, `AGENTS/*.md`, …) into every subproject — not symlinks, because `git subtree push` doesn't follow symlinks across project boundaries. |
| `sync-special-files` | Propagate the 12 copied + 2 generated (`CITATION.cff`, `INSTALL.md`) special files into every `lily-design-system-*` subproject. Idempotent. |
| `generate-registries` | Regenerate every example app's component registry from `components.tsv` + the canonical demo map. |
| `generate-storybook-stories.mjs` | Generate Storybook stories for a headless library. |
| `check-links` | Verify relative markdown links resolve. |
| `check-theme` | Conformance checks for the 45 reference themes. |
| `generate-theme-tokens` | DTCG token source under `themes/tokens/` — extract, generate, drift-check. |
| `generate-api-docs` | Regenerate the site's canonical-contract sections from `components/*/AGENTS.md`; drift-checked. |
| `publish-headless` | Build + publish the 7 headless libraries (npm / NuGet). |
| `publish-helpers` | Build + publish the 35 helper packages (npm / NuGet). |
| `git-subtree-push` | Push each subtree to its standalone public remote. |

## Design-principle rules to check before writing headless code

Load the specific `AGENTS/*.md` file for the area you're touching — don't
rely on memory, the rules are the binding source:

- [`headless.md`](../AGENTS/headless.md) — markup, ARIA, behaviour
  boundaries, zero-CSS.
- [`accessibility.md`](../AGENTS/accessibility.md) — WCAG 2.2 AAA, WAI-ARIA
  APG patterns, the ARIA reference table.
- [`internationalization.md`](../AGENTS/internationalization.md) — no
  hardcoded strings, stable text-prop names.
- [`theme.md`](../AGENTS/theme.md) — the headless forbidden-literal list
  (no hex colours, no `font-*`, no spacing literals, no breakpoints).
- [`helpers.md`](../AGENTS/helpers.md) — the `*-picker` catalog contract,
  if the change touches a helper rather than a plain catalog component.
- [`components.md`](../AGENTS/components.md) — suffix→element mapping and
  compound name-family patterns.

## Verify

`bin/test` from the repo root. It should exit 0; if it doesn't, the error
lines name the exact file or check that failed.
