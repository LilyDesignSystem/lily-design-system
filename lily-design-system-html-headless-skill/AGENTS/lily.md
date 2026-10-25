# Lily Design System

Living specification: [spec/index.md](../spec/index.md)

[CSS style sheet template](../css-style-sheet-template.css)

Canonical component list: [components.tsv](../components.tsv) — 571 components.

## Subprojects for headless components

The seven framework pairs below are the canonical, full-catalog (571/571)
headless libraries. An 8th headless catalog joined 2026-09-03:
[Lily Design System: Web Components headless](../lily-design-system-web-components-headless)
ships its full achievable scope as of 2026-10-06: 536 of the 571
components as native custom elements (no framework runtime). The other 35
are permanently excluded by a real architectural limitation (table
sub-elements and interactive `*ListItem` families — no wrapper-host-safe
registration mechanism exists for autonomous custom elements), not open
backlog. See its own `spec/index.md` for the architecture decisions
(autonomous custom elements over customized built-ins, light-DOM-only)
and the exact scope.

A 9th, [Lily Design System: Alpine.js headless](../lily-design-system-alpine-headless)
(added 2026-10-21, unpublished), covers all 571 components as annotated HTML
snippets (`components/{slug}.html`) plus one Alpine plugin (`lily-alpine.js`)
that owns state and keyboard behaviour: 488 static, 83 with an `Alpine.data`
behaviour. Its example app is [`lily-design-system-alpine-examples`](../lily-design-system-alpine-examples); its helpers are `lily-design-system-alpine-{data-grid,kanban-board,calendar,gantt-chart}` (`@lilydesignsystem/alpine-*`), each a subset of its Svelte reference. See its `spec/index.md`.

- [Lily Design System: HTML headless](../lily-design-system-html-headless)
- [Lily Design System: Svelte headless](../lily-design-system-svelte-headless)
- [Lily Design System: React headless](../lily-design-system-react-headless)
- [Lily Design System: Vue headless](../lily-design-system-vue-headless)
- [Lily Design System: Angular headless](../lily-design-system-angular-headless)
- [Lily Design System: Blazor headless](../lily-design-system-blazor-headless)
- [Lily Design System: Nunjucks headless](../lily-design-system-nunjucks-headless)

## Subprojects for web app examples

- [Lily Design System: HTML CSS JS examples](../lily-design-system-html-css-js-examples)
- [Lily Design System: Svelte SvelteKit examples](../lily-design-system-svelte-sveltekit-examples)
- [Lily Design System: React Next.js examples](../lily-design-system-react-next-examples)
- [Lily Design System: Vue Nuxt.js examples](../lily-design-system-vue-nuxt-examples)
- [Lily Design System: Angular Analog examples](../lily-design-system-angular-examples)
- [Lily Design System: Blazor Web examples](../lily-design-system-blazor-web-examples)
- [Lily Design System: Nunjucks Eleventy examples](../lily-design-system-nunjucks-eleventy-examples)

## Subprojects for framework helpers

Each framework ships ten `*-picker` helpers — theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, search-picker (added 2026-10-02), link-picker (added 2026-10-07: a home icon opening the page links the app defines), menu-picker and settings-picker (added 2026-10-08: a hamburger / a cog opening a dropdown of whatever the app provides), date-time-picker. The first six are an icon button that opens a popup; none is a native `<select>` any more. `date-time-picker` is the exception: a form control, so it pairs a typeable text field with its trigger and opens an APG date-picker dialog. Svelte is the canonical reference; the other seven are idiom ports. Every framework's helpers are one top-level subproject per package (below), since 2026-10-10.


The Svelte helpers (canonical reference) are one top-level subproject per package, since 2026-10-10 (the data grid since 2026-10-09); the `lily-design-system-svelte-helpers` catalog that held them is gone. `bin/list-helper-packages svelte` lists them in build order:

- [`lily-design-system-svelte-data-grid`](../lily-design-system-svelte-data-grid) — `@lilydesignsystem/svelte-data-grid`
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
- [`lily-design-system-svelte-markdown-editor`](../lily-design-system-svelte-markdown-editor) — `@lilydesignsystem/svelte-markdown-editor` — a Markdown editor: a textarea with a toolbar of rich-text buttons that write Markdown (added 2026-10-24; ported to the other eight catalogs the same day)
- [`lily-design-system-svelte-org-editor`](../lily-design-system-svelte-org-editor) — `@lilydesignsystem/svelte-org-editor` — an Emacs Org editor: a textarea with a toolbar for text effects, tasks, priorities, planning, properties, drawers and contacts (added 2026-10-24; ported to the other eight catalogs the same day)
- [`lily-design-system-svelte-text-size-picker`](../lily-design-system-svelte-text-size-picker) — `@lilydesignsystem/svelte-text-size-picker`
- [`lily-design-system-svelte-time-zone-picker`](../lily-design-system-svelte-time-zone-picker) — `@lilydesignsystem/svelte-time-zone-picker` — time zones by UTC offset with `Intl` full names (added 2026-10-24; Svelte only)
- [`lily-design-system-svelte-theme-picker`](../lily-design-system-svelte-theme-picker) — `@lilydesignsystem/svelte-theme-picker`
- [`lily-design-system-svelte-calendar`](../lily-design-system-svelte-calendar) — `@lilydesignsystem/svelte-calendar`
- [`lily-design-system-svelte-gantt-chart`](../lily-design-system-svelte-gantt-chart) — `@lilydesignsystem/svelte-gantt-chart`
- [`lily-design-system-svelte-picker-bar`](../lily-design-system-svelte-picker-bar) — `@lilydesignsystem/svelte-picker-bar`

The other seven catalogs mirror the Svelte list one package per subproject, named `lily-design-system-<framework>-<package>` and published as `@lilydesignsystem/<framework>-<package>` (Blazor: `LilyDesignSystem.Blazor.<Package>` on NuGet). Do not hand-maintain per-framework lists here; ask the script, which prints them in dependency (build) order:

| Framework | List its packages |
| --------- | ----------------- |
| React | `bin/list-helper-packages react` |
| Vue | `bin/list-helper-packages vue` |
| Angular | `bin/list-helper-packages angular` |
| HTML | `bin/list-helper-packages html` |
| Web Components | `bin/list-helper-packages web-components` |
| Nunjucks | `bin/list-helper-packages nunjucks` |
| Blazor | `bin/list-helper-packages blazor` |

Nunjucks also ships `nunjucks-listbox-behavior`. Alpine ships only `alpine-{data-grid,kanban-board,calendar,gantt-chart}`. Port gaps are allow-listed with reasons in `bin/check-port-parity`.

## Reference themes

The [themes/](../themes) directory ships 57 standalone theme stylesheets (NHS England/Scotland/Wales patient + practitioner variants, GOV.UK GDS, USWDS, Adobe Spectrum, Mozilla Protocol, Ant Design, Atlassian, Excel, Fluent, GitHub Primer, IBM Carbon, Linear, Notion, Salesforce, SAP Fiori, Vercel, and general-purpose themes) that target the Lily class hooks; the theme-picker helper loads them at runtime.

## Agent skills

Twenty-seven top-level Claude Skill packages in three tiers, spec: [spec/agent-skills/index.md](../spec/agent-skills/index.md).

- [lily-design-system-skill](../lily-design-system-skill) — general-purpose: concepts, terminology, naming conventions, composition patterns, for people building *with* Lily.
- [lily-design-system-maintainer-skill](../lily-design-system-maintainer-skill) — technical: required files, `bin/` tooling, the spec-driven workflow, for people working *on* this monorepo.
- Eight framework-umbrella skills (2026-09-05), one `{framework}-skill` per framework family, each mapping that framework's up-to-three real subprojects (headless, helpers, example app — the one layer neither sibling skill below covers) and pointing down into them: `lily-design-system-angular-skill`, `lily-design-system-blazor-skill`, `lily-design-system-html-skill`, `lily-design-system-nunjucks-skill`, `lily-design-system-react-skill`, `lily-design-system-svelte-skill`, `lily-design-system-vue-skill`, `lily-design-system-web-components-skill` (the one with only two subprojects to map — no Web Components example app exists yet).
- [lily-design-system-alpine-headless-skill](../lily-design-system-alpine-headless-skill) (2026-10-21) — the Alpine.js headless catalog: the snippet-plus-plugin idiom, behaviours, events. Alpine has no helpers or example app yet, so it has no helpers-skill or umbrella.
- Sixteen framework-specific skills (2026-09-04), one `{framework}-headless-skill` and one `{framework}-helpers-skill` per framework family, each scoped to exactly the one real subproject it covers: `lily-design-system-angular-headless-skill`, `lily-design-system-angular-helpers-skill`, `lily-design-system-blazor-headless-skill`, `lily-design-system-blazor-helpers-skill`, `lily-design-system-html-headless-skill`, `lily-design-system-html-helpers-skill`, `lily-design-system-nunjucks-headless-skill`, `lily-design-system-nunjucks-helpers-skill`, `lily-design-system-react-headless-skill`, `lily-design-system-react-helpers-skill`, `lily-design-system-svelte-headless-skill`, `lily-design-system-svelte-helpers-skill`, `lily-design-system-vue-headless-skill`, `lily-design-system-vue-helpers-skill`, `lily-design-system-web-components-headless-skill` (covers its full achievable scope), `lily-design-system-web-components-helpers-skill`.

All twenty-seven follow the `lily-design-system-` prefix and get full subproject treatment (the first two as of 2026-08-31 — `lily-design-system-skill` was renamed from `lily-skill`, which deliberately sat outside the prefix — the sixteen framework-specific ones as of 2026-09-04 and the eight framework-umbrella ones as of 2026-09-05, both reversing or extending this topic's earlier "two skills only" decision — see [spec/agent-skills/index.md](../spec/agent-skills/index.md)).

## AI guidance files

[llms.txt](../llms.txt) and [llms.json](../llms.json) at the repository root, spec: [spec/llms-json-and-llms-txt/index.md](../spec/llms-json-and-llms-txt/index.md). A curated map of the project's most important content for AI tools, following the [llms.txt convention](https://llmstxt.org). The docs site publishes its own pair at `lilydesignsystem.github.io/static/llms.txt` and `llms.json` with site-route links instead of repo-relative ones.

## Generated files

Edit the source, never the output. These files are written by a generator; a hand edit is overwritten, or fails the check.
`bin/check-generated-files` (run by `bin/test`) fails when this table names a script that does not exist, claims a `--check`
the script lacks, or omits a script that has one. Rows whose check is "none" are known gaps (tasks.md P13-T1), not
exemptions.

| Source (edit this) | Generator | Generated output (never edit) | Check |
| ------------------ | --------- | ----------------------------- | ----- |
| `components/{slug}/AGENTS.md`, `components.tsv` | `bin/generate-component-categories` | `components-categories.tsv` | none (staleness is caught indirectly by `bin/generate-registries --check`) |
| `components.tsv`, `components-categories.tsv`, the Svelte `component-demos.ts` | `bin/generate-registries` | the example apps' registries and `component-demos.ts` copies, `ComponentData.cs`, the HTML app's embedded arrays, the site's `src/lib/components.ts`, the component listing in `index.md` | `bin/generate-registries --check` |
| each component's `## Usage` doc, `component-variants.json` | `bin/generate-examples` | every app's `component-examples` data, `ComponentExamples.cs`, the HTML app's `componentExamples` region, the Nunjucks app's generated examples regions | none |
| `components/{slug}/index.md`, the demo map, the examples data | `bin/generate-site-pages` | the docs site's `src/routes/components/{slug}/+page.svelte` (placeholder rebuild and the Example region) | none |
| `components/{slug}/AGENTS.md`, the headless file layout | `bin/generate-api-docs` | the canonical-contract region on each site page, `static/r/{slug}.json` and `static/r/index.json`, `static/components/{slug}.md` | `bin/generate-api-docs --check` |
| the SvelteKit route tree | `bin/generate-sitemap` | `lilydesignsystem.github.io/static/sitemap.xml` | `bin/generate-sitemap --check` (not yet in `bin/test`) |
| `themes/tokens/*.json` | `bin/generate-theme-tokens` | the token block of each `themes/*.css` | `bin/generate-theme-tokens --check` |
| each headless library's components | `bin/sync-example-components` | the same components inside each example app | `bin/sync-example-components --check` |
| `shared/*.ts`, `shared/label-packs/*.json` | `bin/sync-shared-modules` | each package's copy of a shared module, and the locale-translations label packs | `bin/sync-shared-modules --check` |
| the root special files (LICENSE, CONTRIBUTING, …) | `bin/sync-special-files` | the same files in every subproject | `bin/sync-special-files --check` |
| the Unicode CLDR (through Node's ICU), `shared/label-packs/` locale list | `bin/generate-zone-names` | `shared/zone-names/*.json`, and its copies in the locale-translations packages | `bin/generate-zone-names --check` |
| `src/lib/pages/*/en.html` | `bin/generate-page-markdown` | `static/<route>.md`, one Markdown twin per English text page | `bin/generate-page-markdown --check` |
| the site's English route pages | `bin/extract-site-pages` | `src/lib/pages/{slug}/en.html` | `bin/extract-site-pages --check` |
| `src/lib/pages/*` translations | `bin/generate-locale-pages` | `src/routes/<code>/<slug>/+page.svelte` | `bin/generate-locale-pages --check` |

Also copied rather than generated: `bin/sync` rsyncs the root `AGENTS/` and `themes/` into subprojects, and
`bin/generate-storybook-stories.mjs` writes Svelte story files. Neither has a `--check`.

## Tools

- [Makefile](../Makefile): `make github-pages` delegates to [bin/make-github-pages](../bin/make-github-pages), see [spec/monorepo-github-pages/index.md](../spec/monorepo-github-pages/index.md)
- [make-github-pages](../bin/make-github-pages): Push `lilydesignsystem.github.io/` to its own repository via git subtree (the one subproject that still has one; it serves GitHub Pages)
- [list-components-as-kebab-case](../bin/list-components-as-kebab-case): List components as kebab case
- [list-components-as-pascal-case](../bin/list-components-as-pascal-case): List components as PascalCase
- [list-implementations](../bin/list-implementations): List implementation directories
- [list-helper-packages](../bin/list-helper-packages): List one framework's top-level helper packages in dependency (build) order
- [check-port-parity](../bin/check-port-parity): Web Components helpers vs the HTML ones, Alpine vs Svelte: class hooks, events and attributes missing from the port, unless allow-listed with a reason
- [check-generated-files](../bin/check-generated-files): The Generated files table above lists every generator and its `--check`, and none is missing or invented
- [check-package-metadata](../bin/check-package-metadata): Every published npm/NuGet package names the monorepo as its source repository — packages publish from the monorepo
- [create-component-directory](../bin/create-component-directory): Scaffold one component directory
- [create-implementation-directory](../bin/create-implementation-directory): Scaffold one implementation directory
- [test](../bin/test): Run all tests
- [sync](../bin/sync): Sync files across subprojects
- [sync-special-files](../bin/sync-special-files): Sync the top-level special files (LICENSE, CONTRIBUTING, SECURITY, GOVERNANCE, …) into every subproject
- [update](../bin/update): Update shared files
- [generate-storybook-stories.mjs](../bin/generate-storybook-stories.mjs): Generate Storybook stories
- [publish-helpers](../bin/publish-helpers): Build and publish every helper package (npm / NuGet)
- [publish-headless](../bin/publish-headless): Build and publish the 7 headless libraries (npm / NuGet)
- [generate-registries](../bin/generate-registries): Regenerate example-app catalog registries from components.tsv
- [check-links](../bin/check-links): Verify relative markdown links resolve
- [check-theme](../bin/check-theme): Verify the 57 reference themes honour their conformance contracts; `--contrast` reports each theme's token-pair contrast against WCAG AA/AAA (report only)
- [check-class-names](../bin/check-class-names): Every headless implementation carries its kebab-case base class (first in a class list)
- [check-helper-docs](../bin/check-helper-docs): The Svelte grid-like helpers document every prop they have and list no shipped feature as a non-goal
- [check-label-packs](../bin/check-label-packs): Every label pack in `shared/label-packs` has the English pack's keys and placeholders, and the Svelte and TypeScript-port helpers still have every key the packs hold
- [verify-published](../bin/verify-published): After a publish, is every helper package's local version on its registry? `--wait` polls through registry lag
- [sync-shared-modules](../bin/sync-shared-modules): One source (`shared/`) for the pure modules the grid-like helpers copy (search, type-ahead, edit history, export, cell types, typed fields, direction, label coverage, dependency arrows, unavailable days, the filter model, the optional Gantt critical path, the label-pack loaders); `--check` (in bin/test) fails on drift
- [sync-example-components](../bin/sync-example-components): Mirror each headless library's components into its example app's copy; `--check` (in bin/test) fails on drift
- [check-coverage](../bin/check-coverage): Coverage drift matrix — per-component file presence across all 7 headless libraries
- [generate-theme-tokens](../bin/generate-theme-tokens): DTCG token source under themes/tokens/ — extract, generate, drift-check
- [generate-component-categories](../bin/generate-component-categories): Regenerate components-categories.tsv (per-component HTML tag + category) from components.tsv
- [generate-page-markdown](../bin/generate-page-markdown): A `.md` twin of each English site text page, drift-checked
- [generate-api-docs](../bin/generate-api-docs): Canonical-contract sections on the site's component pages, generated from components/*/AGENTS.md — drift-checked
- [new-component](../bin/new-component): End-to-end scaffolder — one new placeholder component across every layer bin/test verifies
- [generate-examples](../bin/generate-examples): Usage examples (from the docs) and rendered variants (component-variants.json) for every demonstration page
- [extract-site-pages](../bin/extract-site-pages): The docs site's eight main English pages, and the further pages in `src/lib/extra-pages.json`, as translation sources (`src/lib/pages/*/en.html`)
- [check-site-page-translations](../bin/check-site-page-translations): Translated site pages keep the English markup structure and code samples, and each language is complete
- [generate-locale-pages](../bin/generate-locale-pages): `/<code>/<page>/` routes for every translated language
- [generate-site-pages](../bin/generate-site-pages): Docs-site component pages from components/{slug}/index.md, with the Example section refreshed on every page
- [generate-sitemap](../bin/generate-sitemap): Docs-site sitemap.xml from the route tree (`--check` reports drift)
- [smoke-packages](../bin/smoke-packages): Pack + install each published headless tarball into a scratch consumer and render it

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
