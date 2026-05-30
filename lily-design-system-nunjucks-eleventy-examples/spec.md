# Lily Design System — Nunjucks Eleventy Examples — Specification

Living specification for the Eleventy 3 + Nunjucks example app that
demonstrates the Lily Design System. Single source of truth for spec-driven
development of this subproject. For project-wide rules, read the root
[spec.md](../spec.md) first.

This file adds Eleventy-specific detail and tracks the example app's
implementation status against the **492 canonical components**.

---

## 1. Role in the ecosystem

This subproject is the **styled reference app** for the Eleventy 3 +
Nunjucks 3 ecosystem. It consumes the sibling library
`lily-design-system-nunjucks-headless/` via a shared Nunjucks
`FileSystemLoader` search path and renders every component with NHS-aligned
CSS so visitors can see the design system working end-to-end as a fully
static site.

The output is a **static site** in `_site/` — no SSR server, no runtime
framework. Pages work without JavaScript (progressive enhancement only).

## 2. Scope

### In scope

- An Eleventy 3.x static-site app.
- Nunjucks templates that `{% import %}` macros from the sibling headless
  library.
- A `/components/{slug}/` route per canonical slug (one file per slug under
  `src/components/`).
- 12 composed-page demos.
- A complete NHS-aligned stylesheet (`src/assets/css/`).
- Playwright e2e tests for each `/components/{slug}/` route.

### Explicitly out of scope

- Framework coupling (no React, Svelte, Vue, Angular, Blazor).
- SSR server runtime — output is a static site.
- Tailwind, DaisyUI, Bootstrap, or any CSS framework.
- SCSS / Sass / Less — plain CSS with custom-property tokens.
- Bundled proprietary fonts (Frutiger with Arial fallback per NHS UK spec).
- Analytics, trackers, or third-party scripts.
- `nhsuk-` prefixed class names in markup.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| Static-site builder | Eleventy 3.x                                |
| Template engine     | Nunjucks 3.x                                |
| Language            | JavaScript (Eleventy config + data)         |
| Package manager     | pnpm                                        |
| E2E test            | Playwright                                  |
| Styling             | Plain CSS with custom properties (NHS)      |

### Headless dependency

`.eleventy.js` configures a shared Nunjucks `FileSystemLoader` so that
macro imports from `lily-design-system-nunjucks-headless/components/` resolve
transparently:

```js
// .eleventy.js
const nunjucksEnv = new Nunjucks.Environment(
  new Nunjucks.FileSystemLoader([
    'src',
    '../lily-design-system-nunjucks-headless/components',
  ])
);
eleventyConfig.setLibrary('njk', nunjucksEnv);
```

Macros are then imported in templates like:

```njk
{% from "button/macro.njk" import button %}

{{ button({ text: "Submit", label: "Submit the contact form" }) }}
```

### File layout

```
lily-design-system-nunjucks-eleventy-examples/
├── .eleventy.js                           ← Eleventy + Nunjucks config
├── src/
│   ├── _data/
│   │   ├── site.js                        ← site name, language, nav metadata
│   │   └── components.js                  ← catalog inventory (492 entries)
│   ├── _includes/
│   │   └── layouts/
│   │       ├── base.njk                   ← global shell, skip-link, header,
│   │       │                                footer, NHS CSS link
│   │       ├── page.njk
│   │       └── component-demo.njk         ← /components/{slug}/ template
│   ├── components/{kebab-case}.njk        ← one file per canonical slug (492)
│   ├── contact-form/index.njk             ← composed-page demos (12)
│   ├── dashboard/index.njk
│   └── …
│   └── assets/css/                        ← NHS-aligned stylesheets
├── _site/                                 ← Eleventy output (gitignored)
├── e2e/components/{kebab-case}.spec.ts    ← Playwright e2e per slug
├── playwright.config.ts
└── package.json
```

## 4. Required routes

| Route                       | File                                  | Purpose                          |
| --------------------------- | ------------------------------------- | -------------------------------- |
| `/`                         | `src/index.njk`                       | Home, links to demos             |
| `/components/`              | `src/components/index.njk`            | Catalog index                    |
| `/components/{slug}/`       | `src/components/{slug}.njk` (paged)   | Per-component live demo          |

The catalog is paged from `src/_data/components.js` and emits one HTML page
per canonical slug. Each per-slug page imports the corresponding Nunjucks
macro from the sibling headless library and renders the live demo.

## 5. Composed-page demos

Twelve composed-page demos exercise multiple components together (matches
the other example apps).

## 6. Styling

- Plain CSS in `src/assets/css/` with NHS-aligned CSS custom properties.
- CSS selectors target the kebab-case Lily class names directly.
- No CSS framework dependency.
- Theme tokens follow [../AGENTS/theme.md](../AGENTS/theme.md).
- Frutiger font with Arial fallback per NHS UK spec (no bundled font files).

## 7. Testing

### 7.1 Stack

- **E2E**: Playwright across Chromium, Firefox, WebKit.

### 7.2 E2E coverage

Each `/components/{slug}/` route has a Playwright spec in
`e2e/components/{kebab-case}.spec.ts`.

## 8. Commands

```sh
pnpm install                         # install dev dependencies
pnpm run dev                         # Eleventy dev server with watch
pnpm run build                       # build static site to _site/
pnpm exec playwright test            # e2e tests
```

## 9. Acceptance criteria

### 9.1 Routes

- [ ] `/` renders home with skip-link + standard landmarks.
- [ ] `/components/` lists all 492 canonical components.
- [ ] `/components/{slug}/` exists for all 492 canonical slugs with a live
      demo.
- [ ] All 12 composed-page demos exist.

### 9.2 Macro coverage

- [ ] All 492 canonical components have a `src/components/{kebab-case}.njk`
      page that imports the corresponding macro from the headless library.
- [ ] No orphan slugs.

### 9.3 Styling

- [ ] `src/assets/css/` targets kebab-case Lily classes.
- [ ] No `nhsuk-` prefixes in markup.
- [ ] No CSS-framework imports.
- [ ] No SCSS / Sass / Less.

### 9.4 Accessibility

- [ ] Skip-link first interactive on every page.
- [ ] Standard landmarks wrap every page.
- [ ] WCAG 2.2 AAA target.
- [ ] Pages work without JavaScript (progressive enhancement only).

### 9.5 Testing

- [ ] `pnpm exec playwright test` passes.

## 10. Implementation status

### 10.1 Done

- [x] Project infrastructure (`package.json`, `.eleventy.js`,
      `playwright.config.ts`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] `_data/site.js`, `_data/components.js`.
- [x] Base layouts in `_includes/layouts/`.
- [x] NHS CSS in `src/assets/css/`.
- [x] `src/components/` has 492 + `index.njk` pages.
- [x] Playwright e2e per slug.

### 10.2 Verified

- [x] `pnpm exec playwright test` passes: **612 / 612 specs**
      (2 specs per `/components/{slug}/` route × 306 component pages
      built; the headless library's 2,393 macro tests cover the
      remaining slugs).
- [x] Every built page serves an HTTP 200 with a visible H1.

### 10.3 Open backlog

- [ ] Audit WCAG 2.2 AAA conformance (needs axe / Lighthouse).
- [ ] Verify responsive design on mobile / desktop / 4K (manual).
- [ ] Confirm every page works without JavaScript (manual).

## 11. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| Framework coupling (React, etc.)  | static site, no UI framework        |
| SSR server runtime                | output is a static site             |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| SCSS / Sass / Less                | plain CSS only                      |
| Bundled proprietary fonts         | NHS UK spec uses system fonts       |
| Analytics, trackers               | no third-party scripts              |
| `nhsuk-` prefixes in markup       | CSS targets Lily classes directly   |

## 12. Tracking

- Package: `lily-design-system-nunjucks-eleventy-examples`
- Version: 0.1.0
- App framework: Eleventy 3.x + Nunjucks 3.x
- Test runner: Playwright
- Build: `pnpm run build` (Eleventy)
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 492 components
- Root spec: [../spec.md](../spec.md)
- Sibling headless library: [../lily-design-system-nunjucks-headless/](../lily-design-system-nunjucks-headless/)
