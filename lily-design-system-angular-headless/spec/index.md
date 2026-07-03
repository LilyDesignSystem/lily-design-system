# Lily Design System - Angular Headless - spec

## Status

Initial scaffold landed 2026-05-28. Infrastructure + all 490 components present. Pending: `pnpm install` + `vitest run` end-to-end verification.

## Architecture decisions

Based on the Angular 2026 research summary:

- **Angular 20** (signals, control flow, deferable views, standalone-by-default). Pin to `^20.0.0`, peerDeps `>=20.0.0 <22.0.0`.
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
├── components/                — 490 × 3 files
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

- [x] Decide on Angular version target — Angular 20.
- [x] Set up build infra (package.json, tsconfig, ng-package, vitest).
- [x] Generate the 490-component scaffold from templates.
- [x] Index barrel that re-exports every component.
- [ ] Run `pnpm install` end-to-end (skipped in initial scaffold — pulls a lot of node_modules).
- [ ] Verify `vitest run` passes for a sample of components.
- [ ] Set up Storybook 9 for Angular (deferred).
- [ ] Wire example app subproject (`lily-design-system-angular-examples` — not yet started; placeholder for future work).

## Tasks

- [ ] Spot-check a few generated components for correct ARIA attributes and class hooks.
- [ ] Smoke-test that `ng-packagr` produces a valid APF bundle.
- [ ] Confirm `lily-` prefix on selectors does not collide with consumer namespaces.
- [ ] Document any per-component prop variations beyond the base `label` / `className` / `value` shape (initial scaffold uses uniform shapes by suffix — `*-input`, `*-view`, etc.).
