# Lily Design System - Nunjucks Example

@AGENTS/lily.md
@AGENTS/components.md
@AGENTS/accessibility.md
@AGENTS/internationalization.md
@AGENTS/nunjucks.md
@AGENTS/nhs-uk-design-system-references.md

## Metadata

- Package: lily-design-system-nunjucks-example
- Version: 0.1.0
- Created: 2026-04-18
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause or contact us for more
- Contact: Joel Parker Henderson (joel@joelparkerhenderson.com)

## IMPORTANT architecture

- Eleventy 3.x static site generator
- Nunjucks template engine (matches the headless project)
- Depends on `lily-design-system-nunjucks-headless` via a shared
  Nunjucks `FileSystemLoader` search path in `.eleventy.js`
- CSS recreates the NHS UK visual design language on Lily class names
- Progressive-enhancement JavaScript: pages work without JS
- No CSS framework (no Tailwind, no DaisyUI, no Bootstrap)
- No SCSS; plain CSS with custom-property tokens
- No bundled proprietary fonts
- Static site output in `_site/`

## NO

- No framework coupling (React, Svelte, Vue, Angular, Blazor)
- No SSR server runtime
- No Tailwind, no DaisyUI, no Bootstrap
- No SCSS / Sass / Less
- No bundled Frutiger font files (the stack uses Frutiger with
  Arial fallback, exactly as NHS UK specifies)
- No analytics, trackers, or third-party scripts
- No `nhsuk-` prefixed class names in markup; we style Lily classes

## Directory structure

See `nunjucks-plan.md` for the full tree. Key paths:

- `src/` — Eleventy input
- `src/_data/` — site and component data
- `src/_includes/layouts/` — base, page, component-demo
- `src/_includes/partials/` — header, footer, sidebar-nav, breadcrumb
- `src/assets/css/tokens/` — design tokens (colors, spacing,
  typography, breakpoints, focus)
- `src/assets/css/base/` — reset, page, typography, links, focus
- `src/assets/css/layout/` — width-container, grid, grail-layout
- `src/assets/css/components/` — one file per component (or tight
  family)
- `src/assets/js/modules/` — one JS module per interactive pattern
- `src/components/` — one demo page per component (`{kebab}.njk`)
- `src/page-templates/` — composed page examples
- `_site/` — Eleventy output (gitignored)

## CSS authoring rules

- Target Lily class names only (kebab-case). Do not add new classes
  in the markup.
- Use CSS custom properties for every colour, spacing, and size.
- Mobile-first media queries.
- One component per file under `components/` where possible; tight
  families (e.g. table parts) may share a file.
- No inline styles in templates.

## JavaScript authoring rules

- Vanilla JS, ES modules, one module per behaviour.
- Progressive enhancement: nothing on the page breaks without JS.
- Initialise via `data-module` attributes in the DOM.
- No bundlers; modern browsers only.

## Accessibility

- WCAG 2.2 AAA.
- Skip link is the first interactive element on every page.
- `<header>`, `<nav>`, `<main>`, `<footer>` landmarks on every page.
- Yellow/black focus ring on every focusable element.
- Keyboard-only user can complete every demo flow.

## Titles

- PackagePascalCase: `LilyNunjucksExample`
- package-kebab-case: `lily-design-system-nunjucks-example`
- package_snake_case: `lily_nunjucks_example`

## Helpers

- Start dev server: `pnpm dev`
- Build the static site: `pnpm build`
- Run tests: `pnpm test`

## Verify

- `pnpm build` must exit zero
- `pnpm test` must pass
- See `nunjucks-plan.md` acceptance criteria and `tasks.md`
  verification section
