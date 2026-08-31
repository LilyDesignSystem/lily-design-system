# Lily Design System

Living specification: [spec/index.md](../spec/index.md)

[CSS style sheet template](../css-style-sheet-template.css)

Canonical component list: [components.tsv](../components.tsv) — 491 components.

## Subprojects for headless components

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

Each catalog ships five `*-picker` helpers — theme-picker, locale-picker, text-size-picker, share-picker, date-time-picker. The first four are an icon button that opens a popup; none is a native `<select>` any more. `date-time-picker` is the exception: a form control, so it pairs a typeable text field with its trigger and opens an APG date-picker dialog. Svelte is the canonical reference; the other six are idiom ports.

- [Lily Design System: HTML helpers](../lily-design-system-html-helpers)
- [Lily Design System: Svelte helpers](../lily-design-system-svelte-helpers)
- [Lily Design System: React helpers](../lily-design-system-react-helpers)
- [Lily Design System: Vue helpers](../lily-design-system-vue-helpers)
- [Lily Design System: Angular helpers](../lily-design-system-angular-helpers)
- [Lily Design System: Blazor helpers](../lily-design-system-blazor-helpers)
- [Lily Design System: Nunjucks helpers](../lily-design-system-nunjucks-helpers)

## Reference themes

The [themes/](../themes) directory ships 45 standalone theme stylesheets (NHS England/Scotland/Wales patient + practitioner variants, GOV.UK GDS, USWDS, Adobe Spectrum, Mozilla Protocol, and general-purpose themes) that target the Lily class hooks; the theme-picker helper loads them at runtime.

## Agent skills

Two top-level Claude Skill packages, spec: [spec/agent-skills/index.md](../spec/agent-skills/index.md).

- [lily-design-system-skill](../lily-design-system-skill) — general-purpose: concepts, terminology, naming conventions, composition patterns, for people building *with* Lily.
- [lily-design-system-maintainer-skill](../lily-design-system-maintainer-skill) — technical: required files, `bin/` tooling, the spec-driven workflow, for people working *on* this monorepo.

Both follow the `lily-design-system-` prefix and get full subproject treatment (as of 2026-08-31; `lily-design-system-skill` was renamed from `lily-skill`, which deliberately sat outside the prefix — see [spec/agent-skills/index.md](../spec/agent-skills/index.md)).

## AI guidance files

[llms.txt](../llms.txt) and [llms.json](../llms.json) at the repository root, spec: [spec/llms-json-and-llms-txt/index.md](../spec/llms-json-and-llms-txt/index.md). A curated map of the project's most important content for AI tools, following the [llms.txt convention](https://llmstxt.org). The docs site publishes its own pair at `lilydesignsystem.github.io/static/llms.txt` and `llms.json` with site-route links instead of repo-relative ones.

## Tools

- [Makefile](../Makefile): `make github-pages` pushes `lilydesignsystem.github.io/` to its standalone remote via git subtree — same result as `bin/git-subtree-push lilydesignsystem.github.io`, see [spec/monorepo-github-pages/index.md](../spec/monorepo-github-pages/index.md)
- [list-components-as-kebab-case](../bin/list-components-as-kebab-case): List components as kebab case
- [list-components-as-pascal-case](../bin/list-components-as-pascal-case): List components as PascalCase
- [list-implementations](../bin/list-implementations): List implementation directories
- [create-component-directory](../bin/create-component-directory): Scaffold one component directory
- [create-implementation-directory](../bin/create-implementation-directory): Scaffold one implementation directory
- [test](../bin/test): Run all tests
- [sync](../bin/sync): Sync files across subprojects
- [sync-special-files](../bin/sync-special-files): Sync the top-level special files (LICENSE, CONTRIBUTING, SECURITY, GOVERNANCE, …) into every public subtree repo
- [update](../bin/update): Update shared files
- [generate-storybook-stories.mjs](../bin/generate-storybook-stories.mjs): Generate Storybook stories
- [publish-helpers](../bin/publish-helpers): Build and publish the 35 helper packages (npm / NuGet)
- [publish-headless](../bin/publish-headless): Build and publish the 7 headless libraries (npm / NuGet)
- [generate-registries](../bin/generate-registries): Regenerate example-app catalog registries from components.tsv
- [check-links](../bin/check-links): Verify relative markdown links resolve
- [check-theme](../bin/check-theme): Verify the 45 reference themes honour their conformance contracts
- [check-coverage](../bin/check-coverage): Coverage drift matrix — per-component file presence across all 7 headless libraries
- [generate-theme-tokens](../bin/generate-theme-tokens): DTCG token source under themes/tokens/ — extract, generate, drift-check
- [generate-component-categories](../bin/generate-component-categories): Regenerate components-categories.tsv (per-component HTML tag + category) from components.tsv
- [generate-api-docs](../bin/generate-api-docs): Canonical-contract sections on the site's component pages, generated from components/*/AGENTS.md — drift-checked
- [new-component](../bin/new-component): End-to-end scaffolder — one new placeholder component across every layer bin/test verifies
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
- `CLAUDE.md` that loads `AGENTS.md`
- `spec/index.md` — spec-driven plan + tasks (replaces the older split plan.md / tasks.md)
- `.git-subtree-push`

## For each component directory

- `index.md`
- `README.md` symlink to `index.md`
- `AGENTS.md`
- `CLAUDE.md`
- `spec/index.md` — spec-driven plan + tasks (replaces the older split plan.md / tasks.md)

## Verify

Run `bin/test`.
