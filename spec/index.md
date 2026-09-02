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
| [architecture](architecture/index.md) | Monorepo layout, the 14 implementation subprojects + 7 helper catalogs, `themes/`, the git-subtree model, required files. |
| [headless](headless/index.md) | Headless design rules: semantic markup, class hooks, rest-props, behaviour boundaries, zero CSS. |
| [accessibility](accessibility/index.md) | WCAG 2.2 AAA target, WAI-ARIA APG patterns, ARIA reference table, axe-core baselines. |
| [internationalization](internationalization/index.md) | No hardcoded strings, stable text-prop names, locale-aware props, RTL/bidi. |
| [theme](theme/index.md) | Token shape, `--theme-*` custom properties, `data-theme` variants, the headless forbidden-list. |
| [components](components/index.md) | The 491-component catalog, suffix→element mapping, name patterns, composition, per-component docs. |
| [examples](examples/index.md) | Example apps, the three required routes, NHS reference styling, demo render mechanisms. |
| [tooling](tooling/index.md) | The `bin/` scripts, the rsync sync model, `bin/test` verification, subtree push. |
| [monorepo-github-pages](monorepo-github-pages/index.md) | Publishing the docs site via git subtree to a read-only sibling export repo. |
| [testing](testing/index.md) | Per-framework test suites, Storybook coverage, Playwright e2e, axe, responsive sweep. |
| [frameworks](frameworks/index.md) | The seven framework pairs, per-framework file shapes and idioms, the copy-pattern. |
| [helpers](helpers/index.md) | The `*-helpers` catalogs: the 5 pickers, their contracts, manifests, and publish pipeline. |
| [national-identifiers](national-identifiers/index.md) | The 92 national personal identifier components, normalization, validation algorithms. |
| [trusted-publishing](trusted-publishing/index.md) | OIDC publishing to npm/NuGet: the adoption position, readiness table, checklist. |
| [free-open-source-funding](free-open-source-funding/index.md) | Funding channels (GitHub Sponsors live, Open Collective planned), terms, and the files that must agree. |
| [special-files-for-public-repos](special-files-for-public-repos/index.md) | The top-level files every published subtree repo carries, copy-vs-generate, the sync tooling. |
| [dependabot](dependabot/index.md) | Repo-level security updates: the grouped-weekly-PR `.github/dependabot.yml`, 31 entries. |
| [node-current-version](node-current-version/index.md) | The Node 26 requirement: `engines.node` across all `package.json` files and `deploy.yml`. |
| [agent-skills](agent-skills/index.md) | The `lily-design-system-skill` (end-user) and `lily-design-system-maintainer-skill` (maintainer) Claude Skills, what each covers, and the naming-split retirement. |
| [llms-json-and-llms-txt](llms-json-and-llms-txt/index.md) | The root and docs-site `llms.txt`/`llms.json` AI guidance files, the llms.txt convention, and why the two pairs' links differ. |
| [citations](citations/index.md) | Design systems Lily learns from, the NHS UK reference, Reuters Graphics influence. |
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
- Seven headless component libraries: HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks.
- Seven example applications: HTML+CSS+JS, SvelteKit, Next.js, Nuxt.js,
  Angular Analog, Blazor Web, Nunjucks Eleventy.
- A CSS style-sheet template (`css-style-sheet-template.css`) declaring every
  component class hook.
- Component documentation per component (`components/{slug}/index.md`,
  `AGENTS.md`, `CLAUDE.md`, `spec/index.md`).
- Seven framework-helper catalogs (`*-helpers`), each shipping the
  `theme-picker`, `locale-picker`, `text-size-picker`, `share-picker`, and
  `date-time-picker` helper packages — 35 packages in all.
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
`AGENTS/*.md`, `themes/`); 21 implementation subprojects hang off it —
7 headless libraries, 7 example apps, and 7 helper catalogs, one per
framework (HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks). Each
subproject is also a `git subtree` pushed to its own standalone remote
via `bin/git-subtree-push`. Full directory tree, the per-framework
table, and the git-subtree/multi-forge publishing model:
[spec/architecture/](architecture/index.md).

### The three subproject layers

- **Headless** (7 subprojects) — framework libraries mirroring the full
  491-component catalog: unstyled, accessible, zero CSS.
- **Examples** (7 subprojects) — complete styled reference applications
  demonstrating every component with the NHS UK visual reference.
- **Helpers** (7 subprojects) — small catalogs of opinionated packages,
  each owning one complete interaction end to end: `theme-picker`,
  `locale-picker`, `text-size-picker` (icon button + APG listbox,
  own a user preference), `share-picker` (an action), and
  `date-time-picker` (a form value) — 35 packages, SSR-safe, Svelte
  canonical. See [spec/helpers/](helpers/index.md).

### Required files

Every subproject and every component directory carries the same core
set — `index.md`, `README.md` (symlink to `index.md`), `AGENTS.md`,
`CLAUDE.md`, `spec/index.md` — plus `.git-subtree-push` for
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

**Current count: 491 components.**

The catalog spans forms, navigation, tables, layout, editorial /
scrollytelling, data visualisation, media, overlays, pickers and
ratings, semantic entities, and 92 national personal identifier
components (46 identifier types × `-input` + `-view` across 30+
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
- Consistent voice across all 491 components.

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
| `bin/sync-special-files`              | Propagate the top-level special files into all 22 public repos. |
| `bin/update`                          | Update shared files.                                 |
| `bin/git-subtree-push`                | Push each subtree to its standalone remote.          |
| `bin/generate-storybook-stories.mjs`  | Generate Storybook stories.                          |
| `bin/publish-helpers`                 | Build + publish the 35 helper packages (npm / NuGet).|
| `bin/publish-headless`                | Build + publish the 7 headless libraries (npm / NuGet).|
| `bin/generate-registries`             | Regenerate example-app registries from the catalog.  |
| `bin/check-links`                     | Verify relative markdown links resolve.              |
| `bin/check-theme`                     | Conformance checks for the 45 reference themes.      |
| `bin/generate-theme-tokens`           | DTCG token source: extract / generate / drift-check. |
| `bin/generate-api-docs`               | Site canonical-contract sections from AGENTS metadata; drift-checked. |
| `bin/check-coverage`                  | Coverage drift matrix: per-component file presence across all 7 headless libraries. |
| `bin/generate-component-categories`   | Regenerate `components-categories.tsv` (per-component HTML tag + category) from `components.tsv`. |
| `bin/new-component`                   | End-to-end scaffolder for one new placeholder component. |
| `bin/smoke-packages`                  | Pack + install every headless + npm helper tarball into a scratch consumer and render it. |
| `bin/make-github-pages`               | Push the docs site subtree to its `github-pages` remote; invoked by `make github-pages`. |

A root `Makefile`'s `github-pages` target wraps `bin/make-github-pages`
as a memorable entry point. See
[monorepo-github-pages](monorepo-github-pages/index.md).

Note on syncing: two syncs run from the canonical root. `bin/sync-special-files`
propagates the top-level special files (LICENSE, CONTRIBUTING, SECURITY,
GOVERNANCE, …) into all 22 published subtree repositories — a public
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

- [x] Canonical component list defined (491 components in `components.tsv`).
- [x] CSS style sheet template covers every component class hook.
- [x] All 491 components have a directory in `components/` with `index.md`,
      `README.md` (symlink), `AGENTS.md`, `CLAUDE.md`, `spec/index.md`.
- [x] All 491 components have separate "When to Use" and "When Not to Use"
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
- [x] All 7 helper subprojects exist (Svelte canonical, plus React, Vue,
      Angular, HTML, Nunjucks, Blazor ports), each shipping the five
      `*-picker` helpers (35 packages). Per-catalog test counts:
      [spec/testing/](testing/index.md); the accessibility-hardening
      sweeps that produced the current counts: §14.1.
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
- [x] Per-framework CSS class-name audit: 490 / 490 components in every
      headless subproject reference their canonical kebab-case base class.
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

### 11.5a Full-catalog sweep findings (2026-08-27)

The first axe pass over all 491 `/components/{slug}` pages (plan
P4-T1) found 24 failures in 7 rule families, every one a real defect:

- **Demo-markup defects (21 entries in the canonical demo map, fixed
  and regenerated into every app):** `role="radio"` without
  `aria-checked` across the four rating-picker families;
  `menuitem`/`tab` roles rendered without their required
  `menu`/`menubar`/`tablist` parents; unlabelled inputs in the form,
  task-list and date-time-now demos (the last was outright corrupted
  markup); an unnamed `<select>` and listbox; `<dt>/<dd>` inside an
  `<ol>` in the summary-list demos; and a mockup-shell demo whose
  inline light background fought the theme's white text.
- **Shared theme-body defects (fixed in all 45 themes):** `.video-player`
  set a black background without pairing a text colour, and
  `.call-to-action` left inner links on the UA default blue over the
  primary fill.
- **Token defects (fixed in the DTCG source):** four NHS themes'
  accent colour was too light for white accent-content at small sizes
  (ai-label); darkened to L=0.52 with the reasoning recorded in each
  token's `$description`.

### 11.5b Second full-catalog sweep finding (2026-09-02, plan P1-T6)

Re-running `e2e/axe-catalog.spec.ts` (P1-T6's fresh verification sweep)
found a new, unrelated regression: dozens of `/components/{slug}` pages
whose Usage/Import code snippet is long enough to overflow — mostly the
national personal identifier components, whose names are the longest in
the catalog — failed axe's `scrollable-region-focusable` rule. The
page's own app-shell CSS makes an overflowing `<pre>` horizontally
scrollable (`overflow-x: auto`, to stop a long line breaking page
layout) but the `<pre>` carried no `tabindex`, so keyboard users had no
way to actually scroll it. Fixed by adding `tabindex="0"` to the two
Usage/Import `<pre>` elements on the component-detail page — confirmed
via a full 491/491 re-run, not just the one failing page inspected first.
The same bare-`<pre>`-with-long-content shape exists in the other six
example apps' dynamically-generated component-detail pages (none of
them run an exhaustive per-catalog axe sweep, so none had a failing
test to catch it — nunjucks-eleventy-examples is the exception, since
its 491 component pages are hand/generator-authored static files that
mostly don't embed a code snippet at all), so the same `tabindex="0"`
was applied to those six as a precaution; only svelte-sveltekit's fix
is backed by an exhaustive re-run, but each app's own
`accessibility.spec.ts` sample stayed green after the change. Full
record: CHANGELOG.md.

### 11.6 Responsive viewport sweep

Ported to all 7 example apps across 4 viewport sizes (mobile, tablet,
desktop, 4K), asserting skip-link presence, `<main>`/H1 visibility,
and no horizontal overflow. Re-verified clean 2026-09-02. Per-app route
shapes and the exact viewport sizes: [spec/testing/index.md](testing/index.md).

### 11.7 Storybook coverage

491 / 491 stories in svelte, react, vue, html, nunjucks, angular (6
of 7 headless libraries); Blazor deliberately has none — there is no
idiomatic `@storybook/blazor`, and bUnit + `dotnet watch` covers the
same exploration use case. Angular uses the webpack-based
`@storybook/angular` builder rather than Vite. Re-verified clean
2026-09-02 by story-file presence. Full table:
[spec/testing/index.md](testing/index.md).

### 11.8 Open backlog

Completed items are recorded in [CHANGELOG.md](../CHANGELOG.md) and §12;
this list holds only what is genuinely open.

- [x] Angular subprojects end-to-end verification — closed 2026-08-26.
      angular-headless was already fully verified (§11.2). The
      angular-examples app now emits **full-content static SSG HTML**:
      the route layer was moved off Analog's file-route convention onto
      an explicit 15-route table with plain lazy imports
      (`src/app/views/`, `app.routes.ts`), because the upstream
      injection defect — filed as
      [analogjs/analog#2498](https://github.com/analogjs/analog/issues/2498) —
      had regressed to an empty router in every mode, and even a
      self-owned `import.meta.glob` received empty modules for
      `.page.ts` files. Full record:
      [analog-ssg-notes.md](../lily-design-system-angular-examples/docs/analog-ssg-notes.md).
      The app also gained the canonical detail-page shape (PascalCase
      H1, description, back link) backed by a generated
      `components-data.ts` registry.
- [x] Playwright e2e against angular-examples: landed 2026-08-26,
      1,542 specs green (see §11.4). angular-headless remains covered
      by its vitest + Storybook layers, matching the other headless
      libraries — none of which has a Playwright layer.
- [x] Blazor example app axe/responsive failures: resolved 2026-08-26.
      The 5 checks measured failing on the pre-theme tree pass under
      the theme-layer app (72/72 including theme switching) — the
      overflow went with the shared theme guards, and the
      document-title cases were circuit-timing flakes the reworked
      run no longer hits.
- [x] HTML example app axe + responsive suite failures: resolved
      2026-08-30 (commit `760f7e18b`). Two real defects: `responsive.spec.ts`'s
      composed-page routes used trailing-slash directory URLs against an
      app that serves flat `.html` files (404s, 20/40 checks); switched to
      `/{slug}.html`, matching `accessibility.spec.ts`'s existing shape.
      `navigation-and-menus.html`'s two dropdown menus wrapped
      `role="menuitem"` `<li>` in a bare `<ul>` inside `role="menu"` (axe
      `list`/`aria-required-children`); fixed to the canonical
      `<div role="menuitem">` contract with no list markup. Chasing the
      axe failure also found a flaky color-contrast violation on the
      same page's mobile-menu button — the same parser-blocking-vs-
      dynamically-appended-stylesheet race already fixed for Blazor's
      `/components/dialog` (P7-T17) — fixed with the same
      `gotoAndWaitForTheme` wait. `accessibility.spec.ts` clean 29/29
      across 5 repeats; full `e2e/` suite 903/903.
- [x] **Angular headless wrapper-host semantics.** Closed 2026-09-01
      (angular-headless 0.3.0, breaking). The first-ever axe run
      against the Angular app had shown that element-selector
      components break DOM structures with required parent-child
      semantics: the `<ol>` rendered by `lily-breadcrumb-list`
      contained `<lily-breadcrumb-list-item>` hosts, not `<li>` (axe
      `list` / `listitem`, serious). Fixed at the library level for
      the 51 affected components (the 20 `*ListItem` families, the 30
      table sub-elements across `table`/`data-table`/`calendar-table`/
      `kanban-table`/`gantt-table`, and `Option`): each now uses a
      combined tag+attribute selector on its native tag
      (`li[lily-breadcrumb-list-item]`, per Angular Material's own
      idiom for list/table sub-elements) instead of wrapping it, so
      there is no host element between a parent and a child with a
      required content-model relationship. The four composed pages
      (`page-layout`, `task-management`, `timeline-and-cards`,
      `book-an-appointment`) and `rtl-demo` that had been carrying a
      direct-class-hook-markup workaround for this now use the real
      components again. Verification: angular-headless `vitest run`
      491/491 files / 1011/1011 tests, `ng-packagr` build clean;
      angular-examples build + 507-page prerender clean, full
      Playwright suite 1574/1574 (including axe on every route this
      touched). Full record: angular-headless's own
      `spec/index.md`. The empty `date-range`/`review-date`
      `aria-prohibited-attr` finding from the same axe run is a
      separate, still-open defect (those components render `<div>`
      instead of the canonical `<span>`) — not fixed by this change;
      still worked around with direct class-hook markup in
      `timeline-and-cards.ts`.

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

Near-term focus: close the remaining §11.8 backlog item (Angular
headless wrapper-host semantics); expand composed-page demos beyond
the required routes.

Long-term: versioned releases per subproject npm/NuGet package
(started — see §14.1); contributor onboarding documentation
(currently informal).

## 14. Tracking

- Package: lily
- Version: 0.6.0
- Created: 2025-08-09
- Updated: 2026-09-02
- License: `MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause`
  (SPDX expression; or contact for other terms). See
  [LICENSE.md](../LICENSE.md) — it is the single source of truth, and every
  package manifest carries the same expression.
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [components.tsv](../components.tsv) (491 rows, tab-separated:
  slug, name, description)
- Companion docs: [AGENTS.md](../AGENTS.md), [AGENTS/*.md](../AGENTS/),
  [index.md](../index.md), [CHANGELOG.md](../CHANGELOG.md)
- Subtree pushes: see each subproject's `.git-subtree-push` file

### 14.1 Changelog highlights

- **NuGet Trusted Publishing adopted, GitHub only (2026-09-02)** — the
  real P2-T2 publish attempt failed on a missing `NUGET_API_KEY`
  secret (never configured, not broken). Adopted OIDC
  [Trusted Publishing](trusted-publishing/index.md) for NuGet instead
  of minting a long-lived key: `publish.yml` gained a `NuGet/login@v1`
  step (real-mode only) exchanging the job's GitHub OIDC token for a
  1-hour nuget.org key. Deliberate exception to "adopt when the whole
  fan-out is covered" — GitHub was already the only forge that could
  publish to NuGet, so nothing was demoted; npm keeps `NPM_TOKEN`
  pending its real Codeberg gap. `MAINTAINERS.md`, `SECURITY.md`,
  `docs/releasing.md`, and the trusted-publishing spec updated in the
  same change. Two steps remain outside this repo: the maintainer
  registering the nuget.org trusted-publisher policy and adding a
  `NUGET_USER` secret. Full record: [CHANGELOG.md](../CHANGELOG.md).
- **AI attribution and publish authority revised (2026-09-02)** —
  two maintainer-directed governance reversals. `AI_STATEMENT.md` §4/§10
  now permit (and CONTRIBUTING.md recommends) a `Co-Authored-By:`
  trailer naming the AI tool on a commit — disclosure, not authorship
  or a sign-off; git's `Author`/`Committer` fields still always name
  the human. And a new [GOVERNANCE.md](../GOVERNANCE.md) § AI agent
  publish authority authorizes an agentic session to decide a specific,
  already-prepared release meets a written readiness checklist and
  execute the real publish, without asking each time — what a release
  *contains* stays the maintainer's alone. Full record: CHANGELOG.md.
- **P7-T11 angular-examples' 491 component specs fixed (2026-09-02)** —
  two prior investigations blamed a triplicated `@angular/core`
  dependency tree for every `setInput()` assertion silently failing;
  that tree had since converged to one copy via ordinary updates, and
  the real cause was a missing `tsconfig.spec.json` (the file
  `@analogjs/vite-plugin-angular` looks for to know which files are in
  its Angular-compiler program) — angular-headless had one,
  angular-examples never did. Added it, widened `vitest.config.ts`,
  added the matching `vitest-setup.ts`; all 492 spec files now pass,
  990/990 tests, no per-component changes needed. Full record:
  CHANGELOG.md.
- **LilyDesignSystem.Blazor.Headless 0.1.1 (2026-09-02)** — fixed a
  real nuget.org "Readme missing" package-validation warning on the
  already-published 0.1.0: the 5 Blazor helper packages already
  embedded their README via the standard `<PackageReadmeFile>` +
  `<None Include>` pair, but the headless package was missed. Added
  it; verified the packed `.nupkg` actually contains the readme
  content and the `.nuspec` references it. Full record: CHANGELOG.md.
- **P7-T12 pnpm version skew resolved (2026-09-02)** — set out to pick
  one pnpm major for the whole monorepo (CI mixed 10 and 11; this
  machine's tooling is 11) and found the version split wasn't the real
  problem: four `pnpm-workspace.yaml` files carried an unfilled
  template placeholder instead of `true` for their `allowBuilds`
  entries, and ten subprojects gitignored that file instead of
  committing it, so the committed repo state had no build-script
  allowlist for them at all under pnpm 11
  (`[ERR_PNPM_IGNORED_BUILDS]`). Fixing both also fully explains and
  corrects the prior day's note blaming this sandbox's network egress
  for html-headless's WebdriverIO suite — the real cause was
  chromedriver's own postinstall script being silently ignored, so it
  was never cached. Removed the now-redundant legacy
  `package.json#pnpm.onlyBuiltDependencies` field from all 13
  subprojects that had it, and moved `ci.yml`/`publish.yml` fully onto
  pnpm 11. Full record: CHANGELOG.md.
- **P1-T6 fresh verification sweep (2026-09-02)** — re-ran every suite
  in §11.4–§11.7 for real (not a restamp) across all 21 subprojects:
  unit (7 headless + 7 helper catalogs), Storybook coverage (file
  presence), and Playwright e2e + axe-core + responsive on all 7
  example apps. Found and fixed three real, previously-undetected
  defects rather than just refreshing dates: (1) seven table/gantt e2e
  spec files (`table-th`, `calendar-table-th`, `data-table-th`,
  `kanban-table-th`, `gantt-table-thead`, `gantt-table-tbody`,
  `gantt-table-tr`) asserted the wrong PascalCase heading name across
  all three JS frontend apps (svelte-sveltekit, react-next, vue-nuxt —
  21 files); (2) a scrollable-but-not-focusable `<pre>` code snippet on
  long-named component-detail pages (axe `scrollable-region-focusable`)
  — see §11.5b; (3) vue-nuxt-examples' locale-picker never restored a
  persisted locale on reload, because its Nuxt `useHead`-driven
  external ref was seeded with a concrete default value instead of
  empty, defeating the picker's own value-over-storage priority chain
  — fixed by seeding it empty, plus a `gotoAndWaitForTheme` hardening
  for a pre-existing, confirmed-flaky dynamically-appended-stylesheet
  race in that app's `accessibility.spec.ts` (same class of bug already
  fixed for Blazor and html-css-js-examples). Total e2e specs 5,852 →
  9,007, all green; angular-headless's own unit count grew 985 → 1,011
  and blazor-headless's 1,502 → 1,509 as a side effect of the §11.8
  attribute-selector migration's added regression tests. html-headless's
  WebdriverIO run could not be re-executed in this sandbox; at the time
  this was recorded as a confirmed chromedriver-download network block,
  but P7-T12 (2026-09-02) found and fixed the real cause — see
  spec/testing/index.md's html-headless row. Full record: CHANGELOG.md.
- **Angular headless wrapper-host semantics fixed (2026-09-01,
  angular-headless 0.3.0, breaking)** — closed the §11.8 open backlog
  item measured on the Angular app's first axe run. 51 components
  (the 20 `*ListItem` families, the 30 table sub-elements across
  `table`/`data-table`/`calendar-table`/`kanban-table`/`gantt-table`,
  and `Option`) switched from an element selector that wrapped their
  native tag to a combined tag+attribute selector on the native tag
  itself (`li[lily-breadcrumb-list-item]`, Angular Material's own
  idiom for list/table sub-elements), so a required parent-child
  content-model relationship (`<ol>`+`<li>`, `<table>`+`<thead>`, etc.)
  no longer has a wrapper element sitting inside it. The four composed
  pages and `rtl-demo` that had been carrying a direct-class-hook-
  markup workaround for exactly this now use the real components
  again. 491/491 vitest files (1011 tests), `ng-packagr` build clean,
  angular-examples build + 507-page prerender clean, full Playwright
  suite 1574/1574. `DateRange`/`ReviewDate` rendering `<div>` instead
  of the canonical `<span>` — a separate finding from the same axe
  run — remains open. Full record: angular-headless's own
  `spec/index.md`.
- **HTML example app axe + responsive suite failures resolved
  (2026-08-30)** — closed the §11.8 open backlog item measured
  2026-08-26. Two real defects, plus one flaky one found while chasing
  them: `responsive.spec.ts` composed-page routes used trailing-slash
  directory URLs against an app serving flat `.html` files (404s);
  `navigation-and-menus.html`'s dropdown menus wrapped `role="menuitem"`
  `<li>` in a bare `<ul>` (axe `list`/`aria-required-children`); and a
  parser-blocking-stylesheet race gave a flaky color-contrast finding on
  the same page, fixed with the `gotoAndWaitForTheme` wait already used
  for the parallel Blazor fix (P7-T17). No test cases added or removed;
  `accessibility.spec.ts` clean 29/29 across 5 repeats, full `e2e/`
  903/903. Also corrected long-standing drift: the national personal
  identifier catalog grew from its initial 80 components / 40 types
  (0.2.0, 2026-05-24) to the current **92 components / 46 types**
  (`AGENTS/national-person-identifiers.tsv`, committed 2026-05-30) but
  the old 80/40 figures had persisted in prose across the spec, both
  Claude Skills, `llms.txt`/`llms.json`, and the root special files —
  corrected repo-wide. Full record: [CHANGELOG.md](../CHANGELOG.md).
- **Pointer-selection close is now part of the contract (2026-07-31)**
  — clicking an option already closed the listbox in all seven
  catalogs, but only the keyboard clause said so; the pointer clause
  just said "selects and applies". The contract now reads "selects it,
  applies it, and closes the listbox" everywhere, and every pointer
  test asserts `aria-expanded` + `hidden`. Full record:
  [CHANGELOG.md](../CHANGELOG.md).
- **Idempotent apply in the preference pickers (2026-07-31)** — the
  three preference helpers re-ran their apply step (and fired the
  consumer's change callback) on every re-evaluation, not only when
  the value changed; in Svelte this looped an ordinary `count += 1`
  callback into `effect_update_depth_exceeded`, freezing the picker
  mid-open. Apply is now a no-op for an already-applied value in
  svelte, html, nunjucks, and react (angular/vue/blazor were already
  clean). 1847 tests pass across the seven catalogs. Full record:
  [CHANGELOG.md](../CHANGELOG.md).
- **Sibling-picker accessibility hardening (2026-07-29)** — five
  defects fixed canonical-first then ported to all seven catalogs:
  Tab-out-of-open-picker focus preservation, APG typeahead cycling,
  PageUp/PageDown, an empty-list `aria-activedescendant` guard, and
  locale-picker defaulting to **endonym** labels ("Cymraeg" not
  "Welsh") with `lang` claimed only when true. 1835 tests pass. Full
  record: [CHANGELOG.md](../CHANGELOG.md).
- **date-time-picker accessibility hardening (2026-07-29)** — seven
  changes across all seven catalogs: vetoed days become `aria-disabled`
  + `data-disabled` (never plain `disabled`), dialog close returns
  focus to its opener, header paging no longer steals grid focus,
  optional `invalid`/`instructions` labels add a status region and
  keyboard help, field `Escape` reverts a pending edit, and
  click-outside now honours `aria-modal`. 1717 tests pass. Full
  record: [CHANGELOG.md](../CHANGELOG.md).
- **Helpers renamed to `*-picker` (2026-07-21)** — every helper package
  in all seven catalogs renamed: `theme-select` → `theme-picker`,
  `locale-select` → `locale-picker`, `text-size-select` →
  `text-size-picker`, `share-button` → `share-picker` (directories,
  package ids, exported symbols, CSS hooks, selectors, element tags).
  The catalog components `theme-select`/`theme-select-option` are
  **not** affected. Every package resets to **0.1.0** (nothing had
  been published under the old names). 1231 tests pass, unchanged
  counts. Full record: [CHANGELOG.md](../CHANGELOG.md).
- **Helpers — text-size-select 0.2.0, share-button 0.1.0 (2026-07-21)**
  — `text-size-select` drops the native `<select>` for the same icon
  button + APG listbox as its siblings (glyph `"A"`, U+0041). A new
  `share-button` helper lands — the first to own an *action* rather
  than a preference, applying and persisting nothing, with real `<a>`
  destinations rather than `role="menuitem"` and no bundled
  social-network endpoints. Full record: [CHANGELOG.md](../CHANGELOG.md).

Older epochs (full detail in [CHANGELOG.md](../CHANGELOG.md), one entry
per version):

- **0.6.0 (2026-07-03)** — Tooling hardening: `bin/test` exits non-zero
  on failure and cross-checks catalog/registries; `bin/generate-registries`
  and `bin/check-links` land; theme-picker/locale-picker reach 0.2.0.
- **0.5.0 (2026-07-03)** — Spec-driven development moves to `spec/`
  directories everywhere; the helpers layer and 45 reference themes
  land; the theme-picker/theme-select naming collision is resolved
  (catalog goes from 492 to 490 components).
- **0.4.0 (2026-05-30)** — Catalog grows from 487 to 492: `question`,
  `answer`, reworked `comment`, `addressograph-box`, `barcode-image`,
  `draft`; `qr-code` renamed `qr-code-image`.
- **0.3.0 (2026-05-30)** — 7th headless + 7th example pair (Angular 20
  + Analog.js) land, fully verified. Canonical national-identifier
  reference files committed at root.
- **0.2.0 (2026-05-24)** — Initial 80 national personal identifier
  components added (since grown to 92 — see the 2026-08-30 entry
  above), bumping the canonical count from 407 to 492. axe-core and
  the responsive sweep land on every example app.

---

Lily™ and Lily Design System™ are trademarks.
