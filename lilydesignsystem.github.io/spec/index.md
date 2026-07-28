# lilydesignsystem.github.io — Specification

Living specification for the Lily Design System™ public marketing/docs site.
This file is the single source of truth for spec-driven development of this
subproject: what the site is, what it contains, where its content comes
from, and what "correct" means for it. It supersedes any prior informal
notes; there is no separate `plan.md` / `tasks.md` for this subproject.

This spec is scoped to the **site**. The design system itself — the
491-component catalog, the seven headless libraries, the seven
`*-helpers` catalogs, and the seven example apps — is specified one level
up, in the main repo's [`spec/index.md`](../../spec/index.md) and
[`AGENTS/*.md`](../../AGENTS/). This file links to those rather than
duplicating them.

## 1. Summary

`lilydesignsystem.github.io` is a SvelteKit project built with
`@sveltejs/adapter-static`, fully prerendered, and deployed by GitHub
Actions to `https://lilydesignsystem.com/` (with a fallback on
`https://lilydesignsystem.github.io/`). It is the public front door to the
Lily Design System™: it presents the full component catalog as browsable
web pages, explains why and how to adopt Lily, and teaches the seven
framework stacks through tutorials.

## 2. Scope

### In scope

- A component catalog browser at `/components/` — one route per catalog
  component (491, matching [`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv)
  at the repo root), each rendering that component's documentation, a
  static demo snippet, and a short Svelte usage example.
- Marketing and orientation pages: `/` (home), `/why/`, `/about/`,
  `/comparisons/` (a table against other design systems), `/help/`
  (setup guide, theme reference, preference-helpers reference, FAQ).
- `/examples/` — a directory of the seven worked example apps (HTML+CSS+JS,
  Svelte+SvelteKit, React+Next.js, Vue+Nuxt.js, Angular+Analog, Blazor Web,
  Nunjucks+Eleventy), each linking out to its own GitHub repo.
- `/tutorials/` — a tutorials index plus one page per framework
  (`angular`, `blazor`, `html`, `nunjucks`, `react`, `svelte`, `vue`) and
  two cross-cutting tutorials: `theming` (linking a ready-made theme,
  overriding it, and runtime switching with theme-picker) and `helpers`
  (the preference/action/form-value helpers: theme-picker, locale-picker,
  text-size-picker, share-picker, date-time-picker).
- Agent-facing project docs specific to this site (this file, `AGENTS.md`,
  `CLAUDE.md`, `index.md`), Playwright end-to-end tests, and the site's own
  `package.json` / SvelteKit config.

### Explicitly out of scope

- Implementing or hosting any headless component library — the site
  documents and links to the canonical implementations, it does not ship
  its own component code.
- Authoring canonical component documentation from scratch — component
  prose is ported from the main repo's `components/{slug}/index.md`, not
  invented here (see [§5](#5-content-model)).
- The `*-helpers` catalogs' actual source, tests, and publish pipeline —
  those live in the seven `lily-design-system-*-helpers` subprojects; this
  site currently only documents them in prose (see [§7](#7-known-gaps)).
- Anything under `lily-design-system-*` subproject directories, the
  monorepo root `bin/`, or the monorepo root `spec/` / `AGENTS/` — owned
  elsewhere.

## 3. Architecture

```
lilydesignsystem.github.io/
├── src/
│   ├── app.html              SvelteKit document shell
│   ├── lib/components.ts     Component catalog (generated — see §6)
│   └── routes/
│       ├── +page.svelte                    Home
│       ├── about/, why/, help/, comparisons/, examples/
│       ├── lily-claude-code/, lily-claude-design/, lily-figma/
│       ├── components/
│       │   ├── +page.svelte                Catalog index (search + filter)
│       │   └── <slug>/+page.svelte         One route per component (491)
│       └── tutorials/
│           ├── +page.svelte                Tutorials index
│           ├── angular/, blazor/, html/, nunjucks/, react/, svelte/, vue/
│           ├── theming/                    Cross-cutting: theme-picker
│           └── helpers/                    Cross-cutting: the five helpers
├── static/
│   ├── CNAME                 Custom domain (lilydesignsystem.com)
│   ├── .nojekyll             Disables Jekyll on GitHub Pages
│   └── assets/                style.css, favicon.svg, images/
├── tests/components/         Playwright specs, one file per component
├── .github/workflows/deploy.yml  CI: build + deploy on push to main
├── svelte.config.js          adapter-static config (strict prerender)
└── package.json
```

Like every other subproject in the monorepo, this directory is also a
`git subtree`, pushed to its own standalone remote
(`LilyDesignSystem/lilydesignsystem.github.io`) via `bin/git-subtree-push`
at the repo root.

## 4. Design principles

- **Presents, does not implement.** Every component page links back to the
  canonical catalog; the site never forks component behaviour.
- **Prerendered, no runtime data dependency.** `adapter-static` with
  `strict: true` — a build fails if a route can't be prerendered — so the
  deployed site has no server and no client-side fetch of catalog data.
  `src/lib/components.ts` is a static, generated array, not an API call.
- **Current, not historical.** Naming, counts, and code samples on the
  site must match the *current* state of the canonical catalog and helper
  packages, not whatever was true when a page was written. A rename
  upstream (e.g. the 2026-07-28 `*-select`/`*-button` → `*-picker` helper
  rename) is a defect in this site's content until every prose mention,
  class hook, and import path is updated to match.
- **One tutorial page per framework, two cross-cutting.** `/tutorials/`
  mirrors the seven framework pairs 1:1, plus `theming` and `helpers` which
  apply to all seven.

## 5. Content model

### 5.1 Component routes (`/components/<slug>/`)

Each `<slug>/+page.svelte` embeds three string constants, rendered via
`{@html …}`:

- `html` — full documentation ported from the canonical
  `components/{slug}/index.md` in the main repo: description, props,
  usage, keyboard interactions, ARIA, when to use / not to use, styles,
  testing notes, related components, references.
- `demoHtml` — a small static markup snippet (inside
  `BEGIN/END auto-generated component example` markers).
- `svelteSource` — a short import + usage snippet against
  `lily-design-system-svelte-headless`.

Some `<slug>/spec/index.md` files exist too, copied read-only from the
canonical per-component spec. See
[`src/routes/components/AGENTS.md`](../src/routes/components/AGENTS.md)
for the full convention.

There is currently **no generator** that produces these 491 pages from
`components.tsv` — unlike `src/lib/components.ts` (§6), they are
hand-authored and hand-maintained. Adding a generator is a main-repo
`bin/` tooling decision, out of scope for this site alone.

### 5.2 Tutorials and examples

`/tutorials/*` and `/examples/` are this site's main teaching surface —
they need to be accurate and complete, not just present. `/examples/`
must list all seven example apps (HTML+CSS+JS, Svelte, React, Vue,
Angular, Blazor, Nunjucks); `/tutorials/helpers/` must cover all five
current helpers, not just the three that existed before `share-picker`
and `date-time-picker` shipped.

## 6. The component catalog (`src/lib/components.ts`)

`src/lib/components.ts` is **generated**, not hand-edited. Its single
source of truth is the main repo's
[`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv)
(491 rows: slug, PascalCase name, one-line description), and the generator
is the main repo's own [`bin/generate-registries`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/bin/generate-registries)
— it writes this file as one of several registries it keeps in sync
(alongside the Svelte/React/Vue/Angular example-app registries). Regenerate
with:

```sh
cd ~/git/lilydesignsystem/lily-design-system
node bin/generate-registries
```

The repo root's `bin/test` enforces this: `registry_count_or_err` asserts
`components.ts`'s `name: "` entry count equals the catalog's row count, and
`test_lilydesignsystem_github_io` asserts every catalog component has a
`src/routes/components/{slug}/+page.svelte` here (see
[tooling](../../spec/tooling/index.md) in the main spec).

## 7. Known gaps (flagged, not built)

- **No page coverage for the `*-helpers` catalogs beyond prose.** Unlike
  the 491-component headless catalog, theme-picker, locale-picker,
  text-size-picker, share-picker, and date-time-picker have no dedicated
  demo/reference routes analogous to `/components/<slug>/` — only prose
  mentions on `/help/`, `/tutorials/theming/`, and `/tutorials/helpers/`.
  Building a `/helpers/` section with live demo pages (mirroring the
  `/components/` pattern) is a product decision for whoever owns this
  site's roadmap, not an audit/harmonization task.
- **Playwright coverage is partial.** `tests/components/` has one spec per
  component for 405 of the 491 catalog components as of this writing;
  filling the remaining gap is routine but unstarted work.
- **No generator for the 491 component route pages** (§5.1) — the risk
  this creates is drift between a page's ported prose and the canonical
  `index.md` it was ported from, silently, with no drift check. `bin/test`
  only checks that the directory and file exist, not that the content is
  current.
- **`/themes/*.css` links may not resolve on the deployed site.** Several
  pages (`/tutorials/theming/`, `/help/#themes`) link or show code samples
  referencing `/themes/<name>.css`, implying the main repo's 45
  `themes/*.css` reference stylesheets are served from this site's own
  `static/`. As of this writing there is no `static/themes/` directory and
  no build step (locally or in `.github/workflows/deploy.yml`) that
  populates one from the main repo's `themes/`. Confirm whether this is
  intentional (the samples are illustrative, and a real adopter is
  expected to copy the files into their own app, not fetch them from this
  site) or a genuine gap that needs a themes-sync step added to the build;
  this is a build-pipeline decision, not a content fix.

## 8. Acceptance criteria

- [x] Every one of the 491 catalog components has a
      `src/routes/components/{slug}/+page.svelte` (enforced by `bin/test`).
- [x] `src/lib/components.ts` entry count matches `components.tsv` row
      count (enforced by `bin/test`).
- [x] No page uses a pre-rename (`*-select` / `*-button`) name for a
      helper package, class hook, or import path.
- [x] `/examples/` lists all seven example apps; `/tutorials/helpers/`
      covers all five current helpers.
- [x] This subproject has `AGENTS.md`, `CLAUDE.md`, and a non-empty
      `spec/index.md`, matching the convention every other subproject in
      the monorepo follows.
- [ ] Full Playwright spec coverage across all 491 components (§7).
- [ ] `/themes/*.css` links resolve on the deployed site, or are
      rephrased so they don't imply they do (§7).

## 9. Related topics (main repo spec)

- [architecture](../../spec/architecture/index.md) — the monorepo layout
  and required files per subproject, which this file satisfies.
- [components](../../spec/components/index.md) — the 491-component
  catalog this site presents.
- [helpers](../../spec/helpers/index.md) — the five `*-helpers` packages
  this site currently only documents in prose (§7).
- [tooling](../../spec/tooling/index.md) — `bin/generate-registries` and
  `bin/test`'s checks against this subproject.
- [citations](../../spec/citations/index.md) — the design systems Lily
  learns from, referenced from `/comparisons/` and `/why/`.

## 10. Sources

- [`index.md`](../index.md) — human-readable project overview, develop/deploy
  instructions.
- [`AGENTS.md`](../AGENTS.md) — AI-agent pointer to this file.
- [`package.json`](../package.json), [`svelte.config.js`](../svelte.config.js),
  [`playwright.config.ts`](../playwright.config.ts).
- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) — CI
  build + deploy.
