# Lily Design System — Svelte SvelteKit Examples — Specification

Living specification for the SvelteKit 2 example application that demonstrates
the Lily Design System. Single source of truth for spec-driven development of
this subproject. For project-wide rules, read the root [spec.md](../spec.md)
first.

This file adds SvelteKit-specific detail and tracks the example app's
implementation status against the **492 canonical components**.

---

## 1. Role in the ecosystem

This subproject is the **styled reference app** for the Svelte 5 / SvelteKit 2
ecosystem. It consumes the sibling library
`lily-design-system-svelte-headless/` and renders every component with
NHS-aligned CSS so visitors can see the design system working end-to-end.

The app ships:

- The three required routes (`/`, `/components`, `/components/[slug]`) per the
  root [AGENTS/examples.md](../AGENTS/examples.md).
- Twelve composed-page demos that exercise components together.
- A complete NHS-aligned stylesheet that targets Lily's kebab-case class hooks
  (no `nhsuk-` prefixes).

## 2. Scope

### In scope

- A SvelteKit 2 app with file-based routing.
- A `/components/[slug]` route that renders a live demo per component for all
  492 components (via `component-demos.ts`).
- 12 composed-page demos: contact-form, dashboard, dialog-flow,
  file-upload-form, navigation-and-menus, page-layout, rating-and-feedback,
  search-and-filter, settings-page, tabbed-interface, task-management,
  timeline-and-cards.
- A complete NHS-aligned CSS stylesheet (`src/lib/css/nhs.css`).
- Playwright e2e tests for each `/components/[slug]` route and each composed
  page.
- Vitest unit tests for page logic.

### Explicitly out of scope

- Re-implementing the headless components (they live in
  `lily-design-system-svelte-headless/`).
- Tailwind, DaisyUI, Bootstrap, or any CSS framework.
- `nhsuk-` prefixed class names in markup (CSS targets the Lily classes).
- `@testing-library/jest-dom` matchers — vitest built-ins only.
- A custom design system — NHS UK is the visual reference.

## 3. Architecture

### Framework + tooling

| Concern             | Choice                                      |
| ------------------- | ------------------------------------------- |
| App framework       | SvelteKit 2 (Svelte 5 with runes)           |
| Language            | TypeScript                                  |
| Build tool          | Vite                                        |
| Package manager     | pnpm                                        |
| Unit test           | vitest + @testing-library/svelte + jsdom    |
| E2E test            | Playwright                                  |
| Styling             | Plain CSS with custom properties (NHS palette) |

### Headless dependency

Components are imported from the sibling library via a workspace dependency
or path alias to `../lily-design-system-svelte-headless/src/lib/components/`.

### File layout

```
lily-design-system-svelte-sveltekit-examples/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte                 ← global shell, skip-link, header,
│   │   │                                    footer, NHS CSS import
│   │   ├── +page.svelte                   ← /  home
│   │   ├── components/
│   │   │   ├── +page.svelte               ← /components  catalog index
│   │   │   └── [slug]/+page.svelte        ← /components/{slug}  live demo
│   │   ├── contact-form/+page.svelte      ← composed-page demos (12)
│   │   ├── dashboard/+page.svelte
│   │   └── …
│   ├── lib/
│   │   ├── components/{PascalCase}/       ← re-exports from headless library
│   │   ├── data/component-demos.ts        ← slug → demo-HTML map (492 entries)
│   │   └── css/nhs.css                    ← NHS-aligned stylesheet
├── e2e/components/{kebab-case}.spec.ts    ← Playwright e2e per slug
├── playwright.config.ts
├── vite.config.ts
├── vitest-setup.ts
└── package.json
```

## 4. Required routes

Every example subproject must ship these three routes per the root
[AGENTS/examples.md](../AGENTS/examples.md):

| Route                  | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `/`                    | Home — welcome, project description, links to demos    |
| `/components`          | Catalog index — every component in `components.tsv`    |
| `/components/[slug]`   | Per-component detail — live demo + metadata            |

`/components/[slug]` renders the demo HTML from `component-demos.ts` using
`{@html demo}`. Demo data lives in `src/lib/data/component-demos.ts` and
contains **492 entries** (one per canonical slug).

## 5. Composed-page demos

Twelve composed-page demos exercise multiple components together:

| Page                     | Key components                                                 |
| ------------------------ | -------------------------------------------------------------- |
| `/contact-form`          | Form, Field, TextInput, EmailInput, TextAreaInput, Select, Button, ErrorSummary |
| `/dashboard`             | Card, Progress, ProgressCircle, Badge, Banner, DataTable       |
| `/dialog-flow`           | Dialog, AlertDialog, Drawer, Tooltip, Button                   |
| `/file-upload-form`      | FileUpload, Progress, Button, Alert, Badge, Form, Field        |
| `/navigation-and-menus`  | NavigationMenu, MenuBar, ToolBar, HamburgerMenu, DropdownMenu  |
| `/page-layout`           | Header, Footer, BreadcrumbNav, Sidebar, NavigationMenu         |
| `/rating-and-feedback`   | FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker |
| `/search-and-filter`     | Combobox, SearchInput, TagInput, TagGroup, Tag, DataTable, Badge |
| `/settings-page`         | SwitchButton, RadioGroup, RadioInput, Select, Fieldset, Banner |
| `/tabbed-interface`      | TabBar, TabBarButton, TabPanel, AccordionNav, Badge            |
| `/task-management`       | TaskList, TaskListItem, TextInput, CheckboxInput, Badge, Progress |
| `/timeline-and-cards`    | TimelineList, Card, DateRange, ReviewDate, SummaryList         |

## 6. Styling

- Plain CSS in `src/lib/css/nhs.css` with NHS-aligned CSS custom properties
  (colour, spacing, typography, focus state).
- CSS selectors target the kebab-case Lily class names directly. No
  `nhsuk-` prefixes in markup.
- No CSS framework dependency (Tailwind, DaisyUI, Bootstrap are forbidden).
- Theme tokens follow the shape in [../AGENTS/theme.md](../AGENTS/theme.md).

## 7. Testing

### 7.1 Stack

- **Unit / component**: vitest + @testing-library/svelte + jsdom.
- **E2E**: Playwright across Chromium, Firefox, WebKit.
- Vitest matchers ONLY (no `@testing-library/jest-dom`).

### 7.2 E2E coverage

Each `/components/[slug]` route has a Playwright spec in
`e2e/components/{kebab-case}.spec.ts` that asserts:

1. The page loads with HTTP 200.
2. The page heading matches the component PascalCase name.
3. The live-demo block contains the canonical kebab-case class hook.
4. Skip-link is the first interactive element.
5. Standard landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) are present.

## 8. Commands

```sh
pnpm install                         # install dependencies
pnpm run dev                         # SvelteKit dev server (port 5173)
pnpm run build                       # production build
pnpm run preview                     # preview production build
pnpm test                            # vitest
pnpm exec playwright test            # e2e tests
```

## 9. Acceptance criteria

### 9.1 Routes

- [ ] `/` renders home page with skip-link and standard landmarks.
- [ ] `/components` lists all 492 canonical components, searchable / filterable.
- [ ] `/components/[slug]` renders a live demo for all 492 slugs.
- [ ] All 12 composed-page demos exist and exercise the listed components.

### 9.2 Demo registry

- [ ] `src/lib/data/component-demos.ts` exports a 492-entry map keyed by
      canonical slug.
- [ ] Each demo's class hook matches the canonical kebab-case base class.
- [ ] No orphan slugs (every key exists in `components.tsv`).

### 9.3 Styling

- [ ] `src/lib/css/nhs.css` targets kebab-case Lily classes.
- [ ] No `nhsuk-` prefixes in markup.
- [ ] No CSS-framework imports.
- [ ] Theme tokens follow [../AGENTS/theme.md](../AGENTS/theme.md).

### 9.4 Accessibility

- [ ] Skip-link is the first interactive element on every page.
- [ ] Standard landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) wrap
      every page.
- [ ] Focus indicators are visible and high-contrast.
- [ ] WCAG 2.2 AAA target.

### 9.5 Testing

- [ ] `pnpm test` passes.
- [ ] `pnpm exec playwright test` passes across Chromium, Firefox, WebKit.
- [ ] Vitest matchers only (no jest-dom).

## 10. Implementation status

### 10.1 Done

- [x] Project infrastructure (`package.json`, `vite.config.ts`,
      `vitest-setup.ts`, `playwright.config.ts`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] NHS CSS integration (`src/lib/css/nhs.css`).
- [x] `/` home page.
- [x] `/components` catalog index page.
- [x] `/components/[slug]` per-component detail page with live demo via
      `{@html}`.
- [x] All 12 composed-page demos.
- [x] Playwright e2e per slug (commit `7a51013b`).
- [x] Demo registry backfill: `component-demos.ts` covers all 492 canonical
      slugs (per commit `1f1772e1`).
- [x] TabGroup removal (canonical pattern is TabBar + TabBarButton + TabPanel).
- [x] Catalog rename: `medical-record-red-box` → `medical-banner-box-for-danger`.

### 10.2 Verified

- [x] `pnpm test` (vitest) passes: **2,007 / 2,007 tests, zero failures**.
- [x] `pnpm exec playwright test` passes: **1,221 / 1,221 specs**
      (3 specs per `/components/[slug]` route × 492 slugs).
- [x] Every component's live demo renders the canonical HTML tag
      (verified by the Playwright catalog sweep).

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
| Hardcoded strings outside demos   | demos may use English; CSS class    |
|                                   | hooks are stable                    |

## 12. Tracking

- Package: `lily-design-system-svelte-sveltekit-examples`
- Version: 0.2.0
- App framework: SvelteKit 2 (Svelte 5 with runes)
- Test runners: vitest + Playwright
- Build tool: Vite
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 492 components
- Root spec: [../spec.md](../spec.md)
- Sibling headless library: [../lily-design-system-svelte-headless/](../lily-design-system-svelte-headless/)
