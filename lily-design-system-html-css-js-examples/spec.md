# Lily Design System — HTML CSS JS Examples — Specification

Living specification for the framework-free HTML + CSS + JS example app that
demonstrates the Lily Design System. Single source of truth for spec-driven
development of this subproject. For project-wide rules, read the root
[spec.md](../spec.md) first.

This file adds plain-HTML-specific detail and tracks the example app's
implementation status against the **407 canonical components**.

---

## 1. Role in the ecosystem

This subproject is the **styled reference app** for the framework-free
(plain HTML + vanilla JavaScript) consumer. It demonstrates how to use the
Lily Design System without any UI framework — no React, no Svelte, no Vue,
no Angular, no Blazor. The visual reference is NHS UK, applied to Lily's
kebab-case class hooks.

The app ships:

- The three required routes (`/`, `/components`, `/components/{slug}`) per
  [../AGENTS/examples.md](../AGENTS/examples.md), implemented as static HTML
  pages plus a small client-side router for the per-slug detail page.
- Twelve composed-page demos (each a separate HTML file under `pages/`).
- A complete NHS-aligned stylesheet that targets Lily's kebab-case class
  hooks.

## 2. Scope

### In scope

- A single static SPA-ish set of HTML pages. No build step required.
- A `pages/components/component.html` SPA shell that dispatches on the
  `?slug=` query and renders the demo via `innerHTML` from a JavaScript
  `componentDemos` object literal embedded in the page.
- 12 composed-page demos as standalone HTML files under `pages/`.
- A complete NHS-aligned CSS stylesheet (`assets/css/nhs.css`).
- WebDriverIO and Playwright e2e tests.

### Explicitly out of scope

- Frameworks (no React, Svelte, Vue, Angular, Blazor, jQuery).
- TypeScript — plain JavaScript only.
- Build tools (no Vite, Webpack, Rollup, esbuild).
- Server-side rendering, server runtime.
- Tailwind, DaisyUI, Bootstrap, or any CSS framework.
- `nhsuk-` prefixed class names in markup.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| App                 | Plain HTML + vanilla JavaScript             |
| Routing             | One HTML file per route + client-side `?slug=` |
| Language            | JavaScript (no TS)                          |
| Build               | None                                        |
| Package manager     | pnpm (dev-only, for test tooling)           |
| Unit / smoke test   | WebDriverIO                                 |
| E2E test            | Playwright                                  |
| Styling             | Plain CSS with custom properties (NHS)      |

### Headless dependency

Components are copied from
`../lily-design-system-html-headless/components/{kebab}.html` — they are
plain HTML snippets that this app embeds directly into pages.

### File layout

```
lily-design-system-html-css-js-examples/
├── pages/
│   ├── index.html                         ← /  home
│   ├── components/
│   │   ├── index.html                     ← /components  catalog index
│   │   └── component.html                 ← /components?slug=…  detail page
│   ├── contact-form/index.html            ← composed-page demos (12)
│   ├── dashboard/index.html
│   └── …
├── assets/css/nhs.css                     ← NHS-aligned stylesheet
├── tests/                                 ← WebDriverIO smoke tests
├── e2e/components/{kebab-case}.spec.ts    ← Playwright e2e per slug
├── wdio.conf.js
├── playwright.config.ts
└── package.json
```

## 4. Required routes

| Route                       | File                                    | Purpose                          |
| --------------------------- | --------------------------------------- | -------------------------------- |
| `/`                         | `pages/index.html`                      | Home, links to demos             |
| `/components`               | `pages/components/index.html`           | Catalog index                    |
| `/components?slug={slug}`   | `pages/components/component.html`       | Per-component live demo via JS   |

The catalog index lists all 407 canonical slugs and links each entry to
`component.html?slug={slug}`. `component.html` reads the `slug` query
parameter and renders `componentDemos[slug]` via `element.innerHTML`.

`componentDemos` is a JavaScript object literal embedded in
`pages/components/component.html` with **407 entries** (one per canonical
slug).

## 5. Composed-page demos

Twelve composed-page demos exercise multiple components together. Each lives
in its own `pages/{kebab-case}/index.html`. The composed-page set matches
the other example apps.

## 6. Styling

- Plain CSS in `assets/css/nhs.css` with NHS-aligned CSS custom properties.
- CSS selectors target the kebab-case Lily class names directly.
- No CSS framework dependency.
- Theme tokens follow [../AGENTS/theme.md](../AGENTS/theme.md).

## 7. JavaScript conventions

- Vanilla JavaScript only. No TypeScript.
- IIFE pattern for page-level scripts: `(function () { "use strict"; … })();`.
- No bundlers — pages link `<script>` tags directly.
- No polyfills — target evergreen browsers (last 2 versions of Chrome,
  Firefox, Safari, Edge).
- Demo registry stored as a JS object literal embedded in
  `component.html`. Single-quoted strings; escape literal newlines (`\n`)
  inside HTML strings — JavaScript single-quoted strings cannot span raw
  newlines (regression risk).

## 8. Testing

### 8.1 Stack

- **Smoke**: WebDriverIO (`pnpm exec wdio run wdio.conf.js`).
- **E2E**: Playwright across Chromium, Firefox, WebKit.

### 8.2 E2E coverage

Each `/components?slug={slug}` route has a Playwright spec in
`e2e/components/{kebab-case}.spec.ts`. The spec asserts:

1. The page loads with HTTP 200 when given a valid slug.
2. The rendered demo contains the canonical kebab-case class hook.
3. Standard landmarks wrap every page.

## 9. Commands

```sh
pnpm install                                  # install dev dependencies
pnpm exec wdio run wdio.conf.js               # WebDriverIO smoke tests
pnpm exec playwright test                     # e2e tests
npx http-server pages -p 8080                 # serve locally for manual testing
```

## 10. Acceptance criteria

### 10.1 Routes

- [ ] `pages/index.html` renders home with skip-link + standard landmarks.
- [ ] `pages/components/index.html` lists all 407 canonical components.
- [ ] `pages/components/component.html` renders a live demo for all 407
      canonical slugs.
- [ ] All 12 composed-page demos exist.

### 10.2 Demo registry

- [x] `pages/components/component.html` `componentDemos` covers all 407
      canonical slugs (per commit `1f1772e1`).
- [x] No orphan slugs (`medical-record-red-box` purged in favour of
      `medical-banner-box-for-danger`).
- [x] No raw newlines inside single-quoted JS string values (regression
      fixed in commit `1f1772e1`).

### 10.3 Styling

- [ ] `assets/css/nhs.css` targets kebab-case Lily classes.
- [ ] No `nhsuk-` prefixes in markup.
- [ ] No CSS-framework imports.

### 10.4 Accessibility

- [ ] Skip-link first interactive on every page.
- [ ] Standard landmarks wrap every page.
- [ ] WCAG 2.2 AAA target.

### 10.5 Testing

- [ ] `pnpm exec wdio run wdio.conf.js` passes.
- [ ] `pnpm exec playwright test` passes.

## 11. Implementation status

### 11.1 Done

- [x] Project infrastructure (`package.json`, `wdio.conf.js`,
      `playwright.config.ts`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] NHS CSS integration (`assets/css/nhs.css`).
- [x] `pages/index.html` (home).
- [x] `pages/components/index.html` (catalog index).
- [x] `pages/components/component.html` (per-slug detail).
- [x] All 12 composed-page demos.
- [x] WebDriverIO smoke tests.
- [x] Playwright e2e per slug.
- [x] Demo registry backfill: `componentDemos` covers all 407 canonical
      slugs.
- [x] Catalog rename: `medical-record-red-box` → `medical-banner-box-for-danger`.

### 11.2 Verified

- [x] `pnpm exec wdio run wdio.conf.js` passes: **13 / 13 spec files**
      (composed-page integration tests).
- [x] `pnpm exec playwright test` passes: **814 / 814 specs**
      (2 specs per `/components?slug={slug}` route × 407 slugs).
- [x] Every demo's class hook matches the canonical kebab-case base
      class (verified by the Playwright catalog sweep + the headless
      sibling library audit at 407 / 407).

### 11.3 Open backlog

- [ ] Audit WCAG 2.2 AAA conformance on every page (needs axe / Lighthouse).
- [ ] Verify responsive design on mobile / desktop / 4K (manual).

## 12. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| UI frameworks (React, etc.)       | this is the framework-free reference |
| TypeScript                        | plain JavaScript only               |
| Build tools                       | pages must load directly            |
| `nhsuk-` prefixes in markup       | CSS targets Lily classes directly   |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| Raw newlines in JS strings        | invalid JS, breaks page load        |

## 13. Tracking

- Package: `lily-design-system-html-css-js-examples`
- Version: 0.2.0
- App framework: Plain HTML + vanilla JavaScript
- Test runners: WebDriverIO + Playwright
- Build: none
- Package manager: pnpm (dev-only)
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 407 components
- Root spec: [../spec.md](../spec.md)
- Sibling headless library: [../lily-design-system-html-headless/](../lily-design-system-html-headless/)
