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

Each catalog ships ten `*-picker` helpers — theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, search-picker (added 2026-10-02), link-picker (added 2026-10-07: a home icon opening the page links the app defines), menu-picker and settings-picker (added 2026-10-08: a hamburger / a cog opening a dropdown of whatever the app provides), date-time-picker. The first six are an icon button that opens a popup; none is a native `<select>` any more. `date-time-picker` is the exception: a form control, so it pairs a typeable text field with its trigger and opens an APG date-picker dialog. Svelte is the canonical reference; the other seven are idiom ports. Svelte's, React's, Vue's and Angular's helpers are one top-level subproject per package (below); the other four frameworks keep theirs in one catalog each.

- [Lily Design System: HTML helpers](../lily-design-system-html-helpers)
- [Lily Design System: Blazor helpers](../lily-design-system-blazor-helpers)
- [Lily Design System: Nunjucks helpers](../lily-design-system-nunjucks-helpers)
- [Lily Design System: Web Components helpers](../lily-design-system-web-components-helpers) — an independent copy of the HTML helpers with `lily-*` tags (2026-09-03); see its provenance note

The Svelte helpers (canonical reference) are one top-level subproject per package, since 2026-10-10 (the data grid since 2026-10-09); the `lily-design-system-svelte-helpers` catalog that held them is gone. `bin/list-helper-packages svelte` lists them in build order:

- [`lily-design-system-svelte-data-grid`](../lily-design-system-svelte-data-grid) — `@lilydesignsystem/svelte-data-grid`
- [`lily-design-system-svelte-date-time-picker`](../lily-design-system-svelte-date-time-picker) — `@lilydesignsystem/svelte-date-time-picker`
- [`lily-design-system-svelte-kanban-board`](../lily-design-system-svelte-kanban-board) — `@lilydesignsystem/svelte-kanban-board`
- [`lily-design-system-svelte-link-picker`](../lily-design-system-svelte-link-picker) — `@lilydesignsystem/svelte-link-picker`
- [`lily-design-system-svelte-locale-picker`](../lily-design-system-svelte-locale-picker) — `@lilydesignsystem/svelte-locale-picker`
- [`lily-design-system-svelte-menu-picker`](../lily-design-system-svelte-menu-picker) — `@lilydesignsystem/svelte-menu-picker`
- [`lily-design-system-svelte-motion-picker`](../lily-design-system-svelte-motion-picker) — `@lilydesignsystem/svelte-motion-picker`
- [`lily-design-system-svelte-search-picker`](../lily-design-system-svelte-search-picker) — `@lilydesignsystem/svelte-search-picker`
- [`lily-design-system-svelte-settings-picker`](../lily-design-system-svelte-settings-picker) — `@lilydesignsystem/svelte-settings-picker`
- [`lily-design-system-svelte-share-picker`](../lily-design-system-svelte-share-picker) — `@lilydesignsystem/svelte-share-picker`
- [`lily-design-system-svelte-text-size-picker`](../lily-design-system-svelte-text-size-picker) — `@lilydesignsystem/svelte-text-size-picker`
- [`lily-design-system-svelte-theme-picker`](../lily-design-system-svelte-theme-picker) — `@lilydesignsystem/svelte-theme-picker`
- [`lily-design-system-svelte-calendar-view`](../lily-design-system-svelte-calendar-view) — `@lilydesignsystem/svelte-calendar-view`
- [`lily-design-system-svelte-gantt-chart`](../lily-design-system-svelte-gantt-chart) — `@lilydesignsystem/svelte-gantt-chart`
- [`lily-design-system-svelte-picker-bar`](../lily-design-system-svelte-picker-bar) — `@lilydesignsystem/svelte-picker-bar`

The React helpers, one top-level subproject per package since 2026-10-10 (`bin/list-helper-packages react`):

- [`lily-design-system-react-date-time-picker`](../lily-design-system-react-date-time-picker) — `@lilydesignsystem/react-date-time-picker`
- [`lily-design-system-react-kanban-board`](../lily-design-system-react-kanban-board) — `@lilydesignsystem/react-kanban-board`
- [`lily-design-system-react-link-picker`](../lily-design-system-react-link-picker) — `@lilydesignsystem/react-link-picker`
- [`lily-design-system-react-locale-picker`](../lily-design-system-react-locale-picker) — `@lilydesignsystem/react-locale-picker`
- [`lily-design-system-react-menu-picker`](../lily-design-system-react-menu-picker) — `@lilydesignsystem/react-menu-picker`
- [`lily-design-system-react-motion-picker`](../lily-design-system-react-motion-picker) — `@lilydesignsystem/react-motion-picker`
- [`lily-design-system-react-search-picker`](../lily-design-system-react-search-picker) — `@lilydesignsystem/react-search-picker`
- [`lily-design-system-react-settings-picker`](../lily-design-system-react-settings-picker) — `@lilydesignsystem/react-settings-picker`
- [`lily-design-system-react-share-picker`](../lily-design-system-react-share-picker) — `@lilydesignsystem/react-share-picker`
- [`lily-design-system-react-text-size-picker`](../lily-design-system-react-text-size-picker) — `@lilydesignsystem/react-text-size-picker`
- [`lily-design-system-react-theme-picker`](../lily-design-system-react-theme-picker) — `@lilydesignsystem/react-theme-picker`
- [`lily-design-system-react-gantt-chart`](../lily-design-system-react-gantt-chart) — `@lilydesignsystem/react-gantt-chart`
- [`lily-design-system-react-picker-bar`](../lily-design-system-react-picker-bar) — `@lilydesignsystem/react-picker-bar`

The Vue helpers, one top-level subproject per package since 2026-10-10 (`bin/list-helper-packages vue`):

- [`lily-design-system-vue-date-time-picker`](../lily-design-system-vue-date-time-picker) — `@lilydesignsystem/vue-date-time-picker`
- [`lily-design-system-vue-kanban-board`](../lily-design-system-vue-kanban-board) — `@lilydesignsystem/vue-kanban-board`
- [`lily-design-system-vue-link-picker`](../lily-design-system-vue-link-picker) — `@lilydesignsystem/vue-link-picker`
- [`lily-design-system-vue-locale-picker`](../lily-design-system-vue-locale-picker) — `@lilydesignsystem/vue-locale-picker`
- [`lily-design-system-vue-menu-picker`](../lily-design-system-vue-menu-picker) — `@lilydesignsystem/vue-menu-picker`
- [`lily-design-system-vue-motion-picker`](../lily-design-system-vue-motion-picker) — `@lilydesignsystem/vue-motion-picker`
- [`lily-design-system-vue-search-picker`](../lily-design-system-vue-search-picker) — `@lilydesignsystem/vue-search-picker`
- [`lily-design-system-vue-settings-picker`](../lily-design-system-vue-settings-picker) — `@lilydesignsystem/vue-settings-picker`
- [`lily-design-system-vue-share-picker`](../lily-design-system-vue-share-picker) — `@lilydesignsystem/vue-share-picker`
- [`lily-design-system-vue-text-size-picker`](../lily-design-system-vue-text-size-picker) — `@lilydesignsystem/vue-text-size-picker`
- [`lily-design-system-vue-theme-picker`](../lily-design-system-vue-theme-picker) — `@lilydesignsystem/vue-theme-picker`
- [`lily-design-system-vue-gantt-chart`](../lily-design-system-vue-gantt-chart) — `@lilydesignsystem/vue-gantt-chart`
- [`lily-design-system-vue-picker-bar`](../lily-design-system-vue-picker-bar) — `@lilydesignsystem/vue-picker-bar`

The Angular helpers, one top-level subproject per package since 2026-10-10 (`bin/list-helper-packages angular`):

- [`lily-design-system-angular-date-time-picker`](../lily-design-system-angular-date-time-picker) — `@lilydesignsystem/angular-date-time-picker`
- [`lily-design-system-angular-kanban-board`](../lily-design-system-angular-kanban-board) — `@lilydesignsystem/angular-kanban-board`
- [`lily-design-system-angular-link-picker`](../lily-design-system-angular-link-picker) — `@lilydesignsystem/angular-link-picker`
- [`lily-design-system-angular-locale-picker`](../lily-design-system-angular-locale-picker) — `@lilydesignsystem/angular-locale-picker`
- [`lily-design-system-angular-menu-picker`](../lily-design-system-angular-menu-picker) — `@lilydesignsystem/angular-menu-picker`
- [`lily-design-system-angular-motion-picker`](../lily-design-system-angular-motion-picker) — `@lilydesignsystem/angular-motion-picker`
- [`lily-design-system-angular-search-picker`](../lily-design-system-angular-search-picker) — `@lilydesignsystem/angular-search-picker`
- [`lily-design-system-angular-settings-picker`](../lily-design-system-angular-settings-picker) — `@lilydesignsystem/angular-settings-picker`
- [`lily-design-system-angular-share-picker`](../lily-design-system-angular-share-picker) — `@lilydesignsystem/angular-share-picker`
- [`lily-design-system-angular-text-size-picker`](../lily-design-system-angular-text-size-picker) — `@lilydesignsystem/angular-text-size-picker`
- [`lily-design-system-angular-theme-picker`](../lily-design-system-angular-theme-picker) — `@lilydesignsystem/angular-theme-picker`
- [`lily-design-system-angular-gantt-chart`](../lily-design-system-angular-gantt-chart) — `@lilydesignsystem/angular-gantt-chart`
- [`lily-design-system-angular-picker-bar`](../lily-design-system-angular-picker-bar) — `@lilydesignsystem/angular-picker-bar`

## Reference themes

The [themes/](../themes) directory ships 45 standalone theme stylesheets (NHS England/Scotland/Wales patient + practitioner variants, GOV.UK GDS, USWDS, Adobe Spectrum, Mozilla Protocol, and general-purpose themes) that target the Lily class hooks; the theme-picker helper loads them at runtime.

## Agent skills

Twenty-six top-level Claude Skill packages in three tiers, spec: [spec/agent-skills/index.md](../spec/agent-skills/index.md).

- [lily-design-system-skill](../lily-design-system-skill) — general-purpose: concepts, terminology, naming conventions, composition patterns, for people building *with* Lily.
- [lily-design-system-maintainer-skill](../lily-design-system-maintainer-skill) — technical: required files, `bin/` tooling, the spec-driven workflow, for people working *on* this monorepo.
- Eight framework-umbrella skills (2026-09-05), one `{framework}-skill` per framework family, each mapping that framework's up-to-three real subprojects (headless, helpers, example app — the one layer neither sibling skill below covers) and pointing down into them: `lily-design-system-angular-skill`, `lily-design-system-blazor-skill`, `lily-design-system-html-skill`, `lily-design-system-nunjucks-skill`, `lily-design-system-react-skill`, `lily-design-system-svelte-skill`, `lily-design-system-vue-skill`, `lily-design-system-web-components-skill` (the one with only two subprojects to map — no Web Components example app exists yet).
- Sixteen framework-specific skills (2026-09-04), one `{framework}-headless-skill` and one `{framework}-helpers-skill` per framework family, each scoped to exactly the one real subproject it covers: `lily-design-system-angular-headless-skill`, `lily-design-system-angular-helpers-skill`, `lily-design-system-blazor-headless-skill`, `lily-design-system-blazor-helpers-skill`, `lily-design-system-html-headless-skill`, `lily-design-system-html-helpers-skill`, `lily-design-system-nunjucks-headless-skill`, `lily-design-system-nunjucks-helpers-skill`, `lily-design-system-react-headless-skill`, `lily-design-system-react-helpers-skill`, `lily-design-system-svelte-headless-skill`, `lily-design-system-svelte-helpers-skill`, `lily-design-system-vue-headless-skill`, `lily-design-system-vue-helpers-skill`, `lily-design-system-web-components-headless-skill` (covers its full achievable scope), `lily-design-system-web-components-helpers-skill`.

All twenty-six follow the `lily-design-system-` prefix and get full subproject treatment (the first two as of 2026-08-31 — `lily-design-system-skill` was renamed from `lily-skill`, which deliberately sat outside the prefix — the sixteen framework-specific ones as of 2026-09-04 and the eight framework-umbrella ones as of 2026-09-05, both reversing or extending this topic's earlier "two skills only" decision — see [spec/agent-skills/index.md](../spec/agent-skills/index.md)).

## AI guidance files

[llms.txt](../llms.txt) and [llms.json](../llms.json) at the repository root, spec: [spec/llms-json-and-llms-txt/index.md](../spec/llms-json-and-llms-txt/index.md). A curated map of the project's most important content for AI tools, following the [llms.txt convention](https://llmstxt.org). The docs site publishes its own pair at `lilydesignsystem.github.io/static/llms.txt` and `llms.json` with site-route links instead of repo-relative ones.

## Tools

- [Makefile](../Makefile): `make github-pages` delegates to [bin/make-github-pages](../bin/make-github-pages), see [spec/monorepo-github-pages/index.md](../spec/monorepo-github-pages/index.md)
- [make-github-pages](../bin/make-github-pages): Push `lilydesignsystem.github.io/` to its standalone remote via git subtree — same result as `bin/git-subtree-push lilydesignsystem.github.io`
- [list-components-as-kebab-case](../bin/list-components-as-kebab-case): List components as kebab case
- [list-components-as-pascal-case](../bin/list-components-as-pascal-case): List components as PascalCase
- [list-implementations](../bin/list-implementations): List implementation directories
- [list-helper-packages](../bin/list-helper-packages): List one framework's top-level helper packages in dependency (build) order
- [create-component-directory](../bin/create-component-directory): Scaffold one component directory
- [create-implementation-directory](../bin/create-implementation-directory): Scaffold one implementation directory
- [test](../bin/test): Run all tests
- [sync](../bin/sync): Sync files across subprojects
- [sync-special-files](../bin/sync-special-files): Sync the top-level special files (LICENSE, CONTRIBUTING, SECURITY, GOVERNANCE, …) into every public subtree repo
- [update](../bin/update): Update shared files
- [generate-storybook-stories.mjs](../bin/generate-storybook-stories.mjs): Generate Storybook stories
- [publish-helpers](../bin/publish-helpers): Build and publish every helper package (npm / NuGet)
- [publish-headless](../bin/publish-headless): Build and publish the 7 headless libraries (npm / NuGet)
- [generate-registries](../bin/generate-registries): Regenerate example-app catalog registries from components.tsv
- [check-links](../bin/check-links): Verify relative markdown links resolve
- [check-theme](../bin/check-theme): Verify the 45 reference themes honour their conformance contracts
- [check-class-names](../bin/check-class-names): Every headless implementation carries its kebab-case base class (first in a class list)
- [check-coverage](../bin/check-coverage): Coverage drift matrix — per-component file presence across all 7 headless libraries
- [generate-theme-tokens](../bin/generate-theme-tokens): DTCG token source under themes/tokens/ — extract, generate, drift-check
- [generate-component-categories](../bin/generate-component-categories): Regenerate components-categories.tsv (per-component HTML tag + category) from components.tsv
- [generate-api-docs](../bin/generate-api-docs): Canonical-contract sections on the site's component pages, generated from components/*/AGENTS.md — drift-checked
- [new-component](../bin/new-component): End-to-end scaffolder — one new placeholder component across every layer bin/test verifies
- [generate-examples](../bin/generate-examples): Usage examples (from the docs) and rendered variants (component-variants.json) for every demonstration page
- [extract-site-pages](../bin/extract-site-pages): The docs site's eight main English pages as translation sources (`src/lib/pages/*/en.html`)
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
- `.git-subtree-push`

## For each component directory

- `index.md`
- `README.md` symlink to `index.md`
- `AGENTS.md`
- `spec/index.md` — spec-driven plan + tasks (replaces the older split plan.md / tasks.md)

## Verify

Run `bin/test`.
