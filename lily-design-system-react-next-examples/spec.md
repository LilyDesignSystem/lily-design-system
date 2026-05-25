# Lily Design System — React Next.js Examples — Specification

Living specification for the Next.js 15 example application that demonstrates
the Lily Design System. Single source of truth for spec-driven development of
this subproject. For project-wide rules, read the root [spec.md](../spec.md)
first.

This file adds Next.js-specific detail and tracks the example app's
implementation status against the **407 canonical components**.

---

## 1. Role in the ecosystem

This subproject is the **styled reference app** for the React 19 / Next.js 15
ecosystem. It consumes the sibling library
`lily-design-system-react-headless/` and renders every component with
NHS-aligned CSS so visitors can see the design system working end-to-end.

The app ships:

- The three required routes (`/`, `/components`, `/components/[slug]`) per
  [../AGENTS/examples.md](../AGENTS/examples.md).
- Twelve composed-page demos that exercise components together.
- A complete NHS-aligned stylesheet that targets Lily's kebab-case class
  hooks (no `nhsuk-` prefixes).

## 2. Scope

### In scope

- A Next.js 15 App Router app.
- A `/components/[slug]` route that renders a live demo per component for all
  407 components (via `component-demos.ts`).
- 12 composed-page demos.
- A complete NHS-aligned CSS stylesheet (`assets/css/nhs.css`).
- Playwright e2e tests for each `/components/[slug]` route.
- Vitest unit tests for component wrappers.
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
| App framework       | Next.js 15 (App Router)                     |
| Runtime             | React 19                                    |
| Language            | TypeScript                                  |
| Package manager     | pnpm                                        |
| Unit test           | vitest + @testing-library/react + jsdom     |
| E2E test            | Playwright                                  |
| Storybook           | yes                                         |
| Styling             | Plain CSS with custom properties (NHS)      |

### Headless dependency

Path alias to the sibling headless library:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@pgds/*": ["../lily-design-system-react-headless/components/*"]
    }
  }
}
```

Wrapper components in `components/` re-export from `@pgds/*` for local
imports:

```tsx
export { default } from "@pgds/Button";
export type * from "@pgds/Button";
```

`typescript.ignoreBuildErrors: true` is set in `next.config.ts` because the
headless library's `[key: string]: unknown` rest-props conflict with Next.js
strict `ReactNode` typing.

### Client rendering

All example pages use `"use client"` because the interactive Lily components
need client rendering.

### File layout

```
lily-design-system-react-next-examples/
├── app/
│   ├── layout.tsx                         ← global shell, skip-link, header, footer
│   ├── page.tsx                           ← /  home
│   ├── components/
│   │   ├── page.tsx                       ← /components  catalog index
│   │   └── [slug]/page.tsx                ← /components/{slug}  live demo
│   ├── contact-form/page.tsx              ← composed-page demos (12)
│   ├── dashboard/page.tsx
│   ├── …
│   └── data/
│       ├── component-demos.ts             ← slug → demo-HTML (407 entries)
│       └── components.ts                  ← catalog metadata (407 entries)
├── components/{PascalCase}.tsx            ← wrapper re-exports from @pgds/*
├── assets/css/nhs.css                     ← NHS-aligned stylesheet
├── e2e/components/{kebab-case}.spec.ts    ← Playwright e2e per slug
├── playwright.config.ts
├── next.config.ts
├── vitest.config.ts
└── package.json
```

## 4. Required routes

| Route                  | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `/`                    | Home — welcome, project description, links to demos    |
| `/components`          | Catalog index — every component in `components.tsv`    |
| `/components/[slug]`   | Per-component detail — live demo + metadata            |

`/components/[slug]` renders the demo HTML from `component-demos.ts` using
`dangerouslySetInnerHTML`. Demo data lives in `app/data/component-demos.ts`
and contains **407 entries** (one per canonical slug).

## 5. Composed-page demos

Twelve composed-page demos exercise multiple components together (see the
SvelteKit spec for the full table; the React app mirrors the same routes
and component sets).

## 6. Styling

- Plain CSS in `assets/css/nhs.css` with NHS-aligned CSS custom properties.
- CSS selectors target the kebab-case Lily class names directly.
- No CSS framework dependency.
- Theme tokens follow the shape in [../AGENTS/theme.md](../AGENTS/theme.md).

## 7. Testing

### 7.1 Stack

- **Unit**: vitest + @testing-library/react + jsdom.
- **E2E**: Playwright (Chromium, Firefox, WebKit).
- Vitest matchers ONLY (no `@testing-library/jest-dom`).

### 7.2 E2E coverage

Each `/components/[slug]` route has a Playwright spec in
`e2e/components/{kebab-case}.spec.ts` (commit `7a51013b`).

## 8. Commands

```sh
pnpm install                         # install dependencies
pnpm run dev                         # Next.js dev server (port 3000)
pnpm run build                       # production build
pnpm run start                       # production server
pnpm test                            # vitest
pnpm exec playwright test            # e2e tests
pnpm run storybook                   # run Storybook
```

## 9. Acceptance criteria

### 9.1 Routes

- [ ] `/` renders home with skip-link + standard landmarks.
- [ ] `/components` lists all 407 canonical components, searchable / filterable.
- [ ] `/components/[slug]` renders a live demo for all 407 slugs.
- [ ] All 12 composed-page demos exist.

### 9.2 Demo registry

- [ ] `app/data/component-demos.ts` exports a 407-entry map.
- [ ] `app/data/components.ts` exports a 407-entry catalog (no orphan slugs).
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

- [x] Project infrastructure (`package.json`, `next.config.ts`,
      `vitest.config.ts`, `playwright.config.ts`).
- [x] AGENTS.md, CLAUDE.md, index.md, README.md (symlink), plan.md, tasks.md.
- [x] NHS CSS integration (`assets/css/nhs.css`).
- [x] `/` home page.
- [x] `/components` catalog index.
- [x] `/components/[slug]` per-component detail with live demo via
      `dangerouslySetInnerHTML`.
- [x] All 12 composed-page demos.
- [x] Playwright e2e per slug.
- [x] Storybook integration (commit `7a51013b`).
- [x] Demo registry backfill: `component-demos.ts` covers all 407 canonical
      slugs (per commit `1f1772e1`).
- [x] Catalog metadata cleaned: orphan `medical-record-red-box` removed from
      `components.ts`; e2e spec deleted.
- [x] TabGroup removal (canonical pattern is TabBar + TabBarButton + TabPanel).

### 10.2 Open backlog

- [ ] Audit WCAG 2.2 AAA conformance on every page.
- [ ] Verify responsive design on mobile / desktop / 4K.
- [ ] Resolve `next.config.ts: typescript.ignoreBuildErrors: true` — the
      underlying headless `[key: string]: unknown` typing should be tightened.

## 11. Prohibited

| Prohibition                       | Reason                              |
| --------------------------------- | ----------------------------------- |
| `nhsuk-` prefixes in markup       | CSS targets Lily classes directly   |
| Tailwind, DaisyUI, Bootstrap      | no CSS framework dependency         |
| `@testing-library/jest-dom`       | vitest matchers only                |
| Re-implementing headless comps    | import from sibling library         |

## 12. Tracking

- Package: `lily-design-system-react-next-examples`
- Version: 0.2.0
- App framework: Next.js 15 + React 19 + TypeScript
- Test runners: vitest + Playwright
- Package manager: pnpm
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
- Canonical catalog: [../components.tsv](../components.tsv) — 407 components
- Root spec: [../spec.md](../spec.md)
- Sibling headless library: [../lily-design-system-react-headless/](../lily-design-system-react-headless/)
