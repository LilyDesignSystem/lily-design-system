# Lily Design System™ — Improvement Tasks

Checklist companion to [plan.md](plan.md). Task IDs are `P{phase}-T{n}`.
Rules for the executing agent:

- Do a task's **Verify** step before checking its box; `bin/test` must
  also exit 0 at the end of every session.
- Follow `AGENTS/*.md` binding rules. Svelte subprojects are canonical;
  implement there first, then port to the other frameworks.
- Reference completed task IDs in commit messages.
- When a task changes something the spec claims, update
  `spec/index.md` (and the relevant `spec/{topic}/index.md`) in the
  same commit.

## Phase 1 — Truth and closure

- [ ] **P1-T1 Reconcile catalog counts (490 vs 491).**
  `components.tsv` has 491 rows; `spec/index.md` §11.4/§14 say 490,
  §5 says 491; `AGENTS/lily.md` and `AGENTS/components.md` say 491.
  Diff the catalog against the last 0.6.0 state to identify the
  addition; confirm it exists in all 14 implementation subprojects,
  registries, demo maps, github.io, and `css-style-sheet-template.css`;
  fix every stale count.
  Verify: `wc -l components.tsv` matches every count mentioned in
  `spec/index.md`, `AGENTS/*.md`, `README.md`; `bin/test` passes.

- [ ] **P1-T2 Angular examples Playwright e2e.**
  Add a Playwright suite to `lily-design-system-angular-examples`
  mirroring the SvelteKit app's suite (home, catalog, per-slug detail
  pages, composed pages). Update spec §11.4 with the spec count.
  Verify: `npx playwright test` in the subproject passes.

- [ ] **P1-T3 Angular headless e2e/story smoke via Playwright (if the
  suite shape applies) or record the deliberate exclusion in spec
  §11.8 with rationale.**
  Verify: spec §11.8 no longer lists Angular e2e as open.

- [ ] **P1-T4 File the Analog SSG upstream issue.**
  Source: `lily-design-system-angular-examples/docs/analog-ssg-issue.md`.
  File against analogjs/analog; link the issue URL from
  `analog-ssg-notes.md` and spec §11.8.
  Verify: issue URL recorded in both files.

- [ ] **P1-T5 Prototype `@angular/build:application` prerender fallback.**
  Attempt full-content static HTML for the angular-examples app. If it
  works, adopt it and close spec §11.8; if not, document findings in
  `analog-ssg-notes.md`.
  Verify: either prerendered route HTML contains full page content
  (grep a known component name in `dist/` output), or notes updated.

- [ ] **P1-T6 Svelte dual-mirror specs for 80 national identifiers.**
  Generate per-component dual-mirror vitest specs in
  `lily-design-system-svelte-headless` for the 80 national-identifier
  components, matching the existing 407-spec shape (target 487 spec
  files + the 4 remaining catalog components if applicable — reconcile
  with P1-T1's count).
  Verify: `vitest run` passes; spec-file count equals catalog count.

- [ ] **P1-T7 Fresh verification sweep.**
  Re-run every suite in spec §11.4–§11.7 (unit suites, Storybook
  builds, Playwright, axe, responsive); update the snapshot tables and
  dates.
  Verify: tables show 2026-07 dates and current counts.

## Phase 2 — Theme system goes live

- [ ] **P2-T1 Theme switcher in the SvelteKit example app (canonical).**
  Mount `theme-select` in the app shell with a curated list (NHS
  England patient default, NHS Scotland/Wales, GOV.UK GDS, USWDS,
  Adobe Spectrum, Mozilla Protocol, general light/dark), localStorage
  persistence, managed `<link>` + `data-theme` per `AGENTS/helpers.md`.
  Verify: Playwright test switches theme and asserts `data-theme` +
  swapped stylesheet href persist across reload.

- [ ] **P2-T2 Port the theme switcher to the other 6 example apps.**
  Same curated list and behaviour; framework-idiom ports.
  Verify: each app's e2e suite gains and passes the switch test.

- [ ] **P2-T3 Mount `locale-select` and `text-size-select` in all 7
  example app shells** alongside theme-select.
  Verify: e2e asserts `lang`/`dir` and `data-text-size` application.

- [ ] **P2-T4 `prefers-color-scheme` first-visit default for
  theme-select** (opt-in prop; Svelte canonical then 6 ports; minor
  version bump; CHANGELOG entries).
  Verify: helper unit tests cover both schemes and the localStorage
  override; `bin/publish-helpers --dry-run` (or equivalent) succeeds.

- [ ] **P2-T5 `bin/check-theme` conformance script.**
  Assert each `themes/*.css`: selectors are `:where(...)`-wrapped Lily
  class hooks present in `css-style-sheet-template.css`; core
  `--theme-*` tokens declared; no consumer-hostile specificity.
  Verify: script exits 0 on all 45 themes; wired into `bin/test`.

- [ ] **P2-T6 Dark/high-contrast variant audit** across theme families;
  document coverage matrix in `spec/theme/index.md`; backfill gaps or
  record deliberate exclusions.
  Verify: matrix in spec matches `ls themes/`.

## Phase 3 — Publishable headless libraries

- [ ] **P3-T1 Package the Svelte headless library (canonical).**
  package.json exports map, svelte-kit package / dist pipeline, types,
  sideEffects flag, package README, LICENSE.
  Verify: `npm pack` tarball installs into a temp project and 3
  components render in a smoke test.

- [ ] **P3-T2 Package React, Vue, Angular (ng-packagr APF), HTML,
  Nunjucks headless libraries** the same way; Blazor as NuGet.
  Verify: per-package pack + temp-project smoke test.

- [ ] **P3-T3 `bin/publish-headless`** (or extend `bin/publish-helpers`)
  with dry-run default; document in spec/tooling and AGENTS/lily.md
  tool list.
  Verify: dry-run succeeds for all 7 packages.

- [ ] **P3-T4 Versioning & release policy doc** (`docs/releasing.md`):
  semver rules, per-subproject CHANGELOGs, subtree-vs-package
  consumption.
  Verify: `bin/check-links` passes; linked from CONTRIBUTING.md
  (P4-T1).

- [ ] **P3-T5 CI publish workflow**, tag-gated, dry-run by default.
  Verify: CI config lints/runs in dry-run mode.

## Phase 4 — Documentation

- [ ] **P4-T1 `CONTRIBUTING.md`** at repo root: dev setup, monorepo +
  subtree model, the copy-pattern, add-a-component walkthrough (all 14
  subprojects + docs + registries + CSS hook), `bin/` tool guide, PR
  expectations.
  Verify: a dry-run of the add-a-component steps on a scratch slug
  works, then is reverted; `bin/check-links` passes.

- [ ] **P4-T2 Getting-started guides**, `docs/getting-started/` — one
  per framework (svelte, react, vue, angular, html, blazor, nunjucks):
  install/copy, first component, theme stylesheet, a11y check.
  Verify: each guide's code snippets exist verbatim in a fixture or
  example app; links check.

- [ ] **P4-T3 Theming guide** `docs/theming.md`: full `--theme-*` token
  table, writing a theme from the CSS template, `data-theme` variants,
  worked brand-theme example validated by `bin/check-theme`.
  Verify: worked example passes `bin/check-theme`.

- [ ] **P4-T4 Helpers guide** `docs/helpers.md`: contracts, SSR notes,
  per-framework mounting snippets for all three helpers.
  Verify: snippets match the shipped helper APIs; links check.

- [ ] **P4-T5 `bin/generate-api-docs`**: emit per-component reference
  pages from `components/{slug}/AGENTS.md` into the github.io site;
  regeneration is idempotent; drift fails `bin/test`.
  Verify: run twice → no diff; site builds.

- [ ] **P4-T6 Migration guides** `docs/migrating/nhs-uk.md` and
  `docs/migrating/govuk.md`: component → Lily slug mapping tables,
  gaps noted.
  Verify: every referenced slug exists in `components.tsv`; links
  check.

- [ ] **P4-T7 Doc quality gates in CI**: `bin/check-links` + cspell
  over `docs/` in the CI workflow.
  Verify: CI run green.

## Phase 5 — Tutorials

All under `docs/tutorials/{name}/index.md`; each ends at runnable
in-repo code (fixture or example-app route) referenced from the
tutorial.

- [ ] **P5-T1 Build-your-first-page (form pattern)** — Svelte version.
  Verify: finished code builds and its e2e/unit check passes.
- [ ] **P5-T2 Port P5-T1 to react, vue, angular, html, blazor,
  nunjucks.**
  Verify: same per framework.
- [ ] **P5-T3 Create-your-own-theme tutorial**, using `bin/check-theme`.
  Verify: tutorial's finished theme passes the checker.
- [ ] **P5-T4 Accessibility walkthrough** (keyboard + VoiceOver + local
  axe run on a composed page).
  Verify: referenced routes exist; axe run instructions reproduce.
- [ ] **P5-T5 Internationalisation tutorial** (locale-select, string
  externalisation, RTL with an Arabic locale, `Intl.*`).
  Verify: finished code builds; RTL route renders `dir="rtl"`.
- [ ] **P5-T6 National-identifiers tutorial** (registration form with
  `*-input`/`*-view`, normalization + validation).
  Verify: finished code builds and tests pass.
- [ ] **P5-T7 Compose-a-dashboard tutorial** ending at a composed route
  in the SvelteKit app.
  Verify: route builds; Playwright covers it.

## Phase 6 — Examples deepening

- [ ] **P6-T1 Composed-page parity matrix** for the 12 routes in
  `AGENTS/examples.md` × 7 apps; record in `spec/examples/index.md`.
  Verify: matrix matches reality (scripted check or manual sweep
  documented).
- [ ] **P6-T2 Backfill composed-page gaps**, including first composed
  pages for nunjucks-eleventy; extend its responsive sweep to stop
  skipping composed routes.
  Verify: per-app e2e passes on new routes.
- [ ] **P6-T3 Flagship "book an appointment" scenario route** —
  SvelteKit first (multi-step form, validation, error summary, summary
  list, confirmation; ~30 components), with Playwright + axe.
  Verify: e2e + axe clean on the new route.
- [ ] **P6-T4 Port the flagship scenario to the other 6 apps.**
  Verify: same per app.
- [ ] **P6-T5 RTL demo route** in each app.
  Verify: e2e asserts `dir="rtl"` and no horizontal overflow.
- [ ] **P6-T6 `/components` search upgrade**: filter by category and
  suffix pattern; SvelteKit first, then ports.
  Verify: e2e covers filter behaviour.
- [ ] **P6-T7 Full-catalog axe sweep** on all 491 `/components/{slug}`
  routes in the SvelteKit app; fix findings; record baseline in spec
  §11.5.
  Verify: sweep exits clean.

## Phase 7 — Tooling, CI, stretch

- [ ] **P7-T1 `bin/new-component` end-to-end generator** (catalog row,
  docs dir, CSS hook, 7 headless implementations + tests + stories,
  demos, registries).
  Verify: run on a scratch slug → `bin/test` passes → revert cleanly.
- [ ] **P7-T2 `bin/check-coverage` drift matrix** (catalog ↔
  implementations ↔ tests ↔ stories ↔ demos ↔ CSS hooks), non-zero on
  drift, wired into CI.
  Verify: exits 0 now; seeded fault detected in a dry test.
- [ ] **P7-T3 (stretch) Visual regression baseline**: ~30 components ×
  3 themes × light/dark, Playwright screenshots, SvelteKit app.
  Verify: baseline commit + a re-run with zero diffs.
- [ ] **P7-T4 (stretch) Web Components headless subproject** — 8th
  headless library as custom elements; full catalog; required files;
  tests; Storybook.
  Verify: `bin/test` recognises the new subproject; suite passes.
- [ ] **P7-T5 (stretch) `motion-select` helper** (`data-motion`,
  reduced-motion default) — Svelte canonical, then 6 ports, published
  alongside the existing helpers.
  Verify: per-catalog tests pass; `bin/publish-helpers` dry-run
  includes it.

---

Lily™ and Lily Design System™ are trademarks.
