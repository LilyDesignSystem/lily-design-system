---
name: lily-design-system-maintainer-skill
description: Technical workflow for maintainers of the Lily Design System monorepo — the required-files layout for subprojects and components, the AGENTS.md sync model, the bin/ tooling (test, sync, sync-special-files, generate-registries, publish-headless, publish-helpers, git-subtree-push), the per-framework implementation conventions, and the spec-driven development workflow. Use when adding, changing, or auditing a component, subproject, or helper in this repository, or when running its verification, sync, or publish tooling.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — maintainer workflow

Technical reference for working inside the `lily-design-system` monorepo
itself — not for consumers of a published package (see
[`lily-design-system-skill`](../lily-design-system-skill/) for that). Everything here assumes a clone of
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
- **571 component directories** under `components/{slug}/`.
- **Root canon**: `components.tsv` (the catalog), `css-style-sheet-template.css`
  (one class hook per component), `AGENTS/*.md` (design-principle rules,
  loaded into every subproject's own `AGENTS.md` via `@AGENTS/{file}.md`),
  `themes/` (45 reference stylesheets), `spec/` (the specification, entered
  via `spec/index.md`).

## Required files, and how to get them right the first time

Don't hand-write these — scaffold, then fill in content.

**Per subproject** (`bin/create-implementation-directory {name}`):
`index.md`, `README.md` (symlink → `index.md`), `AGENTS.md`, `spec/index.md`.
(`CLAUDE.md` was retired 2026-09-19; `AGENTS.md` is the single AI-instruction file.) Then, because it's public:
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
to), `spec/index.md`.

`bin/test` verifies every one of the above, across the whole repo, in one
pass — run it before every commit that touches a subproject or component
directory.

## Adding a component to the catalog

The fast path is `bin/new-component {slug} "description"`: it adds the `components.tsv` row, the
docs directory, the CSS hook, a **placeholder** in all seven scaffolded headless libraries (plus
tests and stories), the two example apps `bin/test` verifies, and the docs-site route, then runs
`bin/generate-component-categories`, `bin/generate-registries`, `bin/generate-examples`,
`bin/generate-site-pages` and `bin/generate-api-docs`. Then replace the placeholders:

1. Write `components/{slug}/index.md` and `AGENTS.md` per `spec/components/index.md`'s quality
   standards (framework-agnostic guidance, a named Lily alternative in "When Not to Use",
   semantic-HTML + ARIA in the usage example, no hardcoded strings). `index.md`'s `## Usage` block
   is what the demonstration pages show, so make it a real example.
2. Implement in all 8 headless libraries, following [`AGENTS/headless.md`](../AGENTS/headless.md):
   most-specific semantic element first, kebab-case base class + consumer class hook as the first
   root attribute, rest-props spread on the root, zero CSS, ARIA/keyboard baked in per the
   component's `AGENTS.md` contract. Svelte is canonical (two real trees: `components/` and
   `src/lib/components/`, plus the SvelteKit examples copy). **Web Components has no scaffolded
   placeholder**: add `components/{slug}.ts` + test + story and the barrel entry, and bump the
   registered-element count pinned in its `index.test.ts`.
3. Barrel exports (`index.ts`) in the Svelte, React, Vue, Angular and Web Components libraries.
4. Replace the generic demo in the canonical SvelteKit `component-demos.ts` map; add extra states to
   `component-variants.json` where the component has meaningful ones (avoid element ids); re-run
   `bin/generate-registries`, `bin/generate-examples`, `bin/generate-site-pages`,
   `bin/generate-api-docs`.
5. Style it in the 45 themes (one block before the tooltip marker, `:where(...)` selectors) if the
   component needs more than the browser default; `bin/check-theme` must stay green.
6. Update the pinned counts that a new component moves: `bin/smoke-packages` (three), `spec/index.md`
   §5, the Web Components `index.test.ts`, and add a CHANGELOG entry.
7. Write real tests in every framework (vitest / bUnit / WebDriverIO), prove a few fail when the
   implementation is broken, and run the **whole** suite of each library you touched, not just the
   new files (a pinned count in one suite was missed this way on 2026-10-06).
8. `bin/test`, `bin/check-coverage`, `bin/check-links`, then `bin/sync`.

## The `bin/` tools

| Script | Purpose |
| --- | --- |
| `list-components-as-kebab-case` / `-as-pascal-case` | Enumerate the catalog. |
| `list-implementations` | Enumerate the implementation subprojects. |
| `create-component-directory` / `create-implementation-directory` | Scaffold the required-files skeleton. |
| `test` | Verify required files + catalog consistency + per-framework coverage across the whole repo. Exits non-zero on failure. Run this before every commit. |
| `sync` | rsync shared root files (`AGENTS.md`, `AGENTS/*.md`, …) into every subproject — not symlinks, because `git subtree push` doesn't follow symlinks across project boundaries. |
| `sync-special-files` | Propagate the 12 copied + 2 generated (`CITATION.cff`, `INSTALL.md`) special files into every `lily-design-system-*` subproject. Idempotent. |
| `update` | Update shared files. |
| `generate-registries` | Regenerate every example app's component registry from `components.tsv` + the canonical demo map. |
| `generate-storybook-stories.mjs` | Generate Storybook stories for a headless library. |
| `check-links` | Verify relative markdown links resolve. |
| `check-theme` | Conformance checks for the 45 reference themes. |
| `check-coverage` | Coverage drift matrix: per-component file presence across all 7 headless libraries (beyond `bin/test`'s 3). |
| `generate-theme-tokens` | DTCG token source under `themes/tokens/` — extract, generate, drift-check. |
| `generate-component-categories` | Regenerate `components-categories.tsv` (per-component HTML tag + category) from `components.tsv`. |
| `generate-api-docs` | Regenerate the site's canonical-contract sections from `components/*/AGENTS.md`; drift-checked. |
| `new-component` | End-to-end scaffolder: one new placeholder component across every layer `bin/test` verifies, then runs the generators below. |
| `generate-examples` | Per-component usage examples (from the docs) and rendered variants (`component-variants.json`) for every demonstration page. |
| `generate-site-pages` | Docs-site component pages: rebuild placeholders from `index.md`, refresh every Example section, write missing Playwright specs. |
| `smoke-packages` | Pack + install each published headless tarball into a scratch consumer and render it — catches `main`-never-built breakage. |
| `publish-headless` | Build + publish the 7 npm headless libraries and pack the Blazor one (NuGet publishes only through the `publish.yml` OIDC workflow). |
| `publish-helpers` | Build + publish every helper package (npm / NuGet). |
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
