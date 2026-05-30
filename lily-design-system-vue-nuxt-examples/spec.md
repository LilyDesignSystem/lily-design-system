# Lily Design System — Vue Nuxt.js Examples — Specification

Living specification for the Nuxt 3 example application that demonstrates the
Lily Design System. Single source of truth for spec-driven development of
this subproject. For project-wide rules, read the root [spec.md](../spec.md)
first.

This file adds Nuxt-specific detail and tracks the example app's
implementation status against the **492 canonical components**.

---

## 1. Role in the ecosystem

This subproject is the **styled reference app** for the Vue 3 / Nuxt 3
ecosystem. It consumes the sibling library `lily-design-system-vue-headless/`
and renders every component with NHS-aligned CSS so visitors can see the
design system working end-to-end.

The app ships:

- The three required routes (`/`, `/components`, `/components/[slug]`) per
  [../AGENTS/examples.md](../AGENTS/examples.md).
- Twelve composed-page demos.
- A complete NHS-aligned stylesheet that targets Lily's kebab-case class
  hooks.

## 2. Scope

### In scope

- A Nuxt 3 app with file-based routing.
- A `/components/[slug]` route that renders a live demo per component for all
  492 components (via `data/component-demos.ts`).
- 12 composed-page demos.
- A complete NHS-aligned CSS stylesheet (`assets/css/nhs.css`).
- Playwright e2e tests for each `/components/[slug]` route.
- Vitest unit tests.
- Storybook for component exploration.

### Explicitly out of scope

- Re-implementing the headless components.
- Tailwind, DaisyUI, Bootstrap, or any CSS framework.
- `nhsuk-` prefixed class names in markup.
- `@testing-library/jest-dom` matchers — vitest built-ins only.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| App framework       | Nuxt 3                                      |
| UI                  | Vue 3 Composition API                       |
| Language            | TypeScript (`<script setup lang="ts">`)     |
| Package manager     | pnpm                                        |
| Unit test           | vitest + @testing-library/vue + jsdom       |
| E2E test            | Playwright                                  |
| Storybook           | yes                                         |
| Styling             | Plain CSS with custom properties (NHS)      |

### Headless dependency

Wrapper components in `components/` (Nuxt auto-imports) re-export from
`../lily-design-system-vue-headless/components/`.

### File layout

```
lily-design-system-vue-nuxt-examples/
├── app.vue                                ← root layout
├── nuxt.config.ts
├── pages/
│   ├── index.vue                          ← /  home
│   ├── components/
│   │   ├── index.vue                      ← /components  catalog index
│   │   └── [slug].vue                     ← /components/{slug}  live demo
│   ├── contact-form.vue                   ← composed-page demos (12)
│   ├── dashboard.vue
│   └── …
├── components/{PascalCase}.vue            ← 492 wrappers re-exporting headless
├── data/
│   ├── component-demos.ts                 ← slug → demo-HTML (492 entries)
│   └── components.ts                      ← catalog metadata (492 entries)
├── assets/css/nhs.css                     ← NHS-aligned stylesheet
├── tests/components/{PascalCase}.test.ts  ← vitest spec per component
├── e2e/components/{kebab-case}.spec.ts    ← Playwright e2e per slug
├── playwright.config.ts
├── vitest.config.ts
└── vitest-setup.ts
```

## 4. Required routes

| Route                  | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `/`                    | Home — welcome, project description, links to demos    |
| `/components`          | Catalog index — every component in `components.tsv`    |
| `/components/[slug]`   | Per-component detail — live demo + metadata            |

`/components/[slug]` renders the demo HTML from `data/component-demos.ts`
using `v-html`. Demo data contains **492 entries** (one per canonical slug).

## 5. Composed-page demos

Twelve composed-page demos exercise multiple components together (matches
the SvelteKit / Next.js apps).

## 6. Styling

- Plain CSS in `assets/css/nhs.css` with NHS-aligned CSS custom properties.
- CSS selectors target the kebab-case Lily class names directly.
- No CSS framework dependency.
- Theme tokens follow [../AGENTS/theme.md](../AGENTS/theme.md).

## 7. Testing

### 7.1 Stack

- **Unit**: vitest + @testing-library/vue + jsdom.
- **E2E**: Playwright (Chromium, Firefox, WebKit).
- Vitest matchers ONLY (no `@testing-library/jest-dom`).

### 7.2 E2E coverage

Each `/components/[slug]` route has a Playwright spec in
`e2e/components/{kebab-case}.spec.ts`.

## 8. Commands

```sh
pnpm install                         # install dependencies
pnpm run dev                         # Nuxt dev server (port 3000)
pnpm run build                       # production build
pnpm run preview                     # preview production build
pnpm test                            # vitest
pnpm exec playwright test            # e2e tests
pnpm run storybook                   # run Storybook
```

## 9. Acceptance criteria

### 9.1 Routes

- [ ] `/` renders home with skip-link + standard landmarks.
- [ ] `/components` lists all 492 canonical components.
- [ ] `/components/[slug]` renders a live demo for all 492 slugs.
- [ ] All 12 composed-page demos exist.

### 9.2 Demo registry

- [ ] `data/component-demos.ts` exports a 492-entry map.
- [ ] `data/components.ts` exports a 492-entry catalog (no orphan slugs).
- [ ] Each demo's class hook matches the canonical kebab-case base class.

### 9.3 Styling

- [ ] `assets/css/nhs.css` targets kebab-case Lily classes.
- [ ] No `nhsuk-` prefixes in markup.
- [ ] No CSS-framework imports.

### 9.4 Accessibility

- [ ] Skip-link first interactive on every page.
- [ ] Standard landmarks wrap every page.
- [ ] WCAG 2.2 AAA target.

### 9.5 Testing

- [ ] `pnpm test` passes.
- [ ] `pnpm exec playwright test` passes.
- [ ] Vitest matchers only.

## 10. Implementation status

### 10.1 Done

- [x] Project infrastructure (`package.json`, `nuxt.config.ts`,
      `vitest.config.ts`, `playwright.config.ts`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] NHS CSS integration (`assets/css/nhs.css`).
- [x] `/` home page.
- [x] `/components` catalog index.
- [x] `/components/[slug]` per-component detail with live demo via `v-html`.
- [x] All 12 composed-page demos.
- [x] Per-component test suite in `tests/components/` (492 specs).
- [x] Playwright e2e per slug.
- [x] Storybook integration (commit `7a51013b`).
- [x] Demo registry backfill: `component-demos.ts` covers all 492 canonical
      slugs (per commit `1f1772e1`).
- [x] Catalog metadata cleaned: orphan `medical-record-red-box` removed.
- [x] TabGroup removal (canonical pattern is TabBar + TabBarButton + TabPanel).

### 10.2 Verified

- [x] `pnpm test` (vitest) passes: **1,373 / 1,373 tests, zero failures**.
- [x] `pnpm exec playwright test` passes: **1,221 / 1,221 specs**
      (3 specs per `/components/[slug]` route × 492 slugs).

### 10.3 Open backlog

- [ ] Audit WCAG 2.2 AAA conformance on every page (needs axe / Lighthouse).
- [ ] Verify responsive design on mobile / desktop / 4K (manual).

## 11. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| `nhsuk-` prefixes in markup       | CSS targets Lily classes directly   |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| `@testing-library/jest-dom`       | vitest matchers only                |
| Re-implementing headless comps    | import from sibling library         |
| `<style scoped>` in shared CSS    | use plain CSS in `assets/css/`      |

## 12. Tracking

- Package: `lily-design-system-vue-nuxt-examples`
- Version: 0.2.0
- App framework: Nuxt 3 + Vue 3 + TypeScript
- Test runners: vitest + Playwright
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 492 components
- Root spec: [../spec.md](../spec.md)
- Sibling headless library: [../lily-design-system-vue-headless/](../lily-design-system-vue-headless/)
