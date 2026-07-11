# Lily Design System™ — Improvement Plan

Plan for major improvements across capabilities, functionality,
documentation, tutorials, and examples. Companion checklist:
[tasks.md](tasks.md).

> **Relationship to `spec/`**: the living specification remains
> [spec/index.md](spec/index.md); this file is a bounded improvement
> initiative to be executed by an AI coding agent (Claude Opus) in
> phased work sessions. As work lands, fold outcomes back into
> `spec/index.md` §11–§13 and `CHANGELOG.md`, then delete or archive
> this plan.

## How to execute this plan

- Work phase by phase; phases are ordered by dependency and value.
- Each task in [tasks.md](tasks.md) has an ID (`P1-T1`), touched paths,
  acceptance criteria, and a verify command. Do not mark a task done
  until its verify command passes.
- Always run `bin/test` before finishing a session; it must exit 0.
- Respect the binding rules in `AGENTS/*.md` (headless, accessibility,
  internationalization, theme, helpers, examples). Svelte is the
  canonical reference implementation; port outward from it.
- Keep commits small and per-task; note completed task IDs in commit
  messages.

## Current state (verified 2026-07-11)

- Catalog: **491 components** in `components.tsv` (note: parts of
  `spec/index.md` still say 490 — reconciliation is task P1-T1).
- 21 subprojects (7 headless, 7 examples, 7 helpers) all exist and pass
  `bin/test`; 45 reference themes in `themes/`.
- Helpers publish to npm/NuGet; **the 7 headless libraries do not
  publish anywhere** — consumers must copy files.
- Open backlog (spec §11.8): Angular examples SSG is shell-only
  (upstream Analog issue, drafted but not filed); Playwright e2e never
  run against the two Angular subprojects.
- Themes ship but are **not wired into the example apps** as switchable
  alternatives (roadmap item).
- No `CONTRIBUTING.md`, no getting-started guides, no tutorials
  anywhere in the repo.
- Composed-page demos: nunjucks-eleventy app has none; parity across
  the other apps unaudited.
- axe-core baseline covers ~29 routes per app, not the 491
  component-detail pages.
- svelte-headless dual-mirror specs missing for the 80
  national-identifier components (spec §11.4 note).

---

## Phase 1 — Truth and closure (close the known gaps)

Goal: every claim in the docs is true, and the §11.8 backlog is closed
or formally handed upstream.

1. **Reconcile catalog counts.** `spec/index.md` says 490 in §11.4/§14
   and 491 in §5; `components.tsv` has 491 rows. Identify the
   post-0.6.0 addition, verify it propagated to all 14 implementation
   subprojects + registries + CSS template, and update every stale
   count.
2. **Angular Playwright e2e.** Port the e2e suite (same shape as the
   other apps: catalog page, per-slug detail pages, composed pages) to
   `lily-design-system-angular-examples`; record counts in spec §11.4.
3. **Analog SSG resolution.** File the drafted upstream issue
   (`docs/analog-ssg-issue.md` in the angular-examples subproject),
   and prototype the fallback: prerender via
   `@angular/build:application`. Pick whichever unblocks full static
   HTML; document the decision.
4. **Svelte national-identifier dual-mirror specs.** Generate the
   per-component dual-mirror vitest specs for the 80 national
   identifier components in svelte-headless, matching the existing 407.
5. **Stale-memory sweep.** Re-verify §11.4–§11.7 snapshot numbers with
   a fresh full-suite run; update the tables with new dates.

## Phase 2 — Theme system goes live

Goal: the 45 themes become a user-visible capability instead of inert
files.

1. **Wire `theme-select` into all 7 example apps** with a curated theme
   list (NHS England patient default + GDS, USWDS, Spectrum, Protocol,
   general light/dark), persisted via localStorage, applied via the
   managed `<link>` + `data-theme` contract in `AGENTS/helpers.md`.
2. **Ship `locale-select` and `text-size-select` in the example app
   shells** too — the three helpers demoed together in each app header.
3. **Dark and high-contrast coverage audit.** Verify every theme pair
   has dark/high-contrast variants where the family claims them; add a
   `prefers-color-scheme` first-visit default to `theme-select`
   (opt-in prop, Svelte canonical first, then the 6 ports).
4. **Theme conformance checker.** New `bin/check-theme` script: every
   theme stylesheet only uses `:where(...)`-wrapped Lily class hooks
   that exist in `css-style-sheet-template.css`, and declares the core
   `--theme-*` tokens.

## Phase 3 — Publishable headless libraries

Goal: `npm install @lily-design-system/svelte` (and peers) works.

1. **Package the 7 headless libraries** for distribution: package
   metadata, exports maps, type declarations (`.d.ts` via each
   framework's idiom), side-effect-free flags, README per package.
   Blazor ships a NuGet package. Follow the proven
   `bin/publish-helpers` pipeline shape; extend it (or add
   `bin/publish-headless`).
2. **Semver + release policy.** One versioning doc; per-subproject
   CHANGELOGs; git-subtree remotes stay the source for source-level
   consumption, packages for dependency-level consumption.
3. **Consumer smoke tests.** For each published package, a minimal
   out-of-repo consumer fixture (`docs/consumer-fixtures/` or CI job)
   that installs the tarball and renders 3 representative components.
4. **CI publish workflow** gated on tags, dry-run by default.

## Phase 4 — Documentation

Goal: a newcomer can adopt Lily without reading the spec.

1. **`CONTRIBUTING.md`** — dev setup, the copy-pattern, how to add a
   component (all 14 subprojects + docs + registries + CSS hook),
   how `bin/sync`, `bin/test`, and subtree pushes work.
2. **Getting-started guide per framework** (7 docs under
   `docs/getting-started/{framework}.md`): install/copy, import one
   component, add a theme stylesheet, verify accessibility. Svelte
   first as canonical; port the shape outward.
3. **Theming guide** (`docs/theming.md`): the token table (every
   `--theme-*` custom property), how to write a theme from
   `css-style-sheet-template.css`, `data-theme` variants, worked
   example building a brand theme.
4. **Helpers guide** (`docs/helpers.md`): the three helpers, their
   `<select>` contracts, SSR notes, framework-by-framework snippets.
5. **API reference generation.** New `bin/generate-api-docs`: emit a
   per-component reference page from `components/{slug}/AGENTS.md`
   metadata into the github.io site (props, ARIA, keyboard, tag) so
   the site reference can never drift from the canonical metadata.
6. **Migration guides** (`docs/migrating/`): from NHS UK frontend and
   from GOV.UK frontend to Lily class hooks (map component → Lily slug,
   note gaps).
7. **Doc quality gates in CI**: `bin/check-links` + a spell-check pass
   over the new docs.

## Phase 5 — Tutorials

Goal: task-oriented, tested walkthroughs (each tutorial's final code
must exist in-repo and build).

Directory: `docs/tutorials/`, one subdirectory per tutorial, each with
`index.md` + a runnable `code/` folder (or a pointer to an example-app
route that is the finished artifact).

1. **Build your first page** — 7 variants (one per framework): form +
   validation + error summary using the Form pattern. Start Svelte;
   port.
2. **Create your own theme** — from blank CSS to a working theme
   loaded by `theme-select`, using the conformance checker from
   Phase 2.
3. **Accessibility walkthrough** — keyboard-only and VoiceOver pass
   over a composed page; how to run axe locally; how to read the
   keyboard contract in a component's `AGENTS.md`.
4. **Internationalise an app** — wire `locale-select`, externalise
   strings, RTL flip with an Arabic locale, `Intl.*` formatting.
5. **National identifiers** — build a patient-registration form with
   `*-input`/`*-view` pairs, normalization + validation.
6. **Compose a dashboard** — GrailLayout + DataTable + navigation
   patterns; ends at a composed route in the SvelteKit example app.

## Phase 6 — Examples deepening

Goal: examples demonstrate the system, not just the components.

1. **Composed-page parity audit + backfill.** The 12 composed routes
   listed in `AGENTS/examples.md` — build the parity matrix, backfill
   gaps, and give nunjucks-eleventy its first composed pages.
2. **One flagship scenario app route per example app**: an NHS-style
   "book an appointment" flow (multi-step form, validation, summary
   list, confirmation) exercising ~30 components end to end. Playwright
   + axe cover it.
3. **RTL demo route** in each app (paired with the i18n tutorial).
4. **Component search upgrade** on `/components`: filter by category
   and by suffix pattern, not just substring.
5. **axe sweep expansion**: run axe against every `/components/{slug}`
   route (491 per app) at least in the SvelteKit app; fix findings;
   record the new baseline.

## Phase 7 — Tooling, CI, and stretch capabilities

1. **`bin/new-component` end-to-end generator**: one command scaffolds
   catalog row, component dir + docs, CSS hook, all 7 headless
   implementations (+ tests + stories), demo entries, registries — then
   `bin/test` passes. Reuses existing scaffolders + generators.
2. **Coverage audit script** (`bin/check-coverage`): catalog ↔
   implementations ↔ tests ↔ stories ↔ demos ↔ CSS hooks matrix;
   non-zero exit on drift; wire into CI.
3. **Visual regression** (stretch): Playwright screenshot baseline for
   ~30 representative components × 3 themes × light/dark in the
   SvelteKit app.
4. **Web Components headless library** (stretch, large): an 8th
   headless subproject shipping custom elements, making Lily usable
   with zero framework. Only start after Phases 1–6 land.
5. **Additional helpers** (stretch): `motion-select`
   (`data-motion` / reduced-motion) following the established
   3-helper contract; Svelte canonical first.

## Sequencing and dependencies

- Phase 1 first — it makes the docs trustworthy before new claims land.
- Phase 2 before Phases 4–6 (guides and examples reference the live
  theme switcher).
- Phase 3 is independent of 2 and can interleave.
- Phase 5 depends on Phase 4's getting-started shape and Phase 2's
  checker.
- Phase 7 items 1–2 can land any time; 3–5 are stretch, last.

## Definition of done (whole plan)

- `bin/test` passes; all spec §11 tables updated with fresh dates.
- All 7 headless libraries installable as packages with smoke-tested
  consumers.
- Theme switching live in all 7 example apps.
- `CONTRIBUTING.md`, 7 getting-started guides, theming + helpers +
  migration guides published and link-checked.
- 6 tutorials with runnable end states.
- Composed-page parity matrix complete; flagship scenario route in all
  7 example apps.
- Outcomes folded back into `spec/index.md` and `CHANGELOG.md`.

---

Lily™ and Lily Design System™ are trademarks.
