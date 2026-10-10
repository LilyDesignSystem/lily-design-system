# Architecture

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily™ is a monorepo holding a canonical 571-component catalog and tools, plus 122 implementation subprojects — 8 headless libraries (7 full-catalog, 1 at its full achievable scope), 7 example apps and 107 helper packages (one top-level subproject each, all eight frameworks) — together with the `@lilydesignsystem/themes` package, the `lilydesignsystem.github.io` docs site, and 26 Claude Skill packages. Every one of these is a `git subtree` pushed to its own standalone remote.

## Scope

This topic covers the monorepo directory layout, the 122 implementation subprojects, the themes package, docs site and skills, the git-subtree publishing model and multi-forge remote fan-out, and the required files per subproject and per component directory.

It does not cover the vision or scope split (see [overview](../overview/index.md)), the catalog contents and naming (see [components](../components/index.md)), or the listing/scaffold/sync/test scripts in detail (see [tooling](../tooling/index.md)).

## Principles and rules

- The repository root holds the **canonical catalog and tools**; subprojects hold framework-specific implementations.
- `AGENTS.md` and `AGENTS/*.md` at the repo root are **canonical**; `bin/sync` rsyncs them into each subproject (rsync, not symlinks — a copy stays correct when a subproject is packaged or copied out on its own).
- Every subproject is a directory of this monorepo; packages publish from here (see [trusted-publishing](../trusted-publishing/index.md) § Monorepo publishing). Until 2026-10-10 each subproject was also its own public `git subtree` repository; those mirrors were deleted, and only the docs site (`lilydesignsystem.github.io`, GitHub Pages) is still pushed to a repository of its own, by `make github-pages`.
- Every subproject and every component directory must carry the **required files** below; `bin/test` verifies their presence.
- `README.md` is always a **symlink to `index.md`**.

## Monorepo directory layout

```
lily-design-system/                              ← canonical catalog + tools
├── AGENTS.md, AGENTS/*.md                       ← modular reference docs (AGENTS.md is the single AI file; CLAUDE.md was retired 2026-09-19)
├── components.tsv                               ← canonical 571-component list
├── components/{slug}/                           ← per-component docs (571 dirs: index.md, README.md → index.md, AGENTS.md, spec/index.md)
├── component-variants.json                      ← curated extra demo states (bin/generate-examples)
├── css-style-sheet-template.css                 ← class-hook stylesheet template
├── themes/                                      ← 45 reference theme stylesheets (+ tokens/)
├── bin/                                         ← scaffolding, listing, sync, generators, test, publish
├── spec/index.md, spec/{topic}/index.md         ← spec + modular topic docs
├── lily-design-system-{framework}-headless/     ← 8 headless libraries: html, svelte, react, vue, angular, blazor, nunjucks, web-components
├── lily-design-system-{framework}-{package}/ ← 107 helper packages, one subproject each (bin/list-helper-packages <framework>)
├── lily-design-system-html-css-js-examples/     ← examples: vanilla HTML+CSS+JS
├── lily-design-system-svelte-sveltekit-examples/ ← examples: SvelteKit
├── lily-design-system-react-next-examples/      ← examples: Next.js
├── lily-design-system-vue-nuxt-examples/        ← examples: Nuxt.js
├── lily-design-system-angular-examples/         ← examples: Angular + Analog.js
├── lily-design-system-blazor-web-examples/      ← examples: Blazor Web
├── lily-design-system-nunjucks-eleventy-examples/ ← examples: Nunjucks + Eleventy
├── lily-design-system-themes/                   ← @lilydesignsystem/themes (npm): packages the root themes/
├── lily-design-system-*-skill/                  ← 26 Claude Skill packages (see agent-skills)
└── lilydesignsystem.github.io/                  ← the docs site (SvelteKit, GitHub Pages)
```

## The 122 implementation subprojects

| Framework | Headless library | Example app |
| --- | --- | --- |
| HTML | `@lilydesignsystem/html-headless` | `lily-design-system-html-css-js-examples` |
| Svelte | `@lilydesignsystem/svelte-headless` | `lily-design-system-svelte-sveltekit-examples` |
| React | `@lilydesignsystem/react-headless` | `lily-design-system-react-next-examples` |
| Vue | `@lilydesignsystem/vue-headless` | `lily-design-system-vue-nuxt-examples` |
| Angular | `@lilydesignsystem/angular-headless` | `lily-design-system-angular-examples` |
| Blazor | `LilyDesignSystem.Blazor.Headless` (NuGet) | `lily-design-system-blazor-web-examples` |
| Nunjucks | `@lilydesignsystem/nunjucks-headless` | `lily-design-system-nunjucks-eleventy-examples` |

Headless libraries ship unstyled, accessible components; example apps demonstrate them with a full stylesheet and the three required routes (see [examples](../examples/index.md)).

An 8th headless library sits outside the pairs: `@lilydesignsystem/web-components-headless` (added 2026-09-03, reached its full achievable scope 2026-09-06) ships 536 of the 571 components as native custom elements with no framework runtime and no example app — the other 35 (30 table sub-elements and 5 interactive `*ListItem` families) are permanently excluded by a real architectural limitation, not open backlog. Its own `spec/index.md` records the architecture decisions (autonomous custom elements over customized built-ins, light-DOM-only) and the exact scope.

## Helper packages

Every framework's helpers are top-level subprojects, one per package (`lily-design-system-{framework}-{package}`), and carry the seven framework-specific `*-picker` helper packages — theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, search-picker and date-time-picker (56 packages in all) — plus `picker-bar`, which composes five of them, and the gantt-chart and kanban-board packages. Svelte's helpers add data-grid and calendar-view; Nunjucks' add the shared listbox-behavior package. See [helpers](../helpers/index.md).

Every framework's helpers are one top-level subproject per package instead of one catalog (Svelte first, the other seven the same day, 2026-10-10; see [helpers](../helpers/index.md#where-the-helpers-live)). For Svelte: `lily-design-system-svelte-data-grid` moved out of `lily-design-system-svelte-helpers` on 2026-10-09, the other fourteen on 2026-10-10, and the catalog was deleted ([list](../helpers/index.md#svelte-helper-packages)). Each has its own `package.json` devDependencies, `pnpm-lock.yaml`, vite/vitest config, `build.js` and `AGENTS/`; depends on `@lilydesignsystem/svelte-headless` and, for `picker-bar`, `gantt-chart` and `calendar-view`, on sibling packages, all resolved in local dev/test from their built `dist/`; is built in the order `bin/list-helper-packages svelte` prints; and is published by `bin/publish-helpers` and tested by the CI `helper-packages` job.

The root `themes/` directory ships 45 reference theme stylesheets (NHS England/Scotland/Wales patient and practitioner variants, GOV.UK GDS, USWDS, Adobe Spectrum, Mozilla Protocol, and general-purpose light/dark themes) that target the Lily class hooks and pair with the theme-select helper. See [theme](../theme/index.md).

## Source hosting

The monorepo is the only source repository. Until 2026-10-10 each subproject was also its own public `git subtree` repository; those mirrors were deleted, and only the docs site (`lilydesignsystem.github.io`, GitHub Pages) is still pushed to a repository of its own, by `make github-pages`. The monorepo's `origin` fans out to **three forges** — GitHub, Codeberg, and GitLab — under the `LilyDesignSystem` organisation:

```
origin  fetch: git@github.com:LilyDesignSystem/lily-design-system.git
origin  push : git@github.com:LilyDesignSystem/lily-design-system.git
origin  push : git@codeberg.org:LilyDesignSystem/lily-design-system.git
origin  push : git@gitlab.com:LilyDesignSystem/lily-design-system.git
```

Packages are published from this repository to npm and NuGet; see [trusted-publishing](../trusted-publishing/index.md) § Monorepo publishing.

## Required files per subproject

| File | Purpose |
| --- | --- |
| `index.md` | Human-readable overview |
| `README.md` | Symlink to `index.md` |
| `AGENTS.md` | AI coding help; loads modular `AGENTS/*.md` |
| `spec/index.md` | Spec-driven plan + tasks (replaces the older split `plan.md` / `tasks.md`) |

## Required files per component directory

Every `components/{slug}/` directory (571 of them) carries:

| File | Purpose |
| --- | --- |
| `index.md` | Component docs (description, usage, props, ARIA, keyboard, references, "When to Use" / "When Not to Use") |
| `README.md` | Symlink to `index.md` |
| `AGENTS.md` | Canonical metadata (HTML tag, ARIA, keyboard, props) |
| `spec/index.md` | Per-component spec-driven plan + tasks (replaces the older split `plan.md` / `tasks.md`) |

## Acceptance criteria

- [x] All 7 headless and 7 example subprojects exist at the documented paths.
- [x] `@lilydesignsystem/web-components-headless` exists at the documented path and its `spec/index.md` states its final (2026-09-06: 456/491; 536/571 as of 2026-10-06 — the full achievable scope) accounting.
- [x] Helper packages exist for all eight frameworks, one top-level subproject each (107 in all; the per-framework catalogs were dissolved into them 2026-10-10).
- [x] All 571 component directories carry the required component files (`index.md`, `README.md` symlink, `AGENTS.md`, `spec/index.md`; `CLAUDE.md` was retired 2026-09-19).
- [x] Every subproject carries `index.md`, `README.md` symlink, `AGENTS.md`, and spec/plan/tasks.
- [x] `AGENTS.md` / `AGENTS/*.md` are canonical at the root and rsynced (not symlinked) into subprojects.
- [x] Retired 2026-10-10: subprojects are no longer pushed to standalone repositories; the mirrors were deleted and `bin/git-subtree-push` removed. Only the docs site is still a subtree, pushed by `make github-pages`.
- [x] The monorepo's `origin` fans out to GitHub, Codeberg, and GitLab on push. (Per-subproject remotes and their partial fan-out were retired with the subtree mirrors, 2026-10-10.)
- [x] `bin/test` passes against the repository, all components, and all subprojects.

## Related topics

- [overview](../overview/index.md) — vision, layers, scope, key facts
- [tooling](../tooling/index.md) — listing, scaffolding, sync, test, subtree-push scripts
- [components](../components/index.md) — the canonical catalog and naming conventions
- [helpers](../helpers/index.md) — the helper packages, one top-level subproject each
- [frameworks](../frameworks/index.md) — per-framework implementation notes
- [testing](../testing/index.md) — `bin/test` and per-framework test suites
- [monorepo-github-pages](../monorepo-github-pages/index.md) — the docs
  site's platform-dictated export name and local sibling clone

## Sources

- [spec/index.md](../index.md) — §3 Architecture, §9 Tooling, §14 Tracking
- [AGENTS.md](../../AGENTS.md)
- [AGENTS/lily.md](../../AGENTS/lily.md)

---

Lily™ and Lily Design System™ are trademarks.
