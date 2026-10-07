# Lily Design System™ — Specification

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
- "Consumer" = the application or library that depends on a Lily™ headless package.

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
| [architecture](architecture/index.md) | Monorepo layout, the 23 implementation subprojects (7 full-catalog headless + 1 at its full achievable scope + 7 examples + 8 helper catalogs), `themes/`, the git-subtree model, required files. |
| [headless](headless/index.md) | Headless design rules: semantic markup, class hooks, rest-props, behaviour boundaries, zero CSS. |
| [accessibility](accessibility/index.md) | WCAG 2.2 AAA target, WAI-ARIA APG patterns, ARIA reference table, axe-core baselines. |
| [internationalization](internationalization/index.md) | No hardcoded strings, stable text-prop names, locale-aware props, RTL/bidi. |
| [theme](theme/index.md) | Token shape, `--theme-*` custom properties, `data-theme` variants, the headless forbidden-list. |
| [components](components/index.md) | The 491-component catalog, suffix→element mapping, name patterns, composition, per-component docs. |
| [examples](examples/index.md) | Example apps, the three required routes, NHS reference styling, demo render mechanisms. |
| [tooling](tooling/index.md) | The `bin/` scripts, the rsync sync model, `bin/test` verification, subtree push. |
| [monorepo-github-pages](monorepo-github-pages/index.md) | Publishing the docs site via git subtree to a read-only sibling export repo. |
| [testing](testing/index.md) | Per-framework test suites, Storybook coverage, Playwright e2e, axe, responsive sweep. |
| [frameworks](frameworks/index.md) | The seven framework pairs (plus the unpaired, Web Components catalog), per-framework file shapes and idioms, the copy-pattern. |
| [helpers](helpers/index.md) | The `*-helpers` catalogs: the 8 pickers and `picker-bar`, their contracts, manifests, tooltips, and publish pipeline. |
| [link-picker](link-picker/index.md) | The link-picker button / disclosure-of-links HTML contract: a home icon opening the page links the app defines; leftmost in `picker-bar`. |
| [theme-picker](theme-picker/index.md) | The theme-picker button / listbox / option HTML contract, one page, bare glyph ◑. |
| [locale-picker](locale-picker/index.md) | The locale-picker button / listbox / option HTML contract, bare glyph 🌐︎. |
| [text-size-picker](text-size-picker/index.md) | The text-size-picker button / listbox / option HTML contract, glyph "A", the seven-step size scale. |
| [motion-picker](motion-picker/index.md) | The motion-picker button / listbox / option HTML contract, bare glyph ⏸︎, the unconditional `prefers-reduced-motion` default. |
| [share-picker](share-picker/index.md) | The share-picker button / disclosure-of-links HTML contract, bare glyph ➤, no `aria-haspopup`. |
| [search-picker](search-picker/index.md) | The search-picker button / search-form disclosure HTML contract: magnifying-glass icon, ⏎ submit, GET to `/?<text>`. |
| [date-time-picker](date-time-picker/index.md) | The date-time-picker field + trigger + APG dialog HTML contract, bare glyph 📅︎ — the one picker that is a form control. |
| [national-identifiers](national-identifiers/index.md) | The 140 national personal identifier components, normalization, validation algorithms. |
| [trusted-publishing](trusted-publishing/index.md) | OIDC publishing to npm/NuGet: the adoption position, readiness table, checklist. |
| [free-open-source-funding](free-open-source-funding/index.md) | Funding channels (GitHub Sponsors live, Open Collective planned), terms, and the files that must agree. |
| [special-files-for-public-repos](special-files-for-public-repos/index.md) | The top-level files every published subtree repo carries, copy-vs-generate, the sync tooling. |
| [dependabot](dependabot/index.md) | Repo-level security updates: the grouped-weekly-PR `.github/dependabot.yml`, 31 entries. |
| [node-current-version](node-current-version/index.md) | The Node 26 requirement: `engines.node` across all `package.json` files and `deploy.yml`. |
| [agent-skills](agent-skills/index.md) | The `lily-design-system-skill` (end-user) and `lily-design-system-maintainer-skill` (maintainer) Claude Skills, what each covers, and the naming-split retirement. |
| [llms-json-and-llms-txt](llms-json-and-llms-txt/index.md) | The root and docs-site `llms.txt`/`llms.json` AI guidance files, the llms.txt convention, and why the two pairs' links differ. |
| [citations](citations/index.md) | Design systems Lily learns from, the NHS UK reference, Reuters Graphics influence. |
| [history](history/index.md) | The dated, per-event record of releases and fixes (moved out of this file 2026-10-06 to keep it loadable). |
| [trademarks](trademarks.md) | The Lily™ / Lily Design System™ marks, the first-occurrence ™ convention, the standard footer. |

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
  Angular, Blazor, and Nunjucks.
- **CSS-strategy-agnostic**: works with semantic CSS, utility CSS (Tailwind), or
  no CSS at all.

## 2. Scope

### In scope

- A canonical catalog of 491 components (`components.tsv`).
- Seven full-catalog headless component libraries: HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks — plus an 8th, native-custom-element one (Web Components, added 2026-09-03) at its full achievable scope since 2026-09-06: 456 of 491, the remaining 35 permanently excluded by a real architectural limitation, not backlog.
- Seven example applications: HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js,
  Angular Analog, Blazor Web, Nunjucks Eleventy.
- A CSS style-sheet template (`css-style-sheet-template.css`) declaring every
  component class hook.
- Component documentation per component (`components/{slug}/index.md`,
  `AGENTS.md`, `spec/index.md`).
- Eight framework-helper catalogs (`*-helpers`), each shipping the
  `theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`,
  `share-picker`, `search-picker`, `link-picker`, and `date-time-picker` helper packages —
  64 `*-picker` packages in all.
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

The repository root holds the canonical catalog and tools
(`components.tsv`, `css-style-sheet-template.css`, `bin/`, `spec/`,
`AGENTS/*.md`, `themes/`); 23 implementation subprojects hang off it —
7 full-catalog headless libraries, 1 headless library at its full
achievable scope (Web Components, 536/571), 7 example apps, and 8
helper catalogs, one per framework (HTML, Svelte, React, Vue, Angular,
Blazor, Nunjucks, Web Components). Each subproject is also a `git
subtree` pushed to its own standalone remote via `bin/git-subtree-push`.
Full directory tree, the per-framework table, and the
git-subtree/multi-forge publishing model: [spec/architecture/](architecture/index.md).

### The three subproject layers

- **Headless** (7 full-catalog subprojects + 1 at its full achievable
  scope) — framework libraries mirroring the full 571-component catalog
  (Web Components mirrors 456 of it): unstyled, accessible, zero CSS.
- **Examples** (7 subprojects) — complete styled reference applications
  demonstrating every component with the NHS UK visual reference.
- **Helpers** (8 subprojects) — small catalogs of opinionated packages,
  each owning one complete interaction end to end: `theme-picker`,
  `locale-picker`, `text-size-picker`, `motion-picker` (icon button +
  APG listbox, own a user preference), `share-picker`, `search-picker` and `link-picker`
  (actions), and `date-time-picker` (a form value) — 64 `*-picker`
  packages, SSR-safe, Svelte canonical. See [spec/helpers/](helpers/index.md).

### Required files

Every subproject and every component directory carries the same core
set — `index.md`, `README.md` (symlink to `index.md`), `AGENTS.md`, `spec/index.md` — plus `.git-subtree-push` for
subprojects. Full per-file purpose tables:
[spec/architecture/](architecture/index.md#required-files-per-subproject).
`bin/test` verifies every component and every subproject has the
required files.

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
general-purpose themes) that the `theme-picker` helper loads at runtime
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

**Current count: 571 components** (491 + 24 national-identifier types × 2, added 2026-09-22 in two same-day rounds — see `spec/national-identifiers/index.md` — + 16 added 2026-10-05, triaged from a survey of Baby UI: `one-time-password-input`, `multi-select`, `multi-select-with-extras`, `empty-state`, `show-more`, `kbd-shortcut`, `calendar-year-table`, `calendar-month-table`, `calendar-week-table`, `calendar-day-table`, `thinking`, `gauge-chart`, `heatmap-chart`, `radar-chart`, `sankey-chart`, `file-tree` — + 7 charts added 2026-10-05 from the same Baby UI survey: `pie-chart`, `ring-chart`, `funnel-chart`, `candlestick-chart`, `composed-chart`, `choropleth-chart`, `sunburst-chart` — + `streaming-text` (2026-10-05, deliberately narrow: a busy-aware status region, no sources/citations/actions) + `tool-call` with its five inner parts `tool-call-name`, `tool-call-status`, `tool-call-input`, `tool-call-output`, `tool-call-error` + `mark` (2026-10-05, a Lily idea prompted by the Baby UI survey, not a Baby UI component) + `chat-composer` (2026-10-05, Baby UI's chat input built narrowly: no model picker, menus or thread); catalog-registered and fully implemented in all 8 headless catalogs, including Web Components).

The catalog spans forms, navigation, tables, layout, editorial /
scrollytelling, data visualisation, media, overlays, pickers and
ratings, semantic entities, and — grouped in their own "Special-Purpose
Identifiers" section, apart from the general-purpose components above —
140 national personal identifier components (70 identifier types ×
`-input` + `-view` across 50+ countries). The full category walkthrough
lives in [spec/components/](components/index.md); the national
identifiers in [spec/national-identifiers/](national-identifiers/index.md).

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

Each `components/{slug}/index.md` includes the following sections in this
order (corrected 2026-09-06: this list previously described a nine-section
order — Title, Description, When to Use, When Not to Use, Usage, Props,
ARIA, Keyboard, References — that none of the 491 files ever actually
followed; the real, consistently-implemented order below was verified
against a sample across the catalog):

1. **Title** — PascalCase name (as the `# ` heading; description follows
   as the opening paragraph, not its own heading).
2. **Implementation Notes** — format, algorithm, or behavioural detail
   that doesn't fit elsewhere.
3. **Props** — name, type, required, description.
4. **Usage** — realistic code example using semantic HTML with proper ARIA.
   Demo strings are concrete English content but flow through the same prop
   names a consumer would localise.
5. **Keyboard Interactions** — table of key + action.
6. **ARIA** — roles, states, properties used.
7. **When to Use** — 3-5 positive-guidance bullets (when this component is
   the right choice, what user needs it serves, what contexts it fits).
8. **When Not to Use** — 2-4 bullets that name a specific Lily alternative,
   anti-patterns, and contexts where it doesn't belong.
9. **Headless** — what the component does and does not decide visually.
10. **Styles** — pointers to the class hooks a consumer targets.
11. **Testing** — how the component's contract is verified.
12. **Advice** — practical guidance beyond the When-to/When-Not bullets.
13. **Related components** — cross-links to composed or adjacent components.
14. **References** — links to WAI-ARIA APG, NHS UK, MDN, etc.

The companion `AGENTS.md` carries the canonical machine-readable metadata
(HTML tag, ARIA, keyboard contract, props) used by AI coding agents — a
different, shorter file with its own structure, not a mirror of the above.

### 8.1 Quality standards for component docs

- Lily is headless: guidance is framework-agnostic.
- NHS research informs but doesn't dictate: adapt for headless context.
- "When Not to Use" always names specific Lily alternatives.
- Code examples use semantic HTML with proper ARIA.
- No hardcoded user-facing strings in examples — use realistic placeholder
  content.
- Consistent voice across all 571 components.

### 8.2 Component demo strategy (example subprojects)

Each `/components/{slug}` page renders the component metadata, a live demo, the demo's
markup, extra live-rendered variants, a **real** usage example and an import statement.
Demo HTML is keyed by slug in the canonical SvelteKit `component-demos.ts` map and copied
into the other apps by `bin/generate-registries`; usage examples and variants are generated
by `bin/generate-examples` (variants curated in `component-variants.json`); the docs-site
pages by `bin/generate-site-pages`. Rendering mechanism per framework, the data sources and
the usage-selection rules: [spec/examples/](examples/index.md#demonstration-pages).

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
| `bin/sync-special-files`              | Propagate the top-level special files into all 51 published repos. |
| `bin/update`                          | Update shared files.                                 |
| `bin/git-subtree-push`                | Push each subtree to its standalone remote.          |
| `bin/generate-storybook-stories.mjs`  | Generate Storybook stories.                          |
| `bin/publish-helpers`                 | Build + publish every helper package (npm / NuGet): the `*-picker`s, `picker-bar`, and the gantt / kanban / data-grid / calendar-view packages. |
| `bin/publish-headless`                | Build + publish the 7 headless libraries (npm / NuGet).|
| `bin/generate-registries`             | Regenerate example-app registries from the catalog.  |
| `bin/check-links`                     | Verify relative markdown links resolve.              |
| `bin/check-theme`                     | Conformance checks for the 45 reference themes.      |
| `bin/generate-theme-tokens`           | DTCG token source: extract / generate / drift-check. |
| `bin/generate-api-docs`               | Site canonical-contract sections from AGENTS metadata; drift-checked. |
| `bin/check-class-names`               | Every implementation in all 8 headless libraries carries its slug as the first token of a class list. |
| `bin/check-coverage`                  | Coverage drift matrix: per-component file presence across all 7 headless libraries. |
| `bin/generate-component-categories`   | Regenerate `components-categories.tsv` (per-component HTML tag + category) from `components.tsv`. |
| `bin/new-component`                   | End-to-end scaffolder for one new placeholder component. |
| `bin/generate-examples`               | Per-component usage examples (from the docs) and rendered variants (`component-variants.json`) for every demonstration page. |
| `bin/generate-site-pages`             | Docs-site component pages: rebuilds placeholders from `index.md`, refreshes every Example section. |
| `bin/generate-sitemap`                | Docs-site `sitemap.xml` from the SvelteKit route tree (`--check` for drift). |
| `bin/smoke-packages`                  | Pack + install every headless + npm helper tarball into a scratch consumer and render it. |
| `bin/make-github-pages`               | Push the docs site subtree to its `github-pages` remote; invoked by `make github-pages`. |

A root `Makefile`'s `github-pages` target wraps `bin/make-github-pages`
as a memorable entry point. See
[monorepo-github-pages](monorepo-github-pages/index.md).

Note on syncing: two syncs run from the canonical root. `bin/sync-special-files`
propagates the top-level special files (LICENSE, CONTRIBUTING, SECURITY,
GOVERNANCE, …) into all 51 published repositories — a public
repository without a LICENSE is "all rights reserved" whatever the
monorepo says (see [special-files-for-public-repos](special-files-for-public-repos/index.md)).
`bin/sync` copies the canonical root `AGENTS.md`/`AGENTS/*.md` into
subprojects via `rsync`, not symlinks (`git subtree push` doesn't
follow symlinks across project boundaries).

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

[Reuters Graphics components](https://github.com/reuters-graphics/graphics-components)
inspired Lily's editorial/scrollytelling primitives (`article-layout`,
`content-block`, `headline`, `byline`, `scroller*`, `feature-photo`,
`tile-map`, `visible`, `theme-provider`). Reuters is Svelte-specific
with SCSS; Lily adapts the patterns to its headless, zero-CSS approach
and excludes Reuters-specific branding. Full mapping and adaptation
table: [spec/citations/](citations/index.md), [spec/theme/](theme/index.md).

## 11. Acceptance criteria

The criteria below describe the **complete** Lily Design System. Anything
checked is considered live work; anything unchecked is queued in §12.

### 11.1 Catalog & docs

- [x] Canonical component list defined (571 components in `components.tsv`).
- [x] CSS style sheet template covers every component class hook.
- [x] All 571 components have a directory in `components/` with `index.md`,
      `README.md` (symlink), `AGENTS.md`, `spec/index.md`.
- [x] All 571 components have separate "When to Use" and "When Not to Use"
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
      Angular, Blazor, Nunjucks), each fully verified. Per-framework
      npm/NuGet publish status: [CHANGELOG.md](../CHANGELOG.md).
- [x] All 7 example subprojects exist (HTML+CSS+JS, SvelteKit, Next.js,
      Nuxt.js, Angular + Analog.js, Blazor Web, Nunjucks Eleventy).
- [x] All 8 helper subprojects exist (Svelte canonical, plus React, Vue,
      Angular, HTML, Nunjucks, Blazor and Web Components ports), each shipping the
      eight `*-picker` helpers plus `picker-bar` (64 `*-picker` packages;
      `motion-picker` added 2026-09-03, `search-picker` 2026-10-02).
      Per-catalog test counts: [spec/testing/](testing/index.md); the
      accessibility-hardening sweeps that produced the current counts: §14.1.
- [x] All 23 subprojects have required files (`index.md`, `README.md`
      symlink, `AGENTS.md`, `spec/index.md`, `.git-subtree-push`).
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

### 11.4 Verified (point-in-time snapshots; catalog counts updated to 490 on 2026-07-03, then 491 on 2026-07-07 with `image-cropper`)

> Full per-framework test counts, Storybook coverage, and Playwright
> e2e counts live in [spec/testing/index.md](testing/index.md) —
> kept there rather than duplicated here. This section holds only the
> catalog-implementation checklist and a one-line pointer per suite;
> re-run the suites for current numbers.

- [x] `css-style-sheet-template.css` audit: 490 / 490 canonical slugs have
      a class hook; 3 additional documented sub-element hooks
      (`accordion-checkbox-input`, `accordion-checkbox-label`,
      `accordion-checkbox-panel`).
- [x] All 7 headless and 7 example subprojects implement all 491
      canonical components in the same canonical layout, including the
      national personal identifier components (Phase 2 per-subproject
      implementation, spec §11.8) and the Angular pair (angular-headless
      ships 490 / 490 working `.ts` + `.spec.ts` + `.stories.ts` triplets
      as of its 2026-05-30 verification; catalog counts have grown since).
- [x] Cross-subproject name consistency: TabGroup removed,
      `medical-record-red-box` renamed; no orphans remain.
- [x] Per-framework unit test suites cover every component in every
      headless subproject and helper catalog (re-verified 2026-09-02,
      all passing) — counts and runners: [spec/testing/index.md](testing/index.md).
- [x] Per-framework CSS class-name audit: `bin/check-class-names` (2026-10-06) — all 571
      components in each of the 7 full-catalog headless libraries, and 536 of 536 in Web
      Components, carry their canonical kebab-case base class as the first token of a class
      list; part of `bin/test` and CI.
- [x] Storybook story coverage: 491 / 491 in svelte, react, vue, html,
      nunjucks, angular; Blazor deliberately has none — detail:
      [spec/testing/index.md](testing/index.md).
- [x] Playwright e2e coverage on all 7 example apps (9,007 specs total
      as of 2026-09-02, up from 5,852 on 2026-08-26 as rtl-demo,
      theme-switching, site-preferences, and a full 491-page axe-catalog
      sweep landed) — per-app counts: [spec/testing/index.md](testing/index.md).
      P1-T6's fresh sweep found and fixed two real, previously-undetected
      defects rather than just restamping dates — see §14.1.

### 11.5 Accessibility audit (axe-core via Playwright)

Per-app axe-core baseline and the WCAG rule set live in
[spec/accessibility/index.md](accessibility/index.md); all 7 example
apps are clean on their full route baseline as of 2026-09-02 (re-verified,
plan P1-T6). svelte-sveltekit's full 491/491 per-component catalog sweep
(`e2e/axe-catalog.spec.ts`) is clean again too — see §11.5a and §11.5b.

### 11.5a–b Full-catalog axe sweeps (2026-08-27, 2026-09-02)

The two sweep write-ups (24 demo-markup/theme/token defects, then the `scrollable-region-focusable`
code-snippet finding) moved to [history](history/index.md)
— they are dated records, not current state. The current baseline is in [accessibility](accessibility/index.md).

### 11.6 Responsive viewport sweep

Ported to all 7 example apps across 4 viewport sizes (mobile, tablet,
desktop, 4K), asserting skip-link presence, `<main>`/H1 visibility,
and no horizontal overflow. Re-verified clean 2026-09-02. Per-app route
shapes and the exact viewport sizes: [spec/testing/index.md](testing/index.md).

### 11.7 Storybook coverage

491 / 491 stories in svelte, react, vue, html, nunjucks, angular (6
of 7 full-catalog headless libraries, and the Web Components
catalog ships 456/456, its full achievable scope); Blazor deliberately
has none — there is no
idiomatic `@storybook/blazor`, and bUnit + `dotnet watch` covers the
same exploration use case. Angular uses the webpack-based
`@storybook/angular` builder rather than Vite. Re-verified clean
2026-09-02 by story-file presence. Full table:
[spec/testing/index.md](testing/index.md).

### 11.8 Open backlog

Completed items are recorded in [CHANGELOG.md](../CHANGELOG.md) and §12. The `DateRange`/`ReviewDate`
item that stood here was closed 2026-10-06: `DateRange` is a `<fieldset>` holding two `<input type="date">`
in every library, and `ReviewDate` is a `<time>` in every library (see the CHANGELOG). Open work is
tracked in [tasks.md](../tasks.md) Phase 9.

The completed items (Angular end-to-end verification, Blazor and HTML axe/responsive fixes, the
Angular wrapper-host semantics fix) moved to [history](history/index.md)
on 2026-10-06; CHANGELOG.md records each.

## 12. Implementation status

### 12.1 Completed work

The full release-by-release record lives in
[CHANGELOG.md](../CHANGELOG.md) (and §14.1 highlights). Summary of the
completed epochs:

- **Catalog & infrastructure** — canonical list (now 491), CSS
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

Backlog items live in §11.8 and are not duplicated here. New work items added
during ongoing development should be appended there (or to the appropriate
section), not into a separate `tasks.md`.

## 13. Roadmap

Near-term focus: the open Phase 9 items in [tasks.md](../tasks.md) (the CSS class-name audit for all
571 components, the deferred Baby UI ideas);
expand composed-page demos beyond the required routes.

Long-term: versioned releases per subproject npm/NuGet package
(started — see §14.1); contributor onboarding documentation
(currently informal).

## 14. Tracking

- Package: lily
- Version: 0.9.0
- Created: 2025-08-09
- Updated: 2026-10-06
- License: `MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause`
  (SPDX expression; or contact for other terms). See
  [LICENSE.md](../LICENSE.md) — it is the single source of truth, and every
  package manifest carries the same expression.
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [components.tsv](../components.tsv) (571 rows, tab-separated:
  slug, name, description)
- Companion docs: [AGENTS.md](../AGENTS.md), [AGENTS/*.md](../AGENTS/),
  [index.md](../index.md), [CHANGELOG.md](../CHANGELOG.md)
- Subtree pushes: see each subproject's `.git-subtree-push` file

### 14.1 Changelog highlights

The dated, per-event narrative moved to [history](history/index.md) on 2026-10-06 (it had
grown to more than half of this file). [CHANGELOG.md](../CHANGELOG.md) remains the
canonical release record. Most recent events, newest first:

- **`link-picker` and a leftmost link picker in `picker-bar` (2026-10-07)** — an eighth `*-picker`: a home icon opening a
  disclosure of page links the app defines (Home, About Us, Contact Us, Privacy Policy, …), in all eight catalogs, with
  `picker-bar` 0.3.0 rendering it first when given `links`. See [link-picker](link-picker/index.md).
- **Documentation sweep (2026-10-06)** — counts, versions, contracts and AI-facing files
  brought up to date across the spec, `AGENTS/`, READMEs, `llms.txt`/`llms.json`, the Claude
  Skills and the docs site; `spec/index.md` cut from 68 KB to a size that loads into context.
- **Demonstration pages render real examples (2026-10-06)** — every example app and the docs
  site show the demo's markup, live-rendered variants and a real usage example;
  `bin/generate-examples` and `bin/generate-site-pages`; the 80 placeholder docs-site pages
  were rebuilt from `components/{slug}/index.md`. See [examples](examples/index.md).
- **Headless 0.4.0 released (2026-10-06)** — 16 new components (catalog 555 → 571): seven
  charts, `streaming-text`, `tool-call` + five inner parts, `mark`, `chat-composer`.
- **Headless 0.3.0 released (2026-10-05)** — 16 components from the Baby UI triage plus the
  breaking graphic + data-table structure for all charts; the picker tooltips; `NUGET_USER`
  must be the policy creator's username, not the owning organization.
- **Picker tooltips (2026-10-04)** — every picker gains a hoverable, dismissable
  `role="tooltip"`; see [helpers](helpers/index.md).

---

Lily™ and Lily Design System™ are trademarks.
