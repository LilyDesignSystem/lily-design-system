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
`https://lilydesignsystem.com/`). It is the public front door to the
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
  (setup guide, theme reference, preference-helpers reference, FAQ),
  `/accessibility/` (accessibility statement), `/news/` (announcements,
  rendered from the main repo's `NEWS.md`), `/roadmap/` (rendered from
  `plan.md`).
- `/examples/` — a directory of the seven worked example apps (HTML+CSS+JS,
  Svelte+SvelteKit, React+Next.js, Vue+Nuxt.js, Angular+Analog, Blazor Web,
  Nunjucks+Eleventy), each linking out to its own GitHub repo.
- `/tutorials/` — a tutorials index plus one page per framework
  (`angular`, `blazor`, `html`, `nunjucks`, `react`, `svelte`, `vue`) and
  two cross-cutting tutorials: `theming` (linking a ready-made theme,
  overriding it, and runtime switching with theme-picker) and `helpers`
  (five of the six preference/action/form-value helpers: theme-picker,
  locale-picker, text-size-picker, share-picker, date-time-picker —
  `motion-picker` is not yet covered here; see §7).
- The home page's framework icon row includes an 8th icon, Web
  Components, which links directly to its GitHub repo rather than a
  `/tutorials/` page — there is no Web Components tutorial or example
  app yet, unlike the other seven frameworks.
- The global header, rendered once from `+layout.svelte` on every page
  via `src/lib/components/SitePreferences.svelte`: live `theme-picker`,
  `text-size-picker`, and `share-picker` widgets, using the real
  published npm packages (not copied source).
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
│   ├── lib/
│   │   ├── components.ts             Component catalog (generated — see §6)
│   │   ├── components/SitePreferences.svelte
│   │   │                            Theme/text-size/share pickers, rendered
│   │   │                            site-wide from +layout.svelte's header
│   │   └── content/NEWS.md, plan.md  Local copies rendered by /news, /roadmap
│   └── routes/
│       ├── +page.svelte                    Home: framework icon row (incl.
│       │                                   Web Components, external-link-only),
│       │                                   its own component search box
│       ├── about/, why/, help/, comparisons/, examples/
│       ├── accessibility/, news/, roadmap/
│       ├── lily-claude-code/, lily-claude-design/, lily-figma/
│       ├── components/
│       │   ├── +page.svelte                Catalog index (search + filter)
│       │   └── <slug>/+page.svelte         One route per component (491)
│       └── tutorials/
│           ├── +page.svelte                Tutorials index
│           ├── angular/, blazor/, html/, nunjucks/, react/, svelte/, vue/
│           ├── theming/                    Cross-cutting: theme-picker
│           └── helpers/                    Cross-cutting: all six helpers
├── static/
│   ├── CNAME                 Custom domain (lilydesignsystem.com)
│   ├── .nojekyll             Disables Jekyll on GitHub Pages
│   └── assets/                style.css, favicon.svg, images/, themes/
│                              (45 theme CSS files, manually copied — see
│                              static/assets/themes/README.md)
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
- **The header is one row, never more.** The brand mark and title, the top
  nav links, and the three preference pickers (`SitePreferences.svelte`)
  all stay on a single line at every viewport width — no wrapping onto a
  second row. A narrow viewport makes the nav horizontally scrollable
  rather than wrapping or shrinking illegibly.
- **No eyebrows.** A small uppercase/muted label sitting above a heading
  purely for visual rhythm (e.g. "The idea", "Quick start", "Why headless?")
  is not part of this site's own design — a heading stands on its own.
  Removed 2026-09-07 (maintainer decision) from every page-intro banner and
  every in-page section heading. This is about this site's own chrome, not
  the canonical catalog: the real `SectionHeading`, `Headline`, and
  `BodyText` components document a genuine `eyebrow` slot/prop as part of
  their own contract, and those component pages' documentation and demos
  are untouched by this rule.

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

- **`motion-picker` isn't covered anywhere on this site.** Added to the
  main repo 2026-09-03, it's absent from `/tutorials/helpers/` (which
  still only teaches locale-picker, text-size-picker, share-picker, and
  date-time-picker), `/help/`, and the header. Adding it is a content
  gap, not a build-pipeline one.
- **No page coverage for most of the `*-helpers` catalog beyond prose.**
  Three of the six — `theme-picker`, `text-size-picker`, and
  `share-picker` — are no longer prose-only: they're live, working UI in
  the global header (`src/lib/components/SitePreferences.svelte`,
  rendered from `+layout.svelte` on every page), using the real
  published npm packages. `locale-picker`, `motion-picker`, and
  `date-time-picker` remain prose-only, with no live integration
  anywhere on the site, and none of the six has a dedicated
  demo/reference route analogous to `/components/<slug>/`. Building a
  `/helpers/` section with live demo pages for all six (mirroring the
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
- **Resolved 2026-09-06: the theme paths now agree.** `static/assets/themes/`
  holds a real, working copy of all 45 theme CSS files — copied in
  manually (`cp themes/*.css lilydesignsystem.github.io/static/assets/themes/`,
  documented in that directory's own `README.md`; no automated sync step
  exists yet, so a future theme added to the main repo's `themes/` won't
  reach this copy without someone re-running that command) — and
  `SitePreferences.svelte` already pointed `ThemePicker` at the correct
  `themesUrl="/assets/themes/"`. The `/help/` and `/tutorials/theming/`
  code samples had drifted to the older, nonexistent `/themes/<name>.css`
  path; corrected to match. The remaining, still-open gap is only the
  lack of an automated sync step for future theme additions.

## 8. Acceptance criteria

- [x] Every one of the 491 catalog components has a
      `src/routes/components/{slug}/+page.svelte` (enforced by `bin/test`).
- [x] `src/lib/components.ts` entry count matches `components.tsv` row
      count (enforced by `bin/test`).
- [x] No page uses a pre-rename (`*-select` / `*-button`) name for a
      helper package, class hook, or import path.
- [x] `/examples/` lists all seven example apps; `/tutorials/helpers/`
      covers five of the six current helpers (`motion-picker` is not
      yet covered — §7).
- [x] Theme, text-size, and share pickers render live in the global
      header (`SitePreferences.svelte`), using the real published npm
      packages — verified 2026-09-06.
- [x] This subproject has `AGENTS.md`, `CLAUDE.md`, and a non-empty
      `spec/index.md`, matching the convention every other subproject in
      the monorepo follows.
- [ ] Full Playwright spec coverage across all 491 components (§7).
- [x] Theme-CSS links (`/help/`, `/tutorials/theming/`) resolve on the
      deployed site — corrected to `/assets/themes/*.css`, matching
      `static/assets/themes/` and `SitePreferences.svelte`'s own
      `themesUrl` (§7). Verified 2026-09-06.
- [ ] `motion-picker` is documented on `/tutorials/helpers/` (§7).

## 9. Related topics (main repo spec)

- [architecture](../../spec/architecture/index.md) — the monorepo layout
  and required files per subproject, which this file satisfies.
- [components](../../spec/components/index.md) — the 491-component
  catalog this site presents.
- [helpers](../../spec/helpers/index.md) — the six `*-helpers` packages;
  three are live in this site's header, three remain prose-only (§7).
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
