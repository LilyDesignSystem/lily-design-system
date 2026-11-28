# Lily Design System

Living specification: [spec/index.md](../spec/index.md)

[CSS style sheet template](../css-style-sheet-template.css)

Canonical component list: [components.tsv](../components.tsv) — 661 components.

## Subprojects for headless components

The seven framework pairs below are the canonical, full-catalog (661/661, with their national identifier add-ons)
headless libraries. Angular has every Svelte prop, or a recorded reason in `bin/check-port-logic.allow.json`, since 2026-11-06. An 8th headless catalog joined 2026-09-03:
[Lily Design System: Web Components headless](../lily-design-system-web-components-headless)
ships its full achievable scope: 626 of the 661 (since `mutually-exclusive` was removed, 2026-11-09)
components as native custom elements (no framework runtime). The other 35
are permanently excluded by a real architectural limitation (table
sub-elements and interactive `*ListItem` families — no wrapper-host-safe
registration mechanism exists for autonomous custom elements), not open
backlog. See its own `spec/index.md` for the architecture decisions
(autonomous custom elements over customized built-ins, light-DOM-only)
and the exact scope.

A 9th, [Lily Design System: Alpine.js headless](../lily-design-system-alpine-headless)
(added 2026-10-21; `@lilydesignsystem/alpine-headless`, first published 0.1.0 on 2026-11-14), covers all 661 components as annotated HTML
snippets (`components/{slug}.html`) plus one Alpine plugin (`lily-alpine.js`)
whose `Alpine.data` behaviours own state and keyboard for the interactive ones. Its example app is [`lily-design-system-alpine-examples`](../lily-design-system-alpine-examples); its six helpers are `lily-design-system-alpine-{data-grid,kanban-board,calendar,gantt-chart,markdown-editor,org-editor}` (`@lilydesignsystem/alpine-*`), each a subset of its Svelte reference. See its `spec/index.md`.

- [Lily Design System: HTML headless](../lily-design-system-html-headless)
- [Lily Design System: Svelte headless](../lily-design-system-svelte-headless)
- [Lily Design System: React headless](../lily-design-system-react-headless)
- [Lily Design System: Vue headless](../lily-design-system-vue-headless)
- [Lily Design System: Angular headless](../lily-design-system-angular-headless)
- [Lily Design System: Blazor headless](../lily-design-system-blazor-headless)
- [Lily Design System: Nunjucks headless](../lily-design-system-nunjucks-headless)

## Subprojects for headless national identifiers

The catalog's 661 components are 473 core components and 188 national personal identifier components (an `-input` and a
`-view` for each of 94 identifier types). Since 2026-11-18 each headless library ships the 473, and the 188 are an add-on
package per catalog, `lily-design-system-{framework}-headless-identifiers`: npm `@lilydesignsystem/{framework}-headless-identifiers`,
NuGet `LilyDesignSystem.Blazor.Headless.Identifiers`. Each keeps its catalog's file layout, so a root check finds an identifier
by its headless path with `-headless/` read as `-headless-identifiers/`; the Blazor one depends on the headless package (for
`ValueInputBase`), the others on nothing. `components.tsv` keeps all 661 rows (category `national` in
`components-categories.tsv`). Spec: [spec/headless-identifiers](../spec/headless-identifiers/index.md).

- [Svelte](../lily-design-system-svelte-headless-identifiers), [React](../lily-design-system-react-headless-identifiers),
  [Solid](../lily-design-system-solid-headless-identifiers), [Vue](../lily-design-system-vue-headless-identifiers),
  [Angular](../lily-design-system-angular-headless-identifiers), [HTML](../lily-design-system-html-headless-identifiers),
  [Web Components](../lily-design-system-web-components-headless-identifiers),
  [Nunjucks](../lily-design-system-nunjucks-headless-identifiers), [Alpine.js](../lily-design-system-alpine-headless-identifiers),
  [Blazor](../lily-design-system-blazor-headless-identifiers)

## Subprojects for web app examples

- [Lily Design System: HTML CSS JS examples](../lily-design-system-html-css-js-examples)
- [Lily Design System: Svelte SvelteKit examples](../lily-design-system-svelte-sveltekit-examples)
- [Lily Design System: React Next.js examples](../lily-design-system-react-next-examples)
- [Lily Design System: Vue Nuxt.js examples](../lily-design-system-vue-nuxt-examples)
- [Lily Design System: Angular Analog examples](../lily-design-system-angular-examples)
- [Lily Design System: Blazor Web examples](../lily-design-system-blazor-web-examples)
- [Lily Design System: Nunjucks Eleventy examples](../lily-design-system-nunjucks-eleventy-examples)
- [Lily Design System: Alpine.js examples](../lily-design-system-alpine-examples) (a static site built by `node build.mjs`)
- [Lily Design System: Solid examples](../lily-design-system-solid-examples) (a Vite single-page app on Solid Router 2.0)

There is no Web Components example app.

## Subprojects for native apps

- [Lily Design System: Swift](../lily-design-system-swift) — SwiftUI, iOS and iPadOS ([spec/apple-swift](../spec/apple-swift/index.md))
- [Lily Design System: Kotlin](../lily-design-system-kotlin) — Jetpack Compose, Android ([spec/android-kotlin](../spec/android-kotlin/index.md))
- [Lily Design System: .NET MAUI](../lily-design-system-maui) — native controls for Android, iOS, macOS and Windows, and the full catalog through Blazor Hybrid ([spec/dotnet-maui](../spec/dotnet-maui/index.md)); its example app is [`lily-design-system-maui-examples`](../lily-design-system-maui-examples)

## Subprojects for framework helpers

Each framework ships eleven `*-picker` helpers — theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, search-picker (added 2026-10-02), link-picker (added 2026-10-07: a home icon opening the page links the app defines), menu-picker and settings-picker (added 2026-10-08: a hamburger / a cog opening a dropdown of whatever the app provides), time-zone-picker (added 2026-10-24: time zones by UTC offset, named by Unicode CLDR in 64 languages), date-time-picker. The first ten are an icon button that opens a popup (`theme-picker` also has an opt-in native `<select>` variant, `variant="select"`, in all eight catalogs since 2026-10-30). `date-time-picker` is the exception: a form control, so it pairs a typeable text field with its trigger and opens an APG date-picker dialog. Svelte is the canonical reference; the other seven are idiom ports. Every framework's helpers are one top-level subproject per package (below), since 2026-10-10. Besides the pickers and `picker-bar`, each of the eight frameworks ships `data-grid`, `kanban-board`, `calendar`, `gantt-chart`, `filter`, `markdown-editor`, `org-editor`, `color-picker` and `locale-translations` (21 packages per framework; Nunjucks 22): 175 helper packages with Alpine's six.

The Svelte helpers (canonical reference) are one top-level subproject per package, since 2026-10-10 (the data grid since 2026-10-09); the `lily-design-system-svelte-helpers` catalog that held them is gone. `bin/list-helper-packages svelte` lists them in build order:

- [`lily-design-system-svelte-data-grid`](../lily-design-system-svelte-data-grid) — `@lilydesignsystem/svelte-data-grid`
- [`lily-design-system-svelte-color-picker`](../lily-design-system-svelte-color-picker) — `@lilydesignsystem/svelte-color-picker` — a colour picker: recent colours, a palette with Transparent, and entry by hex, CSS name, HSL, HSB, RGB or CMYK (added 2026-11-15; ported to the other seven catalogs the same day)
- [`lily-design-system-svelte-date-time-picker`](../lily-design-system-svelte-date-time-picker) — `@lilydesignsystem/svelte-date-time-picker`
- [`lily-design-system-svelte-filter`](../lily-design-system-svelte-filter) — `@lilydesignsystem/svelte-filter` — a filter builder that outputs JSON, SQL, MongoDB, OData or a predicate (added 2026-10-17; ported to all eight catalogs)
- [`lily-design-system-svelte-kanban-board`](../lily-design-system-svelte-kanban-board) — `@lilydesignsystem/svelte-kanban-board`
- [`lily-design-system-svelte-link-picker`](../lily-design-system-svelte-link-picker) — `@lilydesignsystem/svelte-link-picker`
- [`lily-design-system-svelte-locale-picker`](../lily-design-system-svelte-locale-picker) — `@lilydesignsystem/svelte-locale-picker`
- [`lily-design-system-svelte-menu-picker`](../lily-design-system-svelte-menu-picker) — `@lilydesignsystem/svelte-menu-picker`
- [`lily-design-system-svelte-motion-picker`](../lily-design-system-svelte-motion-picker) — `@lilydesignsystem/svelte-motion-picker`
- [`lily-design-system-svelte-search-picker`](../lily-design-system-svelte-search-picker) — `@lilydesignsystem/svelte-search-picker`
- [`lily-design-system-svelte-settings-picker`](../lily-design-system-svelte-settings-picker) — `@lilydesignsystem/svelte-settings-picker`
- [`lily-design-system-svelte-share-picker`](../lily-design-system-svelte-share-picker) — `@lilydesignsystem/svelte-share-picker`
- [`lily-design-system-svelte-locale-translations`](../lily-design-system-svelte-locale-translations) — `@lilydesignsystem/svelte-locale-translations` — the 64 label packs and the CLDR zone-name packs as per-locale exports
- [`lily-design-system-svelte-markdown-editor`](../lily-design-system-svelte-markdown-editor) — `@lilydesignsystem/svelte-markdown-editor` — a Markdown editor: a textarea with a toolbar of rich-text buttons that write Markdown (added 2026-10-24; ported to the other eight catalogs the same day)
- [`lily-design-system-svelte-org-editor`](../lily-design-system-svelte-org-editor) — `@lilydesignsystem/svelte-org-editor` — an Emacs Org editor: a textarea with a toolbar for text effects, tasks, priorities, planning, properties, drawers and contacts (added 2026-10-24; ported to the other eight catalogs the same day)
- [`lily-design-system-svelte-text-size-picker`](../lily-design-system-svelte-text-size-picker) — `@lilydesignsystem/svelte-text-size-picker`
- [`lily-design-system-svelte-time-zone-picker`](../lily-design-system-svelte-time-zone-picker) — `@lilydesignsystem/svelte-time-zone-picker` — time zones by UTC offset with `Intl` full names (added 2026-10-24; ported to all eight catalogs the same day)
- [`lily-design-system-svelte-theme-picker`](../lily-design-system-svelte-theme-picker) — `@lilydesignsystem/svelte-theme-picker`
- [`lily-design-system-svelte-calendar`](../lily-design-system-svelte-calendar) — `@lilydesignsystem/svelte-calendar`
- [`lily-design-system-svelte-gantt-chart`](../lily-design-system-svelte-gantt-chart) — `@lilydesignsystem/svelte-gantt-chart`
- [`lily-design-system-svelte-picker-bar`](../lily-design-system-svelte-picker-bar) — `@lilydesignsystem/svelte-picker-bar`

The other seven catalogs mirror the Svelte list one package per subproject, named `lily-design-system-<framework>-<package>` and published as `@lilydesignsystem/<framework>-<package>` (Blazor: `LilyDesignSystem.Blazor.<Package>` on NuGet). Do not hand-maintain per-framework lists here; ask the script, which prints them in dependency (build) order:

| Framework      | List its packages                         |
| -------------- | ----------------------------------------- |
| React          | `bin/list-helper-packages react`          |
| Vue            | `bin/list-helper-packages vue`            |
| Angular        | `bin/list-helper-packages angular`        |
| HTML           | `bin/list-helper-packages html`           |
| Web Components | `bin/list-helper-packages web-components` |
| Nunjucks       | `bin/list-helper-packages nunjucks`       |
| Blazor         | `bin/list-helper-packages blazor`         |

Nunjucks also ships `nunjucks-listbox-behavior`. Alpine ships only `alpine-{data-grid,kanban-board,calendar,gantt-chart,markdown-editor,org-editor}` (`bin/list-helper-packages alpine`). Port gaps are allow-listed with reasons in `bin/check-port-parity.allow.json`. The framework-neutral `lily-design-system-locale-translations`, `lily-design-system-pattern-testers` and `lily-design-system-themes` are top-level packages too, outside the 185.

## Reference themes

The [themes/](../themes) directory ships 65 standalone theme stylesheets (NHS England/Scotland/Wales patient + practitioner variants, GOV.UK GDS, USWDS, the GC Design System (Canada), SGDS (Singapore), the Digital Agency (Japan), gov.br (Brazil), ECL (European Commission), AgDS (Australia), Adobe Spectrum, Mozilla Protocol, Ant Design, Atlassian, Excel, Fluent, GitHub Primer, IBM Carbon, Linear, Notion, Salesforce, SAP Fiori, Vercel, and general-purpose themes) that target the Lily class hooks; the theme-picker helper loads them at runtime.

## Agent skills

Thirty-five top-level Claude Skill packages, including four cross-framework task playbooks and a .NET MAUI skill, spec: [spec/agent-skills/index.md](../spec/agent-skills/index.md).

- [lily-design-system-skill](../lily-design-system-skill) — general-purpose: concepts, terminology, naming conventions, composition patterns, for people building _with_ Lily.
- [lily-design-system-maintainer-skill](../lily-design-system-maintainer-skill) — technical: required files, `bin/` tooling, the spec-driven workflow, for people working _on_ this monorepo.
- Nine framework-umbrella skills (2026-09-05; Solid 2026-11-18), one `{framework}-skill` per framework family, each mapping that framework's three layers (headless library, helper packages, example app — the one layer neither sibling skill below covers) and pointing down into them: `lily-design-system-angular-skill`, `lily-design-system-blazor-skill`, `lily-design-system-html-skill`, `lily-design-system-nunjucks-skill`, `lily-design-system-react-skill`, `lily-design-system-svelte-skill`, `lily-design-system-vue-skill`, `lily-design-system-web-components-skill` (two layers only: there is no Web Components example app), and `lily-design-system-solid-skill` (2026-11-18).
- [lily-design-system-alpine-headless-skill](../lily-design-system-alpine-headless-skill) (2026-10-21) — the Alpine.js headless catalog: the snippet-plus-plugin idiom, behaviours, events. Alpine now has an example app and six helpers, but no helpers-skill or umbrella skill yet.
- Eighteen framework-specific skills (2026-09-04; Solid 2026-11-18), one `{framework}-headless-skill` and one `{framework}-helpers-skill` per framework family, each scoped to that framework's headless library or its helper packages: `lily-design-system-angular-headless-skill`, `lily-design-system-angular-helpers-skill`, `lily-design-system-blazor-headless-skill`, `lily-design-system-blazor-helpers-skill`, `lily-design-system-html-headless-skill`, `lily-design-system-html-helpers-skill`, `lily-design-system-nunjucks-headless-skill`, `lily-design-system-nunjucks-helpers-skill`, `lily-design-system-react-headless-skill`, `lily-design-system-react-helpers-skill`, `lily-design-system-svelte-headless-skill`, `lily-design-system-svelte-helpers-skill`, `lily-design-system-vue-headless-skill`, `lily-design-system-vue-helpers-skill`, `lily-design-system-web-components-headless-skill` (covers its full achievable scope), `lily-design-system-web-components-helpers-skill`, and (2026-11-18) `lily-design-system-solid-headless-skill`, `lily-design-system-solid-helpers-skill`.
- [lily-design-system-maui-skill](../lily-design-system-maui-skill) (2026-11-26) — .NET MAUI: the native controls of `lily-design-system-maui`, and the full catalog through Blazor Hybrid.
- Four task-shaped skills (2026-11-19): `lily-design-system-install`, `lily-design-system-add-component`, `lily-design-system-theme`, and `lily-design-system-migrate-from-bootstrap`. They are local playbooks; public registry publication remains separately gated.

All thirty-five follow the `lily-design-system-` prefix and get full subproject treatment (see [spec/agent-skills/index.md](../spec/agent-skills/index.md)).

## AI guidance files

[llms.txt](../llms.txt) and [llms.json](../llms.json) at the repository root, spec: [spec/llms-json-and-llms-txt/index.md](../spec/llms-json-and-llms-txt/index.md). A curated map of the project's most important content for AI tools, following the [llms.txt convention](https://llmstxt.org). The docs site publishes its own pair at `lilydesignsystem.github.io/static/llms.txt` and `llms.json` with site-route links instead of repo-relative ones.

## Generated files

Edit the source, never the output. These files are written by a generator; a hand edit is overwritten, or fails the check.
`bin/check-generated-files` (run by `bin/test`) fails when this table names a script that does not exist, claims a `--check`
the script lacks, or omits a script that has one. Rows whose check is "none" are known gaps (tasks.md P13-T1), not
exemptions.

| Source (edit this)                                                                                             | Generator                           | Generated output (never edit)                                                                                                                                                                                                                                     | Check                                                                      |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `components/{slug}/AGENTS.md`, `components.tsv`                                                                | `bin/generate-component-categories` | `components-categories.tsv`                                                                                                                                                                                                                                       | none (staleness is caught indirectly by `bin/generate-registries --check`) |
| `components.tsv`, `components-categories.tsv`, the Svelte `component-demos.ts`                                 | `bin/generate-registries`           | the example apps' registries and `component-demos.ts` copies, `ComponentData.cs`, the HTML app's catalog scripts in `assets/js/pages/`, the site's `src/lib/components.ts`, the component listing in `index.md`, the shadcn registry `static/r/react/`            | `bin/generate-registries --check`                                          |
| each component's `## Usage` doc, `component-variants.json`                                                     | `bin/generate-examples`             | every app's `component-examples` data, `ComponentExamples.cs`, the `componentExamples` region in the HTML app's `assets/js/pages/component.js`, the Nunjucks app's generated examples regions                                                                     | none                                                                       |
| `components/{slug}/index.md`, the demo map, the examples data                                                  | `bin/generate-site-pages`           | the docs site's `src/routes/components/{slug}/+page.svelte` (placeholder rebuild and the Example region)                                                                                                                                                          | none                                                                       |
| `components/{slug}/{index.md,AGENTS.md,spec/index.md}`                                                         | `bin/sync-site-component-docs`      | the docs site's matching per-component Markdown hand-off copies                                                                                                                                                                                                   | `bin/sync-site-component-docs --check`                                     |
| the HTML helper source and tests                                                                               | `bin/sync-web-components-helpers`   | all 20 matching Web Components helper source/test trees with package names and public tag prefixes transformed, plus explicit reviewed composition patches                                                                                                        | `bin/sync-web-components-helpers --check`                                  |
| `components/{slug}/AGENTS.md`, the headless file layout                                                        | `bin/generate-api-docs`             | the canonical-contract region on each site page, `static/r/{slug}.json` and `static/r/index.json`, `static/components/{slug}.md`, the `/recipes/` route and `static/recipes.md` (from `recipes/`)                                                                 | `bin/generate-api-docs --check`                                            |
| the test suites of `shared/`, Svelte headless and Blazor headless                                              | `bin/coverage-report`               | `docs/coverage.md`, `docs/coverage-badge.svg`                                                                                                                                                                                                                     | none (it runs three test suites; run it after test changes)                |
| the headless packages' `package.json` / `.csproj`, their component files, `bin/list-helper-packages`           | `bin/generate-framework-matrix`     | `docs/framework-comparison.md`                                                                                                                                                                                                                                    | `bin/generate-framework-matrix --check`                                    |
| every `playwright.config.ts` and `wdio.conf.js`, and the `@playwright/test` range beside each                  | `bin/generate-browser-support`      | `docs/supported-browsers.md`                                                                                                                                                                                                                                      | `bin/generate-browser-support --check`                                     |
| `compare/compare.tsv`                                                                                          | `bin/generate-comparisons`          | the component matrix table in `compare/index.md`; the `rows matched` counts in `COMPARE.md` come from `bin/generate-comparisons --counts`                                                                                                                         | `bin/generate-comparisons --check`                                         |
| `docs/migrating/bootstrap.tsv` and the prose around each mapping region                                        | `bin/generate-bootstrap-migration`  | the mapping tables in `MIGRATING-FROM-BOOTSTRAP.md` and the docs site's `/migrating/from-bootstrap/` route                                                                                                                                                        | `bin/generate-bootstrap-migration --check`                                 |
| `docs/migrating/government-design-system.tsv` and the prose around its mapping region                          | `bin/generate-government-migration` | the mapping table in `docs/migrating/government-design-system.md`                                                                                                                                                                                                 | `bin/generate-government-migration --check`                                |
| the SvelteKit route tree                                                                                       | `bin/generate-sitemap`              | `lilydesignsystem.github.io/static/sitemap.xml`                                                                                                                                                                                                                   | `bin/generate-sitemap --check` (not yet in `bin/test`)                     |
| `themes/tokens/*.json`                                                                                         | `bin/generate-theme-tokens`         | the token block of each `themes/*.css`, `themes/tokens/lily.resolver.json`                                                                                                                                                                                        | `bin/generate-theme-tokens --check`                                        |
| `themes/tokens/*.json` (the themes in `MOBILE_THEMES`)                                                         | `bin/generate-mobile-tokens`        | `lily-design-system-swift/Sources/LilyThemes/LilyTokens.swift`, `lily-design-system-kotlin/lily-compose-themes/src/main/kotlin/io/github/lilydesignsystem/compose/themes/LilyTokens.kt`, `lily-design-system-maui/src/LilyDesignSystem.Maui/Themes/LilyTokens.cs` | `bin/generate-mobile-tokens --check`                                       |
| each headless library's components                                                                             | `bin/sync-example-components`       | the same components inside each example app                                                                                                                                                                                                                       | `bin/sync-example-components --check`                                      |
| `shared/*.ts`, `shared/label-packs/*.json`                                                                     | `bin/sync-shared-modules`           | each package's copy of a shared module, and the locale-translations label packs                                                                                                                                                                                   | `bin/sync-shared-modules --check`                                          |
| the root special files (LICENSE, CONTRIBUTING, …)                                                              | `bin/sync-special-files`            | the same files in every subproject                                                                                                                                                                                                                                | `bin/sync-special-files --check`                                           |
| the Unicode CLDR (through Node's ICU), `shared/label-packs/` locale list                                       | `bin/generate-zone-names`           | `shared/zone-names/*.json`, and its copies in the locale-translations packages                                                                                                                                                                                    | `bin/generate-zone-names --check`                                          |
| `src/lib/pages/*/*.html`, `docs/theme-contrast.md`, `bin/generate-page-markdown.allow.json`                    | `bin/generate-page-markdown`        | `static/<route>.md` and `static/<locale>/<route>.md`, one localized Markdown twin per text-page route; every other route needs a reasoned exception                                                                                                               | `bin/generate-page-markdown --check`                                       |
| the site's English route pages                                                                                 | `bin/extract-site-pages`            | `src/lib/pages/{slug}/en.html`                                                                                                                                                                                                                                    | `bin/extract-site-pages --check`                                           |
| `src/lib/pages/*` translations                                                                                 | `bin/generate-locale-pages`         | `src/routes/<code>/<slug>/+page.svelte`                                                                                                                                                                                                                           | `bin/generate-locale-pages --check`                                        |
| `themes/*.css`                                                                                                 | `bin/generate-theme-contrast`       | `docs/theme-contrast.md`, the site's `src/routes/theme-contrast/+page.svelte`                                                                                                                                                                                     | `bin/generate-theme-contrast --check`                                      |
| the headless tests, the example apps' e2e configs, `docs/screen-reader-matrix.md`                              | `bin/generate-core`                 | `spec/competitive-position/core.json`, `docs/core.md`, `docs/accessibility-conformance-report.md`, `docs/aria-assessment.tsv`, the tables in `docs/aria-assessment.md`, the site's `src/routes/quality/+page.svelte`                                              | `bin/generate-core --check`                                                |
| Blazor `.cs` and `.razor` source and test files                                                                | `bin/dotnet-format`                 | the same files, formatted in place with `dotnet format whitespace`                                                                                                                                                                                                | `bin/dotnet-format --check`                                                |
| the Blazor headless library's pure C# modules (`ClinicalFormat.cs`, `IpsSections.cs`, `RecordListState.cs`, …) | `bin/sync-maui-core`                | `lily-design-system-maui/src/LilyDesignSystem.Maui.Core/Shared/*.cs`                                                                                                                                                                                              | `bin/sync-maui-core --check`                                               |
| the root `AGENTS/`, `themes/`, `NEWS.md`, `plan.md`; the HTML picker sources                                   | `bin/sync`                          | the `AGENTS/` copies in subprojects, the example apps' and site's themes, the site's `NEWS.md` and `plan.md`, the HTML example app's picker scripts                                                                                                               | `bin/sync --check`                                                         |

`bin/test-generators` (in `bin/test`) runs golden tests over a three-component fixture for `generate-api-docs`,
`generate-registries`, `generate-examples` and `generate-site-pages`; `--update-goldens` rewrites them.

The Alpine headless snippets (`lily-design-system-alpine-headless/components/*.{html,stories.ts,test.js}`) are generated by
`node lily-design-system-alpine-headless/generate-components.mjs` from its `families/*.mjs` and the HTML catalog's markup, formatted
with the root Prettier; edit a family, never a snippet. `--check` runs in `bin/test` (when the root install is present) and in CI's
lint job. Only `middle-truncation` and `wheel-picker` are written by hand.

Also written, with no `--check`: `bin/generate-storybook-stories.mjs` writes Svelte story files.

## Tools

Every `bin/` script and the Makefile target, one line each: [tools.md](tools.md). Full flags: [spec/tooling](../spec/tooling/index.md).

## Inspirations

See [citations.md](citations.md) for the full list of design systems Lily draws from. Short list:

- [NHS UK Design System](https://service-manual.nhs.uk/design-system)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [ONSdigital Design System](https://github.com/ONSdigital/design-system)
- [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/)
- [Mozilla Protocol Design System](https://protocol.mozilla.org/)
- [Adobe Spectrum](https://spectrum.adobe.com/)
- [Ant Design](https://ant.design/)
- [Wonderflow Wanda](https://design.wonderflow.ai/)
- [Design System AU: Australian Government](https://designsystemau.org/)
- [DaisyUI](https://daisyui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Reuters graphics components](https://github.com/reuters-graphics/graphics-components)

## For each subproject

- `index.md`
- `README.md` symlink to `index.md`
- `AGENTS.md` with AI coding help
- `AGENTS/` directory with modular agent files
- `spec/index.md` — spec-driven plan + tasks (replaces the older split plan.md / tasks.md)

## For each component directory

- `index.md`
- `README.md` symlink to `index.md`
- `AGENTS.md`
- `spec/index.md` — spec-driven plan + tasks (replaces the older split plan.md / tasks.md)

## Verify

Run `bin/test`.
