# Lily Design System — Specification

Living, comprehensive specification for the Lily Design System. The `spec/`
directory is the single source of truth for spec-driven development: this
file (`spec/index.md`) is the entry point, and one `spec/{topic}/index.md`
per topic deepens each area. It supersedes the prior single-file `spec.md`
and the older `plan.md` / `tasks.md` split, and consolidates: goal, scope,
architecture, design principles, component catalog, naming conventions,
composition patterns, documentation requirements, acceptance criteria,
status, and roadmap.

Conventions used in this document:

- "Component" = one entry in the canonical catalog (`components.tsv`).
- "Slug" = kebab-case identifier (e.g., `breadcrumb-list-item`).
- "Name" = PascalCase identifier (e.g., `BreadcrumbListItem`).
- "Headless subproject" = a framework library shipping unstyled, accessible components.
- "Example subproject" = a framework app demonstrating components with full styling.
- "Consumer" = the application or library that depends on a Lily headless package.

The companion AGENTS files (`AGENTS.md`, `AGENTS/*.md`) are the modular reference docs
that AI coding agents and humans should read; this spec links to and binds together
those references rather than duplicating them in full.

## Topics

Each topic below is a standalone deep-dive that reorganises and expands this
file's contents into focused, cross-linked references for humans and AI
coding agents.

| Topic | What it covers |
| ----- | -------------- |
| [overview](overview/index.md) | Vision, scope, the headless vs. example layers, key facts. |
| [architecture](architecture/index.md) | Monorepo layout, the 14 implementation subprojects + 7 helper catalogs, `themes/`, the git-subtree model, required files. |
| [headless](headless/index.md) | Headless design rules: semantic markup, class hooks, rest-props, behaviour boundaries, zero CSS. |
| [accessibility](accessibility/index.md) | WCAG 2.2 AAA target, WAI-ARIA APG patterns, ARIA reference table, axe-core baselines. |
| [internationalization](internationalization/index.md) | No hardcoded strings, stable text-prop names, locale-aware props, RTL/bidi. |
| [theme](theme/index.md) | Token shape, `--theme-*` custom properties, `data-theme` variants, the headless forbidden-list. |
| [components](components/index.md) | The 490-component catalog, suffix→element mapping, name patterns, composition, per-component docs. |
| [examples](examples/index.md) | Example apps, the three required routes, NHS reference styling, demo render mechanisms. |
| [tooling](tooling/index.md) | The `bin/` scripts, the rsync sync model, `bin/test` verification, subtree push. |
| [testing](testing/index.md) | Per-framework test suites, Storybook coverage, Playwright e2e, axe, responsive sweep. |
| [frameworks](frameworks/index.md) | The seven framework pairs, per-framework file shapes and idioms, the copy-pattern. |
| [helpers](helpers/index.md) | The `*-helpers` catalogs — theme-select, locale-select, text-size-select — their `<select>` contracts, manifests, and publish pipeline. |
| [national-identifiers](national-identifiers/index.md) | The 80 national personal identifier components, normalization, validation algorithms. |
| [citations](citations/index.md) | Design systems Lily learns from, the NHS UK reference, Reuters Graphics influence. |

### How the topic docs are organised

Every topic doc follows the same shape:

- **Summary** — one or two sentences.
- **Scope** — what the topic covers and what it explicitly excludes.
- **Principles and rules** — the binding rules, grounded in canonical sources.
- **Detail sections** — tables, mappings, patterns, and short examples.
- **Acceptance criteria** — a checklist of what "correct/done" means.
- **Related topics** — cross-links to sibling topics.
- **Sources** — repo-relative links to the canonical files behind the topic.

---

## 1. Vision

Lily is a free, open-source design system that any team can adopt, fork, theme, or
extend. The headless layer ships semantic HTML, ARIA, focus management, and keyboard
behaviour with zero visual decisions. The example layer ships complete, styled
reference applications so adopters can see the system working end-to-end before
committing.

- **Accessible by default**: WCAG 2.2 AAA target, WAI-ARIA Authoring Practices 1.2.
- **Composable**: small components snap together into navigation, table, form, layout
  patterns.
- **Internationalisable**: every user-facing string is supplied by the consumer.
- **Framework-plural**: same catalog implemented across HTML, Svelte, React, Vue,
  Blazor, and Nunjucks.
- **CSS-strategy-agnostic**: works with semantic CSS, utility CSS (Tailwind), or
  no CSS at all.

## 2. Scope

### In scope

- A canonical catalog of 490 components (`components.tsv`).
- Seven headless component libraries: HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks.
- Seven example applications: HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js,
  Angular Analog, Blazor Web, Nunjucks Eleventy.
- A CSS style-sheet template (`css-style-sheet-template.css`) declaring every
  component class hook.
- Component documentation per component (`components/{slug}/index.md`,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`).
- Seven framework-helper catalogs (`*-helpers`), each shipping the
  `theme-select`, `locale-select`, and `text-size-select` helper packages.
- A `themes/` directory of 45 ready-to-use reference theme stylesheets.
- Tooling for listing, scaffolding, syncing, and testing components across
  subprojects (`bin/`).
- Modular project documentation in `AGENTS/*.md`.

### Explicitly out of scope

- Bundled stylesheets in the headless layer.
- A CSS framework dependency (Tailwind / DaisyUI / Bootstrap).
- Data fetching, network state, persistence, or routing.
- Locale-specific formatting (consumer wires `Intl.*` or library).
- Animation choreography, transitions, motion design.
- Bundled fonts, icon sets, or imagery.
- Hardcoded user-facing strings.

## 3. Architecture

```
lily-design-system/                            ← canonical catalog + tools
├── AGENTS.md, AGENTS/*.md                     ← modular reference docs
├── components.tsv                             ← canonical 490-component list
├── components/{slug}/                         ← per-component docs (490 dirs)
├── css-style-sheet-template.css               ← class-hook stylesheet template
├── bin/                                       ← scaffolding, listing, sync, test, publish
├── spec/                                      ← the specification (this file is spec/index.md
│                                                 + one topic dir per area)
├── themes/                                    ← 45 reference theme stylesheets (see §4.4)
├── lily-design-system-html-headless/          ← headless: HTML
├── lily-design-system-svelte-headless/        ← headless: Svelte 5
├── lily-design-system-react-headless/         ← headless: React
├── lily-design-system-vue-headless/           ← headless: Vue 3
├── lily-design-system-angular-headless/       ← headless: Angular 20
├── lily-design-system-blazor-headless/        ← headless: Blazor
├── lily-design-system-nunjucks-headless/      ← headless: Nunjucks
├── lily-design-system-html-css-js-examples/   ← examples: vanilla HTML+CSS+JS
├── lily-design-system-svelte-sveltekit-examples/ ← examples: SvelteKit 2
├── lily-design-system-react-next-examples/    ← examples: Next.js
├── lily-design-system-vue-nuxt-examples/      ← examples: Nuxt.js
├── lily-design-system-angular-examples/       ← examples: Angular 20 + Analog.js
├── lily-design-system-blazor-web-examples/    ← examples: Blazor Web
├── lily-design-system-nunjucks-eleventy-examples/ ← examples: Nunjucks + Eleventy
├── lily-design-system-html-helpers/           ← helpers: HTML
├── lily-design-system-svelte-helpers/         ← helpers: Svelte 5 (canonical reference)
├── lily-design-system-react-helpers/          ← helpers: React
├── lily-design-system-vue-helpers/            ← helpers: Vue 3
├── lily-design-system-angular-helpers/        ← helpers: Angular 20
├── lily-design-system-blazor-helpers/         ← helpers: Blazor (Razor class libraries)
└── lily-design-system-nunjucks-helpers/       ← helpers: Nunjucks
```

Each subproject is also a `git subtree` so it can be pushed to its own
standalone remote via `bin/git-subtree-push`.

### The three subproject layers

- **Headless** (7 subprojects) — framework libraries mirroring the full
  490-component catalog: unstyled, accessible, zero CSS.
- **Examples** (7 subprojects) — complete styled reference applications
  demonstrating every component with the NHS UK visual reference.
- **Helpers** (7 subprojects) — small catalogs of opinionated packages that
  each own one user-preference lifecycle end to end. Every catalog ships
  three helpers — `theme-select`, `locale-select`, `text-size-select` —
  as native `<select>` controls with DOM application (`data-theme`,
  `lang`/`dir`, `data-text-size`), optional `localStorage` persistence,
  and SSR safety. The Svelte catalog is the canonical reference; the
  other six are framework-idiom ports. Each helper publishes to npm
  (or NuGet for Blazor) via `bin/publish-helpers` and a per-catalog
  `build.js` dist pipeline. See [spec/helpers/](helpers/index.md).

### Required files per subproject

- `index.md` — human-readable overview.
- `README.md` — symlink to `index.md`.
- `AGENTS.md` — AI coding help; loads modular `AGENTS/*.md`.
- `CLAUDE.md` — loads `AGENTS.md`.
- `spec/index.md` — spec-driven plan + tasks (replaces the older split
  `plan.md` / `tasks.md`).
- `.git-subtree-push` — subtree remote configuration.

### Required files per component directory

- `index.md` — component documentation (description, usage, props, ARIA,
  keyboard, references, "When to Use", "When Not to Use", code example).
- `README.md` — symlink to `index.md`.
- `AGENTS.md` — canonical metadata (HTML tag, ARIA, keyboard, props).
- `CLAUDE.md` — loads `AGENTS.md`.
- `spec/index.md` — spec-driven plan + tasks (replaces the older split
  `plan.md` / `tasks.md`).

`bin/test` verifies every component and every subproject has the files above.

## 4. Design principles

The principle documents in `AGENTS/` are the binding rules; each has a
topic deep-dive under `spec/`. Summary:

### 4.1 Headless ([AGENTS/headless.md](../AGENTS/headless.md), [topic](headless/index.md))

Most specific semantic element first; ARIA only where semantics fall
short. Root carries the kebab-case base class + the consumer's class
hook; inner sub-classes are stable contracts; rest-props spread onto
the root. Components own focus, keyboard, ARIA, and bindable open/close
state — never data fetching, routing, locale formatting, persistence,
or animation. No stylesheets, fonts, images, or icons; no inline styles
except where structurally required (`display: contents` on
`ThemeProvider`). `data-*` is for consumer CSS/JS; ARIA is for
assistive technology.

### 4.2 Accessibility ([AGENTS/accessibility.md](../AGENTS/accessibility.md), [topic](accessibility/index.md))

WCAG 2.2 AAA target; WAI-ARIA APG 1.2 patterns for keyboard, roles,
states. Every interactive component is keyboard-operable with a
documented contract and an accessible name; no colour-only meaning;
live regions are deliberate; headless components never auto-animate.

### 4.3 Internationalisation ([AGENTS/internationalization.md](../AGENTS/internationalization.md), [topic](internationalization/index.md))

No hardcoded user-facing strings; stable text-prop names (`label`,
`description`, `placeholder`, `error`, …); locale-aware components take
the locale as a prop and never pick a default; anchors never embed
default text; plural/gender logic belongs to the consumer; RTL/bidi
inherits from the consumer's `dir`.

### 4.4 Theme ([AGENTS/theme.md](../AGENTS/theme.md), [topic](theme/index.md))

Themes live in example CSS and the optional `ThemeProvider` (flat token
object → `--theme-{path}` custom properties; variants via `data-theme`).
The headless layer bakes in no colour, spacing, typography, or
breakpoints — the forbidden-literal list is in the AGENTS file. The
root [`themes/`](../themes/) directory ships 45 ready-to-use reference
stylesheets (NHS England/Scotland/Wales patient + practitioner
variants, GOV.UK GDS, USWDS, Adobe Spectrum, Mozilla Protocol, and
general-purpose themes) that the `theme-select` helper loads at runtime
by swapping a managed `<link>` and setting `data-theme`.

### 4.5 Examples ([AGENTS/examples.md](../AGENTS/examples.md), [topic](examples/index.md))

Each example app ships a complete stylesheet (NHS UK is the default
visual reference) targeting the kebab-case Lily class names, with CSS
custom properties for tokens and no CSS framework. Three required
routes: `/`, `/components` (full searchable catalog), and
`/components/{slug}` (live demo per component); composed-page demos are
encouraged. Skip-link first, landmark structure, visible focus, and
keyboard-only completion on every page.

## 5. Component catalog

The canonical catalog is `components.tsv` — one row per component, three
tab-separated columns: slug, PascalCase name, description. Mirrored by
[AGENTS/components.md](../AGENTS/components.md) (with patterns),
[index.md](../index.md) (linked listing), and the per-framework
implementations; the example-app registries are regenerated from it by
`bin/generate-registries`.

**Current count: 490 components.**

The catalog spans forms, navigation, tables, layout, editorial /
scrollytelling, data visualisation, media, overlays, pickers and
ratings, semantic entities, and 80 national personal identifier
components (40 identifier types × `-input` + `-view` across 30+
countries). The full category walkthrough lives in
[spec/components/](components/index.md); the national identifiers in
[spec/national-identifiers/](national-identifiers/index.md).

## 6. Naming conventions

The binding reference is [AGENTS/components.md](../AGENTS/components.md),
expanded in [spec/components/](components/index.md). Two rule families:

- **Suffix → HTML element mapping.** Each slug suffix fixes the root
  element: `-button` → `<button>`, `-input` → `<input>`, `-select` →
  `<select>`, `-nav` → `<nav>`, `-list` → `<ol>`/`<ul>`, `-list-item` →
  `<li>`, `-table` (+ `-table-head/-body/-foot/-row/-th/-td`) → table
  elements (gantt uses HTML names: `-table-thead` etc.), `-dialog` →
  `<dialog>`, `-picker` → `<div>`, and so on. The full table is in
  [spec/components/](components/index.md#suffix--element-mapping).
- **Compound name patterns.** Stable families compose predictably:
  `*Bar`+`*BarButton`, `*List`+`*ListItem`, `*Nav`+`*List`+`*ListItem`,
  `*Menu`+`*MenuItem`, `*Select`+`*SelectOption`, `*Picker`+
  `*PickerButton`, `*Input`+`*View`, `*Input`+`*Link`, `ContainerWith*`,
  and the table sub-element families.

## 7. Composition patterns

See [AGENTS/components.md §"Component composition patterns"](../AGENTS/components.md)
and the helper docs in [AGENTS/components-helpers/](../AGENTS/components-helpers/)
for canonical templates: Avatar, CalendarTable, DataTable, GanttTable,
GrailLayout, KanbanTable.

Headline patterns (recap):

- **Form**: `Form > Field > {Label, Input, Hint, ErrorMessage}` plus
  `ErrorSummary` and a `Button[type=submit]`.
- **Grail layout**: `GrailLayout > {TopHeader, LeftAside, CenterMain, RightAside,
  BottomFooter}` for a five-region responsive page shell.
- **Navigation**: `*Nav > *List > *ListItem` for breadcrumbs, contents,
  pagination, sections, tree, chat, accordion.
- **Table**: `*Table > *TableHead | *TableBody | *TableFoot > *TableRow >
  *TableTH | *TableTD`.

## 8. Per-component documentation

Each `components/{slug}/index.md` includes the following sections in this order:

1. **Title** — PascalCase name.
2. **Description** — one-sentence summary matching `components.tsv`.
3. **When to Use** — 3-5 positive-guidance bullets (when this component is the
   right choice, what user needs it serves, what contexts it fits).
4. **When Not to Use** — 2-4 bullets that name a specific Lily alternative,
   anti-patterns, and contexts where it doesn't belong.
5. **Usage** — realistic code example using semantic HTML with proper ARIA.
   Demo strings are concrete English content but flow through the same prop
   names a consumer would localise.
6. **Props / Slots / Parameters** — name, type, required, description.
7. **ARIA** — roles, states, properties used.
8. **Keyboard** — table of key + action.
9. **References** — links to WAI-ARIA APG, NHS UK, MDN, etc.

The companion `AGENTS.md` carries the canonical machine-readable metadata
(HTML tag, ARIA, keyboard contract, props) used by AI coding agents.

### 8.1 Quality standards for component docs

- Lily is headless: guidance is framework-agnostic.
- NHS research informs but doesn't dictate: adapt for headless context.
- "When Not to Use" always names specific Lily alternatives.
- Code examples use semantic HTML with proper ARIA.
- No hardcoded user-facing strings in examples — use realistic placeholder
  content.
- Consistent voice across all 490 components.

### 8.2 Component demo strategy (example subprojects)

Each `/components/{slug}` page renders the component metadata, a live
demo with sample data, a usage snippet, and an import statement. Demo
HTML is keyed by slug in the canonical SvelteKit
`component-demos.ts` map (seeded by `generate-component-demos.js` from
suffix patterns, then curated); `bin/generate-registries` copies it into
the other apps. Rendering mechanism per framework: HTML/JS `innerHTML`,
Svelte `{@html}`, React `dangerouslySetInnerHTML`, Vue `v-html`, Blazor
`MarkupString`, Nunjucks `| safe`. Details:
[spec/examples/](examples/index.md).

## 9. Tooling

Scripts live in `bin/`:

| Script                                | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `bin/list-components-as-kebab-case`   | List all component slugs (one per line).             |
| `bin/list-components-as-pascal-case`  | List all component PascalCase names.                 |
| `bin/list-implementations`            | List implementation subprojects.                     |
| `bin/create-component-directory`      | Scaffold one component directory.                    |
| `bin/create-implementation-directory` | Scaffold one implementation directory.               |
| `bin/test`                            | Verify required files across repo + all subprojects. |
| `bin/sync`                            | Sync shared files across subprojects (rsync).        |
| `bin/update`                          | Update shared files.                                 |
| `bin/git-subtree-push`                | Push each subtree to its standalone remote.          |
| `bin/generate-storybook-stories.mjs`  | Generate Storybook stories.                          |
| `bin/publish-helpers`                 | Build + publish the 21 helper packages (npm / NuGet).|
| `bin/generate-registries`             | Regenerate example-app registries from the catalog.  |
| `bin/check-links`                     | Verify relative markdown links resolve.              |

Note on syncing: AGENTS files at the repo root are canonical; `bin/sync` copies
them into subprojects with `rsync` (not symlinks, because `git subtree push`
does not follow symlinks across project boundaries).

## 10. References

External design systems and component libraries that inform Lily are listed in
[AGENTS/citations.md](../AGENTS/citations.md). The current default visual
reference for the example apps is the NHS UK design system; see
[AGENTS/nhs-uk-design-system-references.md](../AGENTS/nhs-uk-design-system-references.md)
for the canonical NHS pages.

Other inspirations include GOV.UK, ONSdigital, USWDS, Mozilla Protocol, Adobe
Spectrum, Ant Design, Wonderflow Wanda, Design System AU, DaisyUI, shadcn/ui,
Reuters graphics components.

Framework-specific notes:

- [AGENTS/sveltekit.md](../AGENTS/sveltekit.md) — Svelte 5 + SvelteKit 2 conventions.
- [AGENTS/nunjucks.md](../AGENTS/nunjucks.md) — Nunjucks macro conventions.

### 10.1 Reuters Graphics — editorial / scrollytelling influence

The [Reuters Graphics components](https://github.com/reuters-graphics/graphics-components)
library inspired Lily's editorial, scrollytelling, and layout primitives
(`article-layout`, `content-block`, `headline`, `byline`, `scroller*`,
`feature-photo`, `tile-map`, `visible`, `theme-provider`, and more).
Reuters is Svelte-specific with SCSS; Lily adapts the patterns to its
headless, framework-plural, zero-CSS approach — SCSS typography becomes
consumer CSS on class hooks, named block widths become the
`--content-width-*` custom-property convention set by `article-layout`
and read by `content-block`, and Reuters-specific branding/integrations
are excluded. The full source-to-slug mapping, adaptation table, and
column-width CSS live in [spec/citations/](citations/index.md) and
[spec/theme/](theme/index.md).

## 11. Acceptance criteria

The criteria below describe the **complete** Lily Design System. Anything
checked is considered live work; anything unchecked is queued in §12.

### 11.1 Catalog & docs

- [x] Canonical component list defined (490 components in `components.tsv`).
- [x] CSS style sheet template covers every component class hook.
- [x] All 490 components have a directory in `components/` with `index.md`,
      `README.md` (symlink), `AGENTS.md`, `CLAUDE.md`, `spec/index.md`.
- [x] All 490 components have separate "When to Use" and "When Not to Use"
      sections (not combined).
- [x] All "When Not to Use" sections name specific Lily component alternatives.
- [x] All 37 NHS-equivalent components enhanced with NHS-researched guidance.
- [x] All ~370 remaining components enhanced with original headless-context
      guidance.
- [x] Component naming patterns documented and consistent.
- [x] Suffix-to-HTML-element mapping documented and accurate.
- [x] Composition patterns documented (Form, Navigation, Table, Grail Layout,
      Avatar, CalendarTable, DataTable, GanttTable, KanbanTable).

### 11.2 Subprojects

- [x] All 7 headless subprojects exist (HTML, Svelte, React, Vue,
      Angular, Blazor, Nunjucks). The Angular headless library
      (Angular 20, signal-based, OnPush, zero-CSS, standalone
      components) landed on 2026-05-28 and is fully verified as of
      2026-05-30: `pnpm install` resolves with Analog 1.19.4 pinning,
      `vitest run` passes 974 / 974 cases across 490 / 490 spec
      files, `ng-packagr` build emits a clean APF bundle, and
      `@storybook/angular` 9.1 builds 490 / 490 stories.
- [x] All 7 example subprojects exist (HTML+CSS+JS, SvelteKit,
      Next.js, Nuxt.js, Angular + Analog.js, Blazor Web, Nunjucks
      Eleventy). The Angular + Analog.js app (standalone components,
      zoneless change detection, file-based routing, Vite SSG)
      landed on 2026-05-28 with the same copy-pattern the other 6
      apps use (headless components copied into `src/app/components/`).
      SSG build is blocked on an upstream Analog issue documented
      in §11.8.
- [x] All 7 helper subprojects exist (Svelte canonical, plus React, Vue,
      Angular, HTML, Nunjucks, Blazor ports). Each catalog ships the
      `theme-select`, `locale-select`, and `text-size-select` helpers as
      native `<select>` controls (initial release 0.1.0 on 2026-06-05;
      converted from the earlier radio-group pickers on 2026-06-17 and
      released as the breaking 0.2.0 for theme-select and locale-select
      on 2026-07-03; text-size-select stays 0.1.0), with per-package
      manifests (npm `package.json`, or NuGet `.csproj` for Blazor),
      dist build pipelines (`build.js`), and CHANGELOGs.
- [x] All 21 subprojects have required files (`index.md`, `README.md`
      symlink, `AGENTS.md`, `CLAUDE.md`, `spec/index.md`, `.git-subtree-push`).
      All use the spec-driven `spec/index.md` layout the May 2026 migration
      standardised on (it replaces the older split plan.md / tasks.md).
- [x] All example subprojects reference `AGENTS/examples.md` for route
      requirements.
- [x] All example subprojects have a `/components` route listing the full catalog.
- [x] All example subprojects have a `/components/{slug}` route with a live
      demo per component.
- [x] Component-demo data files include an `html` demo field for every
      component in each example subproject.

### 11.3 Tooling & verification

- [x] `bin/list-components-as-kebab-case` and `…-as-pascal-case` work.
- [x] `bin/list-implementations` works.
- [x] `bin/create-component-directory` and `bin/create-implementation-directory`
      scaffold correctly.
- [x] `bin/test` passes against the repository, all components, all subprojects.
- [x] `bin/sync` keeps shared files in sync (rsync, not symlink).
- [x] `bin/git-subtree-push` pushes each subtree to its remote.

### 11.4 Verified (snapshot as of 2026-05-30; catalog counts updated to 490 on 2026-07-03)

> The exact case counts in §11.4–§11.7 are point-in-time verification
> records, not live claims; re-run the suites for current numbers.

- [x] `css-style-sheet-template.css` audit: 490 / 490 canonical slugs have
      a class hook; 3 additional documented sub-element hooks
      (`accordion-checkbox-input`, `accordion-checkbox-label`,
      `accordion-checkbox-panel`).
- [x] All 6 long-standing headless and 6 long-standing example
      subprojects implement all 490 canonical components. The 80
      newly-added national personal identifier components (May 2026)
      shipped per-subproject implementations in Phase 2 (commits
      50841648..490282db): Svelte, React, Vue, HTML, Blazor, Nunjucks
      headless libraries plus all 6 example apps. Sample tests pass
      in every framework that has runnable tests (38 svelte, 19
      react, 19 vue, 17 nunjucks, 9 blazor sample tests verified).
      The seventh pair (Angular headless + Angular Analog examples,
      added 2026-05-28) also implements all 490 components in the
      same canonical layout; angular-headless ships 490 / 490
      working .ts + .spec.ts + .stories.ts triplets, and the
      examples app copies the 490 .ts components into
      `src/app/components/`.
- [x] Cross-subproject name consistency: TabGroup removed,
      `medical-record-red-box` renamed; no orphans remain.
- [x] Per-framework test suites cover every component in every subproject:
      - svelte-headless: 4,016 vitest cases (407 dual-mirror specs;
        sample-tests for the 80 May 2026 national-identifier
        components landed alongside but the per-component dual-mirror
        spec generation is a separate sweep).
      - react-headless: 2,205 vitest cases.
      - vue-headless: 2,187 vitest cases.
      - angular-headless: 974 vitest cases across 490 / 490 spec files.
      - blazor-headless: 1,245 bUnit cases.
      - nunjucks-headless: 2,393 vitest cases.
      - html-headless: 407 WebDriverIO spec files.
- [x] Per-framework CSS class-name audit: 490 / 490 components in every
      headless subproject reference their canonical kebab-case base class.
- [x] Storybook story coverage across headless: 490 / 490 in
      svelte, react, vue, html, nunjucks, angular (6 frameworks with
      Storybook; blazor does not — see §11.7).
- [x] Playwright e2e coverage on all 5 browser-runnable example apps:
      - svelte-sveltekit-examples: 1,221 specs.
      - react-next-examples: 1,221 specs.
      - vue-nuxt-examples: 1,221 specs.
      - blazor-web-examples: 1,221 specs.
      - html-css-js-examples: 814 specs.
      - nunjucks-eleventy-examples: 612 specs.

### 11.5 Accessibility audit (axe-core via Playwright; snapshot as of 2026-05-30)

axe-core / Playwright integration shipped across all 6 example apps.
Per-app baseline (axe-clean routes / total checked):

| App                            | Clean | Notes                                |
| ------------------------------ | ----- | ------------------------------------ |
| svelte-sveltekit-examples      | 29/29 | ✅ full pass                          |
| react-next-examples            | 29/29 | ✅ full pass                          |
| vue-nuxt-examples              | 29/29 | ✅ full pass                          |
| blazor-web-examples            | 29/29 | ✅ full pass                          |
| html-css-js-examples           | 29/29 | ✅ full pass                          |
| nunjucks-eleventy-examples     | 17/17 | ✅ full pass                          |

axe rule set: WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA.

### 11.6 Responsive viewport sweep (snapshot as of 2026-05-30)

Responsive smoke check across 4 viewport sizes (mobile 375×667,
tablet 768×1024, desktop 1280×800, 4K 2560×1440) ported to all 6
example apps. Tests assert: skip-link present, `<main>` and H1
visible, no horizontal page overflow.

Each app loads ~10 representative routes (home, catalog, sample
component-detail pages, key composed pages) × 4 viewports = ~40
checks per app. Route paths adjusted per app:

| App                            | Route shape                                          |
| ------------------------------ | ---------------------------------------------------- |
| svelte-sveltekit-examples      | `/components/{slug}`, `/page-layout` (no slashes)    |
| react-next-examples            | `/components/{slug}`, `/page-layout` (no slashes)    |
| vue-nuxt-examples              | `/components/{slug}`, `/page-layout` (no slashes)    |
| blazor-web-examples            | `/components/{slug}`, `/page-layout` (no slashes)    |
| html-css-js-examples           | `/components/component.html?slug={slug}`, trailing slash on composed |
| nunjucks-eleventy-examples     | `/components/{slug}/` (trailing slash), no composed pages built yet  |

The nunjucks-eleventy app skips composed-page routes (only catalog
+ component-detail pages are built), and tests skip individually if
a built route 404s.

### 11.7 Storybook coverage (snapshot as of 2026-05-30)

| Library              | Storybook    | Stories       |
| -------------------- | ------------ | ------------- |
| html-headless        | yes (vite)   | 490 / 490     |
| svelte-headless      | yes (vite)   | 490 / 490     |
| react-headless       | yes (vite)   | 490 / 490     |
| vue-headless         | yes (vite)   | 490 / 490     |
| nunjucks-headless    | yes (vite)   | 490 / 490     |
| angular-headless     | yes (webpack)| 490 / 490     |
| blazor-headless      | no           | not planned   |

Angular headless uses `@storybook/angular` 9.1 with the
`@storybook/angular:build-storybook` Angular builder (webpack-based;
Storybook 9 does not yet ship a first-class Vite builder for
Angular). An `angular.json` scaffold declares the `storybook` and
`build-storybook` architect targets and points them at
`.storybook/tsconfig.json`. All 490 stories render with the same
`title: "Headless/{Pascal}"` + single `Default` story shape used by
the other 5 Storybook-wired libraries.

Blazor headless deliberately skips Storybook: there is no idiomatic
`@storybook/blazor` framework, and the runtime-rendering pipeline
(bUnit + `dotnet watch`) covers the same exploration use case. A
static-HTML pre-render pipeline would be possible but adds tooling
overhead that the project hasn't chosen to pay.

### 11.8 Open backlog

Completed items are recorded in [CHANGELOG.md](../CHANGELOG.md) and §12;
this list holds only what is genuinely open.

- [/] Angular subprojects end-to-end verification — mostly done.
      angular-headless is fully verified (§11.2). The angular-examples
      app builds, prerenders 506/506 routes, and works as a
      client-rendered SPA, but static SSG output is shell-only: Analog's
      `analog-glob-routes` plugin injects routes via a brittle string
      replace that other transforms can break, so the prerendered HTML
      hydrates to full content on the client instead of shipping it.
      Root cause, fixes tried, and the dependency history are logged in
      [lily-design-system-angular-examples/docs/analog-ssg-notes.md](../lily-design-system-angular-examples/docs/analog-ssg-notes.md);
      the distilled upstream report is
      [analog-ssg-issue.md](../lily-design-system-angular-examples/docs/analog-ssg-issue.md).
      Next step: file that issue upstream, or move the SSG step onto
      `@angular/build:application`'s prerenderer.
- [ ] Playwright e2e suites not yet exercised against the two Angular
      subprojects.

## 12. Implementation status

### 12.1 Completed work

The full release-by-release record lives in
[CHANGELOG.md](../CHANGELOG.md) (and §14.1 highlights). Summary of the
completed epochs:

- **Catalog & infrastructure** — canonical list (now 490), CSS
  class-hook template, `bin/` toolchain, modular AGENTS docs, all 7
  headless + 7 example + 7 helper subprojects.
- **Per-component docs** — all components carry `index.md` with
  When-to-Use / When-Not-to-Use guidance (NHS-researched where an NHS
  equivalent exists), plus canonical `AGENTS.md` metadata and a
  spec-driven `spec/index.md`.
- **Demos & registries** — per-slug live demos in every example app;
  registries generated from the catalog.
- **Test infrastructure** — per-framework unit suites, Storybook
  coverage, Playwright e2e, axe-core baselines, responsive sweeps
  (verified state in §11.4–§11.7).
- **May–July 2026** — 80 national identifiers (0.2.0), Angular pair
  (0.3.0), catalog 492 (0.4.0), helpers layer + themes + spec/
  directories + catalog 490 (0.5.0), tooling hardening (0.6.0).

### 12.2 Open backlog

Backlog items live in §11.4 and are not duplicated here. New work items added
during ongoing development should be appended there (or to the appropriate
section), not into a separate `tasks.md`.

## 13. Roadmap

Near-term focus:

1. Catalog and css-template audit — close §11.4 items.
2. Cross-subproject component coverage audit — ensure all 490 components are
   implemented in every headless and example subproject.
3. Test-coverage audit — vitest, bUnit, Playwright e2e cover every component.

Medium-term:

- Wire the `themes/` reference stylesheets (GOV.UK GDS, USWDS, Mozilla
  Protocol, Adobe Spectrum, NHS variants — shipped June 2026) into the
  example subprojects as switchable alternatives to the default NHS layer,
  e.g. via the `theme-select` helper.
- Expand composed-page demos beyond the required routes.

Long-term:

- Versioned releases per subproject npm/NuGet package (started: the 21
  helper packages publish via `bin/publish-helpers`; theme-select and
  locale-select at 0.2.0, text-size-select at 0.1.0).
- Contributor onboarding documentation (currently informal).

## 14. Tracking

- Package: lily
- Version: 0.6.0
- Created: 2025-08-09
- Updated: 2026-07-03
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or contact
  for other terms)
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [components.tsv](../components.tsv) (490 rows, tab-separated:
  slug, name, description)
- Companion docs: [AGENTS.md](../AGENTS.md), [AGENTS/*.md](../AGENTS/),
  [index.md](../index.md), [CHANGELOG.md](../CHANGELOG.md)
- Subtree pushes: see each subproject's `.git-subtree-push` file

### 14.1 Changelog highlights

- **0.6.0 (2026-07-03)** — Tooling hardening and release hygiene.
  `bin/test` now exits non-zero on failure and cross-checks the catalog
  against component dirs, CSS hooks, and all twelve example-app
  registries; `bin/generate-registries` regenerates every registry from
  `components.tsv` + the canonical demo map; `bin/check-links` verifies
  markdown links (89 broken links fixed); CI added. theme-select and
  locale-select released as the breaking 0.2.0. This file slimmed from
  76 KB to under 40 KB; the Analog SSG engineering log relocated to the
  angular-examples docs with a ready-to-file upstream issue draft. Full
  record: [CHANGELOG.md](../CHANGELOG.md).
- **0.5.0 (2026-07-03)** — Spec-driven development moves from single
  `spec.md` files to `spec/` directories entered via `spec/index.md`,
  across the repo root (this file — the former monolith merged with the
  topic hub), all 21 subprojects, all 490 component directories, the
  github.io route directories, and the helper packages; `bin/test` and
  the scaffolders follow. The helpers layer and reference themes land;
  the theme-picker/theme-select collision is resolved. Seven `*-helpers`
  subprojects (Svelte canonical + React, Vue, Angular, HTML, Nunjucks,
  Blazor ports) each ship three native-`<select>` helpers — `theme-select`,
  `locale-select`, `text-size-select` — at v0.1.0 with npm/NuGet manifests,
  dist build pipelines, and a `bin/publish-helpers` release script. A root
  `themes/` directory adds 45 reference theme stylesheets (NHS
  England/Scotland/Wales patient + practitioner variants, GOV.UK GDS,
  USWDS, Adobe Spectrum, Mozilla Protocol, and general-purpose themes).
  The June catalog migration of `theme-picker` → `theme-select` had
  collided with the pre-existing `theme-select` (duplicate slug, duplicate
  CSS hooks, duplicated registry/demo entries, orphaned `ThemePicker*`
  implementation files); the collision is now resolved by merging onto the
  native-`<select>` `theme-select` and dropping the radio-group picker and
  its `theme-select-button` companion — the canonical catalog goes from
  492 to 490 components, and all stale files, exports, demo entries, and
  stylesheet rules are removed across the 14 implementation subprojects
  and `lilydesignsystem.github.io`. Example-app catalog registries
  backfilled to the full 490 (SvelteKit / Next.js / Nuxt / HTML apps were
  missing the 80 national-identifier entries; github.io was missing the
  five 0.4.0 additions). Docs harmonised: helpers + themes in the
  architecture, `bin/publish-helpers` in tooling, spec/ topic docs
  updated (helpers contracts now document the `<select>` markup), and a
  root `CHANGELOG.md` added — see it for the full 0.5.0 record.
- **0.4.0 (2026-05-30)** — Catalog grows from 487 to 492 components
  across two batches. Batch one adds `question`, `answer` and rewrites
  `comment` (`<article>` → `<div>`, broader description) as a generic
  discourse triad. Batch two adds `addressograph-box` (patient/recipient
  ID box, `<div>`), `barcode-image` (1D scanner symbology, `<img>`),
  and `draft` (in-progress content wrapper, `<div>` with optional
  `data-status`). Existing `qr-code` renamed to `qr-code-image` for
  symmetry with `barcode-image`. All 5 new components propagated across
  the 14 implementation subprojects + `lilydesignsystem.github.io`
  (headless implementations, tests, Storybook stories, example-app
  demo registries, github.io route pages). `AGENTS/components.md`
  trimmed from 55 KB to 7 KB by replacing the duplicated 492-line
  catalog listing with a pointer to the canonical `components.tsv`.
- **0.3.0 (2026-05-30)** — 7th headless + 7th example pair
  (Angular 20 + Analog.js v1) land. angular-headless verified
  end-to-end (974/974 vitest, ng-packagr APF build,
  `@storybook/angular` with 490/490 stories). angular-examples
  build still blocked on upstream Analog SSR issue (see §11.8).
  Canonical national-identifier reference files
  (`AGENTS/{countries.tsv,national-person-identifiers.tsv,
  national-personal-identifier-normalization.md}`) committed at
  root and propagated to all 12 subprojects.
- **0.2.0 (2026-05-24)** — 80 national personal identifier
  components added across 30+ countries, bumping the canonical
  count from 407 to 492. axe-core baseline reaches 29/29 on every
  example app. Responsive viewport sweep ported to all 6 example
  apps. spec.md replaces the older split plan.md / tasks.md.
