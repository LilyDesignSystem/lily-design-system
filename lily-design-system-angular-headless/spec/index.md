# Lily Design System - Angular Headless - spec

## Status

Initial scaffold landed 2026-05-28; the library has since been fully verified and published. As of 2026-10-06 it ships all 571 catalog components (571 `.ts` + `.spec.ts` + `.stories.ts` triplets plus docs), version 0.4.0 on npm as `@lilydesignsystem/angular-headless`, with a peer range of Angular `>=20 <23` (the example app runs Angular 22). The "Plan" and "Tasks" checklists below are the original scaffold-era ones, now updated to current state.

## 2026-09-01 — wrapper-host attribute-selector migration (0.3.0, breaking)

Closed the root spec's §11.8 backlog item ("Angular headless
wrapper-host semantics"). 51 components whose canonical tag is a
required direct child of another element with a restrictive content
model — the 20 `*ListItem` families, the 30 table sub-elements across
`table`/`data-table`/`calendar-table`/`kanban-table`/`gantt-table`
(`*Head`/`*Body`/`*Foot`/`*Row`/`*TH`/`*TD`, gantt using
`*Thead`/`*Tbody`/`*Tfoot`/`*Tr`/`*TH`/`*TD`), and `Option` — switched
from an element selector (`lily-{slug}`, wrapping the native tag) to a
combined tag+attribute selector on the native tag itself
(`{tag}[lily-{slug}]`), matching Angular Material's own idiom for list
and table sub-elements. See AGENTS.md "Selector convention" for the
full pattern, the two consumer-facing gotchas (mount via a host
component in tests; pass host-bound attributes like `scope`/`value`
through the input, never as a competing static attribute), and why the
parent containers (`*List`, `*Table`, `*TableHead`, `Select`) were left
on the element selector.

Verification: `vitest run` 571/571 files, 1011/1011 tests;
`ng-packagr` build clean; `lily-design-system-angular-examples`
(vendored copy kept identical, same as every other change to this
library) builds, prerenders 507 pages, and its full Playwright suite
(1574 specs: accessibility/axe, responsive, rtl-demo, theme-switching,
site-preferences) passes — including the four composed pages
(`page-layout`, `task-management`, `timeline-and-cards`,
`book-an-appointment`) and `rtl-demo` that had been carrying a
direct-class-hook-markup workaround for exactly this defect, now
reverted to the real components. `lily-design-system-examples`'s own
vitest config still excludes `src/app/components/**` (see that app's
`vitest.config.ts`) — pre-existing, unrelated to this change.

Not in scope: `DateRange`/`ReviewDate` render `<div>` instead of the
canonical `<span>` (a separate, pre-existing defect noted in the same
axe run that produced §11.8 — see `timeline-and-cards.ts`'s comment);
`RadioGroup`/`RadioInput`/`CheckboxInput`'s missing `checked`/`name`
model (see `book-an-appointment.ts`'s file header comment).

## Architecture decisions

Based on the Angular 2026 research summary:

- **Angular 20 baseline, 22 supported** (signals, control flow, deferrable views, standalone-by-default). Peer dependencies `>=20.0.0 <23.0.0`; the example app builds on Angular 22.
- **Standalone components only**. No NgModules.
- **Signal inputs + outputs** (`input()`, `output()`, `model()`).
- **`ChangeDetectionStrategy.OnPush`** on every component.
- **Inline templates** in the `template:` field (matches the flat-file pattern used by React/Vue/Svelte siblings).
- **Flat file layout**: `components/{Pascal}.ts` + `.spec.ts` + `.md`. Not the `*.component.ts` CLI convention.
- **Zero CSS / no `styles` / no `styleUrls`**. Components ship semantic HTML + ARIA only.
- **`@analogjs/vite-plugin-angular`** + Vitest for tests (parity with the other Lily headless libraries).
- **`ng-packagr`** for library publishing (Angular Package Format).

## File layout

```
lily-design-system-angular-headless/
├── components/                — 571 × 4 files (.ts, .spec.ts, .stories.ts, .md)
│   ├── Accordion*.ts          — standalone component
│   ├── Accordion*.spec.ts     — vitest + TestBed test
│   ├── Accordion*.md          — per-component doc
│   ├── …
│   └── WeekInput.{ts,spec.ts,md}
├── index.ts                   — barrel re-exports
├── package.json
├── ng-package.json
├── tsconfig.json
├── tsconfig.spec.json
├── vitest.config.ts
└── vitest-setup.ts
```

## Plan

- [x] Decide on Angular version target — Angular 20 baseline (peer range extended to `<23`).
- [x] Set up build infra (package.json, tsconfig, ng-package, vitest).
- [x] Generate the component scaffold (now 571 components) from templates.
- [x] Index barrel that re-exports every component.
- [x] Run `pnpm install` end-to-end.
- [x] Verify `vitest run` passes (every component has a spec; see `spec/testing` in the root spec for counts).
- [x] Storybook for Angular — `@storybook/angular` (webpack builder) with a story per component.
- [x] Example app subproject `lily-design-system-angular-examples` exists (Analog.js, prerendered).

## Tasks

- [ ] Spot-check a few generated components for correct ARIA attributes and class hooks.
- [x] `ng-packagr` produces a valid APF bundle (verified at each release; `bin/smoke-packages` installs and renders it).
- [ ] Confirm `lily-` prefix on selectors does not collide with consumer namespaces.
- [ ] Document any per-component prop variations beyond the base `label` / `className` / `value` shape (initial scaffold uses uniform shapes by suffix — `*-input`, `*-view`, etc.).

## Tracking

- Package: `@lilydesignsystem/angular-headless`
- Version: 0.4.0
- Framework: Angular `>=20 <23` (signals, standalone, OnPush) + TypeScript
- Test runner: vitest
- Package manager: pnpm
- Contact: Joel Parker Henderson <joel@joelparkerhenderson.com>
