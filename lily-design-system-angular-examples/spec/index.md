# Lily Design System - Angular Examples - spec

## Status

Initial scaffold landed 2026-05-28. Infrastructure + all required routes are present. Pending: `pnpm install` + `vite dev` + `playwright test` end-to-end verification.

## Architecture decisions

Based on the Angular example-app research:

- **Analog.js v1** on **Angular 20** — Angular's Nuxt/SvelteKit-equivalent meta-framework, file-based routing, Vite-powered, SSG.
- **Zoneless change detection** via `provideExperimentalZonelessChangeDetection()` — pairs with the signal-based headless library.
- **File-based pages** under `src/app/pages/`:
  - `index.page.ts` → `/`
  - `components/index.page.ts` → `/components`
  - `components/[slug].page.ts` → `/components/:slug`
  - `{composed}.page.ts` × 12 → `/contact-form`, `/dashboard`, …
- **SSG prerender** via Analog's `prerender.routes` config — generates every component-detail page (490) plus the composed pages.
- **Headless components copied** from `lily-design-system-angular-headless/components/` into `src/app/components/` (490 × 3 files = 1,461). Same copy-pattern the other 6 example apps use; no workspace dep.
- **Demo HTML registry** copied from `svelte-sveltekit-examples/src/lib/data/component-demos.ts` into `src/app/component-demos.ts`. Rendered via `[innerHTML]` + `DomSanitizer.bypassSecurityTrustHtml`.
- **NHS UK CSS** copied from `svelte-sveltekit-examples/src/lib/css/nhs.css` into `src/styles/nhs.css`, imported once in `main.ts`.
- **Playwright e2e**: `accessibility.spec.ts` (axe-core sweep) + `responsive.spec.ts` (4-viewport × 10-route). Static-build target on port 4173.

## Plan

- [x] Pick framework (Analog.js v1).
- [x] Scaffold package.json + vite.config.ts + tsconfig.json + main.ts + app.config.ts + app.ts.
- [x] Create file-based pages: home, components index, components/[slug] detail.
- [x] Create 12 composed-page demos.
- [x] Copy component-demos.ts registry.
- [x] Copy nhs.css.
- [x] Scaffold Playwright config + accessibility.spec.ts + responsive.spec.ts.
- [x] Standard subproject docs (AGENTS.md, CLAUDE.md, index.md, README.md → index.md symlink, spec/index.md, .git-subtree-push).
- [ ] `pnpm install` + `pnpm dev` boot smoke (deferred — pulls Analog + Angular + Vite deps).
- [ ] `pnpm test:e2e` reach 29/29 axe baseline (deferred until install).

## Tasks

- [ ] Smoke-test `pnpm dev` and confirm home + /components + /components/button render.
- [ ] Smoke-test `pnpm build` and confirm `dist/analog/public/` contains 490 + 14 prerendered HTML files.
- [ ] Run `pnpm test:e2e` and iterate on any axe violations.
- [ ] If desired, port the responsive-sweep route list to match this app's exact route shape (already done in `e2e/responsive.spec.ts`).
- [ ] Consider adding per-composed-page unit tests via Vitest + TestBed (mirror the headless library's test stack).

## File inventory at scaffold time

- 1 root `package.json` (workspace dep on angular-headless)
- 1 `vite.config.ts` (Analog + prerender)
- 1 `tsconfig.json` (strict + strictTemplates)
- 1 `playwright.config.ts`
- `src/main.ts`, `src/app/app.ts`, `src/app/app.config.ts`, `src/app/component-demos.ts`
- `src/styles/nhs.css`
- 15 page files: `index.page.ts`, `components/index.page.ts`, `components/[slug].page.ts`, plus 12 composed pages
- 2 Playwright specs: `accessibility.spec.ts`, `responsive.spec.ts`
- 6 docs: `AGENTS.md`, `CLAUDE.md`, `index.md`, `README.md` symlink, `spec/index.md`, `.git-subtree-push`
