# Architecture

> Lily Design System specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Lily is a monorepo holding a canonical 492-component catalog plus 14 implementation subprojects (7 headless libraries + 7 example apps) and 7 per-framework helper catalogs, where every subproject is also a `git subtree` that pushes to its own standalone remote.

## Scope

This topic covers the monorepo directory layout, the 14 implementation subprojects and 7 helper catalogs, the git-subtree publishing model and multi-forge remote fan-out, and the required files per subproject and per component directory.

It does not cover the vision or scope split (see [overview](../overview/index.md)), the catalog contents and naming (see [components](../components/index.md)), or the listing/scaffold/sync/test scripts in detail (see [tooling](../tooling/index.md)).

## Principles and rules

- The repository root holds the **canonical catalog and tools**; subprojects hold framework-specific implementations.
- `AGENTS.md` and `AGENTS/*.md` at the repo root are **canonical**; `bin/sync` rsyncs them into each subproject (rsync, not symlinks — `git subtree push` does not follow symlinks across project boundaries).
- Every subproject is a **`git subtree`** so it can be pushed to its own standalone remote via `bin/git-subtree-push`.
- Every subproject and every component directory must carry the **required files** below; `bin/test` verifies their presence.
- `README.md` is always a **symlink to `index.md`**; `CLAUDE.md` loads `AGENTS.md`.

## Monorepo directory layout

```
lily-design-system/                              ← canonical catalog + tools
├── AGENTS.md, AGENTS/*.md                       ← modular reference docs
├── components.tsv                               ← canonical 492-component list
├── components/{slug}/                           ← per-component docs (492 dirs)
├── css-style-sheet-template.css                 ← class-hook stylesheet template
├── bin/                                         ← scaffolding, listing, sync, test
├── spec.md, spec/{topic}/index.md               ← spec + modular topic docs
├── lily-design-system-html-headless/            ← headless: HTML
├── lily-design-system-svelte-headless/          ← headless: Svelte 5
├── lily-design-system-react-headless/           ← headless: React
├── lily-design-system-vue-headless/             ← headless: Vue 3
├── lily-design-system-angular-headless/         ← headless: Angular 20
├── lily-design-system-blazor-headless/          ← headless: Blazor
├── lily-design-system-nunjucks-headless/        ← headless: Nunjucks
├── lily-design-system-html-css-js-examples/     ← examples: vanilla HTML+CSS+JS
├── lily-design-system-svelte-sveltekit-examples/ ← examples: SvelteKit 2
├── lily-design-system-react-next-examples/      ← examples: Next.js
├── lily-design-system-vue-nuxt-examples/        ← examples: Nuxt.js
├── lily-design-system-angular-examples/         ← examples: Angular 20 + Analog.js
├── lily-design-system-blazor-web-examples/      ← examples: Blazor Web
├── lily-design-system-nunjucks-eleventy-examples/ ← examples: Nunjucks + Eleventy
└── lily-design-system-{framework}-helpers/      ← 7 per-framework helper catalogs
```

## The 14 implementation subprojects

| Framework | Headless library | Example app |
| --- | --- | --- |
| HTML | `lily-design-system-html-headless` | `lily-design-system-html-css-js-examples` |
| Svelte | `lily-design-system-svelte-headless` | `lily-design-system-svelte-sveltekit-examples` |
| React | `lily-design-system-react-headless` | `lily-design-system-react-next-examples` |
| Vue | `lily-design-system-vue-headless` | `lily-design-system-vue-nuxt-examples` |
| Angular | `lily-design-system-angular-headless` | `lily-design-system-angular-examples` |
| Blazor | `lily-design-system-blazor-headless` | `lily-design-system-blazor-web-examples` |
| Nunjucks | `lily-design-system-nunjucks-headless` | `lily-design-system-nunjucks-eleventy-examples` |

Headless libraries ship unstyled, accessible components; example apps demonstrate them with a full stylesheet and the three required routes (see [examples](../examples/index.md)).

## Helper catalogs

Seven per-framework helper subprojects (`lily-design-system-{framework}-helpers`, one each for html, svelte, react, vue, angular, blazor, nunjucks) carry framework-specific helper packages (for example theme-select and locale-select). Like the implementation subprojects, each helper catalog is its own git subtree with its own standalone remotes. See [helpers](../helpers/index.md).

## Git subtree publishing model

Each subproject is maintained as a `git subtree` of this monorepo and published to its own standalone repository via `bin/git-subtree-push`. The monorepo's own `origin` and each subproject's subtree remote fan out to **three forges** — GitHub, Codeberg, and GitLab — under the `LilyDesignSystem` organisation:

```
origin  fetch: git@github.com:LilyDesignSystem/lily-design-system.git
origin  push : git@github.com:LilyDesignSystem/lily-design-system.git
origin  push : git@codeberg.org:LilyDesignSystem/lily-design-system.git
origin  push : git@gitlab.com:LilyDesignSystem/lily-design-system.git
```

The same one-fetch / three-push pattern applies to every subproject remote (e.g. `lily-design-system-react-headless`). Subtree remote configuration for each subproject lives in its `.git-subtree-push` file.

## Required files per subproject

| File | Purpose |
| --- | --- |
| `index.md` | Human-readable overview |
| `README.md` | Symlink to `index.md` |
| `AGENTS.md` | AI coding help; loads modular `AGENTS/*.md` |
| `CLAUDE.md` | Loads `AGENTS.md` |
| `spec.md` / `plan.md` + `tasks.md` | Spec-driven plan and task list |
| `.git-subtree-push` | Subtree remote configuration |

## Required files per component directory

Every `components/{slug}/` directory (492 of them) carries:

| File | Purpose |
| --- | --- |
| `index.md` | Component docs (description, usage, props, ARIA, keyboard, references, "When to Use" / "When Not to Use") |
| `README.md` | Symlink to `index.md` |
| `AGENTS.md` | Canonical metadata (HTML tag, ARIA, keyboard, props) |
| `CLAUDE.md` | Loads `AGENTS.md` |
| `spec.md` / `plan.md` + `tasks.md` | Per-component plan and task list |

## Acceptance criteria

- [ ] All 7 headless and 7 example subprojects exist at the documented paths.
- [ ] All 7 per-framework helper catalogs exist.
- [ ] All 492 component directories carry the required component files.
- [ ] Every subproject carries `index.md`, `README.md` symlink, `AGENTS.md`, `CLAUDE.md`, spec/plan/tasks, and `.git-subtree-push`.
- [ ] `AGENTS.md` / `AGENTS/*.md` are canonical at the root and rsynced (not symlinked) into subprojects.
- [ ] Each subproject is a git subtree pushable to its own standalone remote via `bin/git-subtree-push`.
- [ ] Each subproject remote fans out to GitHub, Codeberg, and GitLab on push.
- [ ] `bin/test` passes against the repository, all components, and all subprojects.

## Related topics

- [overview](../overview/index.md) — vision, layers, scope, key facts
- [tooling](../tooling/index.md) — listing, scaffolding, sync, test, subtree-push scripts
- [components](../components/index.md) — the canonical catalog and naming conventions
- [helpers](../helpers/index.md) — per-framework helper catalogs
- [frameworks](../frameworks/index.md) — per-framework implementation notes
- [testing](../testing/index.md) — `bin/test` and per-framework test suites

## Sources

- [spec.md](../../spec.md) — §3 Architecture, §9 Tooling, §14 Tracking
- [AGENTS.md](../../AGENTS.md)
- [AGENTS/lily.md](../../AGENTS/lily.md)
