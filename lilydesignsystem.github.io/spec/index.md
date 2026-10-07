# lilydesignsystem.github.io — Specification

Living specification for the Lily Design System™ public marketing/docs site.
This file is the single source of truth for spec-driven development of this
subproject: what the site is, what it contains, where its content comes
from, and what "correct" means for it. It supersedes any prior informal
notes; there is no separate `plan.md` / `tasks.md` for this subproject.

This spec is scoped to the **site**. The design system itself — the
571-component catalog, the seven headless libraries, the seven
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
  component (571, matching [`components.tsv`](https://github.com/LilyDesignSystem/lily-design-system/blob/main/components.tsv)
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
  (all eight pickers — theme, locale, text-size, motion, share, search,
  date-time — plus `picker-bar`, the tooltips, and a combined settings panel).
- The home page's framework icon row includes an 8th icon, Web
  Components, which links directly to its GitHub repo rather than a
  `/tutorials/` page — there is no Web Components tutorial or example
  app yet, unlike the other seven frameworks.
- The global header, rendered once from `+layout.svelte` on every page
  via `src/lib/components/SitePreferences.svelte`: the live `picker-bar`
  (search, theme, locale, text-size and share pickers), using the real
  published npm packages (not copied source).
- Agent-facing project docs specific to this site (this file, `AGENTS.md`,
  `index.md`), Playwright end-to-end tests, and the site's own
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
│       ├── skills/, lily-claude-design/, lily-figma/
│       ├── components/
│       │   ├── +page.svelte                Catalog index (search + filter)
│       │   └── <slug>/+page.svelte         One route per component (571)
│       └── tutorials/
│           ├── +page.svelte                Tutorials index
│           ├── angular/, blazor/, html/, nunjucks/, react/, svelte/, vue/
│           ├── theming/                    Cross-cutting: theme-picker
│           └── helpers/                    Cross-cutting: all eight pickers + picker-bar
├── static/
│   ├── CNAME                 Custom domain (lilydesignsystem.com)
│   ├── .nojekyll             Disables Jekyll on GitHub Pages
│   └── assets/                style.css, favicon.svg, images/, themes/
│                              (45 theme CSS files, manually copied — see
│                              static/assets/themes/README.md)
├── tests/components/         Playwright specs, one file per component
├── .github/workflows/deploy.yml  CI: build + deploy on push to main
├── vite.config.ts            sveltekit() plugin + adapter-static config (strict prerender)
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
  rather than wrapping or shrinking illegibly. This is about the header
  row's own layout, not about content a picker opens: a clicked picker's
  listbox/disclosure is expected to descend below the header (it already
  does — each helper package's own `{helper}-list` is positioned
  absolute, out of the row's normal flow) and is not a second header row.
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
  `@lilydesignsystem/svelte-headless`.

Some `<slug>/spec/index.md` files exist too, copied read-only from the
canonical per-component spec. See
[`src/routes/components/AGENTS.md`](../src/routes/components/AGENTS.md)
for the full convention.

Two main-repo generators now keep these pages in step with the catalog:
`bin/generate-site-pages` rebuilds any page that is still the
`bin/new-component` placeholder from `components/{slug}/index.md`
(rendered with the site's own `marked`, raw HTML escaped), refreshes the
**Example** section on every page (live demo, rendered variants, real usage
example — all from the canonical demo map and `bin/generate-examples`) and
writes any missing `tests/components/{slug}.spec.ts`; `bin/generate-api-docs`
refreshes each page's canonical-contract section. Hand-ported prose outside
those regions is still hand-maintained. `static/sitemap.xml` is generated by
`bin/generate-sitemap` (one URL per route), and `bin/sync` copies the 45
reference themes into `static/assets/themes/`.

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
(571 rows: slug, PascalCase name, one-line description), and the generator
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

- **No dedicated `/helpers/` section.** The pickers are taught in
  `/tutorials/helpers/` and live in the header (`picker-bar`), but none has a
  per-helper demo route analogous to `/components/<slug>/`. Building one is a
  product decision for whoever owns this site's roadmap.
- **Hand-ported prose can still drift.** Page prose outside the generated
  regions was ported from the canonical `index.md` by hand (or by
  `bin/generate-site-pages` at the time the page was rebuilt); there is no
  drift check on it. `bin/test` only checks that the files exist.

## 8. Acceptance criteria

- [x] Every one of the 571 catalog components has a
      `src/routes/components/{slug}/+page.svelte` (enforced by `bin/test`).
- [x] `src/lib/components.ts` entry count matches `components.tsv` row
      count (enforced by `bin/test`).
- [x] No page uses a pre-rename (`*-select` / `*-button`) name for a
      helper package, class hook, or import path.
- [x] `/examples/` lists all seven example apps; `/tutorials/helpers/`
      covers all eight pickers and `picker-bar`.
- [x] The picker bar renders live in the global
      header (`SitePreferences.svelte`), using the real published npm
      packages — verified 2026-09-06.
- [x] This subproject has `AGENTS.md` and a non-empty
      `spec/index.md`, matching the convention every other subproject in
      the monorepo follows.
- [x] Playwright spec coverage across all 571 components (`tests/components/`, written by
      `bin/generate-site-pages`); 2,855 specs passing, 0 failing, 2026-10-06 (the 166 generated specs were first written with a broken title pattern and an H1 check the docs-style pages could not meet; fixed the same day).
- [x] A full axe sweep of 575 pages (WCAG 2.0–2.2 A/AA) reports 0 violations (2026-10-06).
- [x] Theme-CSS links (`/help/`, `/tutorials/theming/`) resolve on the
      deployed site — corrected to `/assets/themes/*.css`, matching
      `static/assets/themes/` and `SitePreferences.svelte`'s own
      `themesUrl` (§7). Verified 2026-09-06.
- [ ] `motion-picker` is documented on `/tutorials/helpers/` (§7).

## 9. Related topics (main repo spec)

- [architecture](../../spec/architecture/index.md) — the monorepo layout
  and required files per subproject, which this file satisfies.
- [components](../../spec/components/index.md) — the 571-component
  catalog this site presents.
- [helpers](../../spec/helpers/index.md) — the `*-helpers` packages (eight pickers and `picker-bar`);
  three are live in this site's header, three remain prose-only (§7).
- [tooling](../../spec/tooling/index.md) — `bin/generate-registries` and
  `bin/test`'s checks against this subproject.
- [citations](../../spec/citations/index.md) — the design systems Lily
  learns from, referenced from `/comparisons/` and `/why/`.

## 10. Sources

- [`index.md`](../index.md) — human-readable project overview, develop/deploy
  instructions.
- [`AGENTS.md`](../AGENTS.md) — AI-agent pointer to this file.
- [`package.json`](../package.json), [`vite.config.ts`](../vite.config.ts),
  [`playwright.config.ts`](../playwright.config.ts).
- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) — CI
  build + deploy.
