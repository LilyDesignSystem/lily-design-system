# Developing Lily Design System™

The contributor's working guide: how the monorepo is put together, how
to set up, and the complete add-a-component walkthrough. The rules that
get a change rejected are in [CONTRIBUTING.md](../CONTRIBUTING.md);
this document is the how.

_The walkthrough below was validated end to end on 2026-08-28 by
performing it with a scratch component until `bin/test` passed, then
reverting — every step listed is one the gates actually demand._

## Setup

```sh
git clone https://github.com/LilyDesignSystem/lily-design-system.git
cd lily-design-system
bin/test          # required files, catalog/registry consistency, themes
bin/check-links   # every relative markdown link resolves
```

Node 22+ with pnpm for the JavaScript subprojects (`pnpm install`
per subproject — each is standalone); .NET 10 for the Blazor pair.
There is no root-level install: the monorepo is a federation of
standalone subtrees, not a workspace.

## How the monorepo is put together

- **One catalog, everywhere.** `components.tsv` (slug ⇥ PascalCase ⇥
  description) is the source of truth; `components/{slug}/AGENTS.md`
  fixes each component's element, ARIA, keyboard contract, props, and
  maturity `Status`.
- **Subtrees, not submodules.** Every subproject publishes standalone
  via `bin/git-subtree-push`; nothing may reach across subproject
  boundaries at build time (a Turbopack upgrade once exposed an alias
  that did — see CHANGELOG 2026-08-26).
- **The copy-pattern.** Example apps consume headless components as
  *copies* in their own tree, not as imports of the sibling subproject.
- **Generated, not hand-mirrored.** Registries, demo maps, theme token
  blocks, and the site's status badges are emitted by `bin/`
  generators from canonical sources; `bin/test` fails on drift. Edit
  the source, run the generator.

## The `bin/` tools, in the order you meet them

| Tool | When |
| --- | --- |
| `bin/test` | Before and after everything; the gate |
| `bin/check-links` | With every docs change |
| `bin/create-component-directory` | Scaffolds a component's doc directory (files are created empty — filling them is step 2 below) |
| `bin/generate-registries` | After any catalog or demo-map change |
| `bin/check-theme`, `bin/generate-theme-tokens` | With any theme change (`--check` runs inside bin/test) |
| `bin/sync`, `bin/sync-special-files` | After editing canonical AGENTS/, themes/, or root special files |
| `bin/smoke-packages`, `bin/publish-*` | Release engineering ([docs/releasing.md](releasing.md)) |
| `bin/git-subtree-push` | Maintainer: publish subtrees |

## Add a component, start to finish

Agree it exists first — open an issue; a component is work in 14
subprojects ([CONTRIBUTING.md](../CONTRIBUTING.md) § Adding a
component). Then:

**1. Catalog row.** Append to `components.tsv`:
slug ⇥ PascalCase ⇥ one-sentence description (tab-separated).

**2. Docs directory.**

```sh
bin/create-component-directory <slug>
```

The scaffolder creates the shape; the files are empty and `bin/test`
rejects empty files, so fill:

- `index.md` — the nine-section doc (spec §8), including a
  `**Status:** experimental — …` line (new components start
  experimental; the rubric is in
  [spec/components](../spec/components/index.md) § Maturity).
- `AGENTS.md` — the Metadata block: Component, PascalCase,
  Description, `- Status: experimental — …` (bin/test asserts exactly
  one valid Status bullet), HTML tag, CSS class, Interactive — then
  ARIA and Keyboard sections for interactive components.
- `spec/index.md` — the component's spec-driven plan.

**3. CSS hook.** Add `.{slug} { }` to `css-style-sheet-template.css`
(bin/test asserts exactly one hook per slug).

**4. Demo entry.** Add to the canonical demo map,
`lily-design-system-svelte-sveltekit-examples/src/lib/data/component-demos.ts`
— **single-line entry format** (`'slug': '<markup>'`); the generator's
parser does not accept wrapped lines. Demo markup must itself be
axe-clean: labels on inputs, `aria-checked` on radio roles, required
ARIA parents — the full-catalog sweep will run it. Then:

```sh
bin/generate-registries   # propagates to every app's registry + demo map
```

**5. Site route.** Create
`lilydesignsystem.github.io/src/routes/components/{slug}/` with the
standard file set (`index.md`, `README.md` symlink, `AGENTS.md`,
`CLAUDE.md` containing `@AGENTS.md`, `spec/index.md`) plus
`+page.svelte` (copy a sibling's and adjust).

**6. Implementations — all seven frameworks.** Svelte is canonical:
implement `lily-design-system-svelte-headless/src/lib/components/{Pascal}/`
first ({Pascal}.svelte + .test.ts + .stories.svelte + index.md), copy
into the SvelteKit app's `src/lib/components/{Pascal}/`, then port to
react, vue, angular, html, and blazor headless (+ their example-app
copies) and nunjucks (`components/{slug}/macro.njk` + macro.test.js +
index.md). Follow the suffix→element mapping and a sibling component's
idiom in each framework.

> Honesty note: `bin/test` currently machine-gates the svelte,
> sveltekit-copy, and nunjucks implementations; the other frameworks
> are required by the parity contract but caught only in review — the
> planned `bin/check-coverage` (plan P7-T4) closes that gap.

**7. Gate.**

```sh
bin/test && bin/check-links
```

Run the framework suites you touched (`pnpm exec vitest run`,
`dotnet test`). A new component's tests must bite — see
CONTRIBUTING's regression-test rule.

## Reverting a component

The mirror image, validated in the same dry run: delete the catalog
row, `components/{slug}/`, the CSS hook, the demo entry, the site
route, and every implementation directory; run
`bin/generate-registries`; `bin/test` returns green and `git status`
clean.

---

Lily™ and Lily Design System™ are trademarks.
