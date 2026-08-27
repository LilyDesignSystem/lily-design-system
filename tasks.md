# Lily Design System™ — Improvement Tasks

Checklist companion to [plan.md](plan.md), revision 2026-08-26. Task
IDs are `P{phase}-T{n}` and restart from this revision; the 2026-07-11
task list is superseded (its completed items are recorded in plan.md
§"Completed since the 2026-07-11 plan").

Rules for the executing agent:

- Do a task's **Verify** step before checking its box; `bin/test` must
  also exit 0 at the end of every session.
- Follow `AGENTS/*.md` binding rules. Svelte subprojects are canonical;
  implement there first, then port to the other frameworks.
- The helpers are the five `*-picker` packages; `*-select` naming is
  obsolete.
- Run `bin/sync-special-files` after touching any root special file.
- Reference completed task IDs in commit messages. When a task changes
  something the spec claims, update `spec/index.md` (and the relevant
  `spec/{topic}/index.md`) in the same commit.

## Phase 1 — Truth, hygiene, and registry cleanup

- [x] **P1-T1 Reconcile catalog counts (490 vs 491).**
  `components.tsv` has 491 rows; `spec/index.md` §14 says 490 rows and
  §11.4's header says "catalog counts updated to 490". Identify the
  491st component (diff against the 0.6.0 state), confirm it exists in
  all 14 implementation subprojects, registries, demo maps, github.io,
  and `css-style-sheet-template.css`; fix every present-tense stale
  count (dated snapshot records may stand, restamped by P1-T6).
  Verify: `wc -l < components.tsv` matches every live count in
  `spec/index.md`, `AGENTS/*.md`, root docs; `bin/test` passes.

- [x] **P1-T2 Deprecate the broken 0.2.0 headless packages on npm.**
  `npm deprecate lily-design-system-{svelte,react,vue}-headless@0.2.0`
  with a message naming the cause (declared `main` never built) and
  the fix (`>=0.3.0`).
  Verify: registry metadata for each 0.2.0 shows the deprecation
  string (`npm view <pkg>@0.2.0 deprecated`).

- [x] **P1-T3 Patch-release svelte/react/vue headless (0.3.1).**
  Ships the corrected in-tree metadata to the registry: SPDX license
  menu, `LilyDesignSystem` repository URLs (react/vue currently point
  at `github.com/lily`, an unrelated account), "Targets WCAG 2.2 AAA"
  description. No code change; CHANGELOG entries say so.
  Verify: `npm view <pkg> repository.url license description` shows
  the corrected values for all three.

- [x] **P1-T4 Angular examples Playwright e2e.**
  Mirror the SvelteKit suite (home, catalog, per-slug detail, composed
  pages) in `lily-design-system-angular-examples`; update spec §11.4.
  Verify: `npx playwright test` passes in the subproject.

- [x] **P1-T5 Analog SSG: file upstream + prototype fallback.**
  File `docs/analog-ssg-issue.md` against analogjs/analog and record
  the URL in `analog-ssg-notes.md` + spec §11.8; prototype
  `@angular/build:application` prerender. Adopt whichever yields
  full-content static HTML, or document why neither does.
  Verify: issue URL recorded; either `grep` of a known component name
  in prerendered `dist/` HTML succeeds, or notes updated with
  findings.

- [ ] **P1-T6 Fresh verification sweep.**
  Re-run every suite in spec §11.4–§11.7 (unit, Storybook, Playwright,
  axe, responsive); restamp tables with 2026-08/09 dates and current
  counts.
  Verify: no §11.4–§11.7 table carries a pre-2026-08 date without a
  "historical" label.

- [x] **P1-T7 Svelte dual-mirror specs for the 80 national
  identifiers**, matching the existing 407-spec shape; reconcile the
  target count with P1-T1.
  Verify: `vitest run` passes; spec-file count equals catalog count.

- [x] **P1-T8 GitHub topics + descriptions on all 23 repos.**
  4–6 topics each covering language, framework, domain, artifact type
  (`design-system`, `accessibility`, `headless-ui`, framework,
  `wcag`); one-line description matching the repo's INSTALL.md
  opening.
  Verify: `gh repo view LilyDesignSystem/<repo> --json
  repositoryTopics,description` non-empty for all 23.

- [x] **P1-T9 Root README screenshots.**
  Two images in `assets/images/`: a styled example-app page, and the
  same markup unstyled — embedded near the top of `index.md`.
  Verify: images exist, referenced from `index.md`, `bin/check-links`
  passes.

- [x] **P1-T10 Confirm/enable the SECURITY.md posture table.**
  Secret scanning, push protection, private vulnerability reporting,
  Dependabot security updates, branch protection on `main` — enable
  where possible, then update SECURITY.md's NOTE block to state what
  is actually on (and sync).
  Verify: `gh api repos/LilyDesignSystem/lily-design-system --jq
  '.security_and_analysis'` matches the table; SECURITY.md NOTE
  updated; `bin/sync-special-files --check` passes.

## Phase 2 — Release engineering

- [x] **P2-T1 Publish html, angular, nunjucks headless to npm.**
  Same discipline as 0.3.0: real `dist/`, barrel, types,
  `sideEffects: false`, `files` allowlist, tarball installed into a
  scratch consumer before publish. Update INSTALL.md's publication
  table (root + synced).
  Verify: `npm view lily-design-system-{html,angular,nunjucks}-headless
  version` succeeds; scratch-consumer smoke renders 3 components each.

- [ ] **P2-T2 Publish blazor headless + the 5 blazor helper packages
  to NuGet.** The helper `.nupkg` files already exist in `dist-nuget/`.
  Verify: `dotnet add package LilyDesignSystem.Blazor.ThemePicker`
  succeeds in a scratch project; NuGet pages show README + license.

- [x] **P2-T3 `bin/publish-headless`** (or extend `bin/publish-helpers`)
  with dry-run default; document in spec/tooling + AGENTS/lily.md.
  Verify: dry-run succeeds for all 7 packages; docs linked.

- [x] **P2-T4 Tags + GitHub Releases.**
  Annotated tag per release with notes from the CHANGELOG section;
  retroactive tags for 0.2.0–0.6.0 where the commit is identifiable;
  release process added to `docs/releasing.md` (P2-T6).
  Verify: `git tag` lists them; `gh release list` shows notes.

- [x] **P2-T5 Publish provenance + CI publish workflow.**
  Tag-gated workflow, dry-run by default, `npm publish --provenance`
  from CI, 2FA confirmed on the npm account. Optional: Zenodo DOI
  added to CITATION.cff.
  Verify: workflow runs green in dry-run on a test tag; a subsequent
  real publish shows the provenance badge on npm.

- [x] **P2-T6 `docs/releasing.md`**: semver rules, the two stable
  contracts (class hooks, keyboard/ARIA), per-subproject CHANGELOGs,
  subtree-vs-package consumption, deprecation policy (0.2.0 as the
  worked example).
  Verify: `bin/check-links` passes; linked from CONTRIBUTING.md.

- [x] **P2-T7 Consumer smoke tests in CI.**
  Per published package: install the packed tarball into a scratch
  project, import the barrel, render 3 components. This is the check
  that would have caught 0.2.0.
  Verify: CI job green; seeded fault (break an exports map on a
  branch) is caught.

## Phase 3 — Themes live + tokens

- [x] **P3-T1 Theme-picker in the SvelteKit example shell (canonical).**
  Curated list (NHS England patient default; NHS Scotland/Wales; GOV.UK
  GDS; USWDS; Spectrum; Protocol; general light/dark), localStorage,
  managed `<link>` + `data-theme` per `AGENTS/helpers.md`.
  Verify: Playwright switches theme, asserts `data-theme` + swapped
  href persist across reload.

- [x] **P3-T2 Port the theme switcher to the other 6 example apps.**
  Verify: each app's e2e gains and passes the switch test.
  Done 2026-08-26, all six: react-next (71/71), vue-nuxt (68/68),
  angular (1,545/1,545), html-css-js (theme spec 3/3; its
  axe/responsive debt is pre-existing and logged in spec §11.8),
  nunjucks-eleventy (60/60), blazor-web (72/72 — the theme-layer app
  also cleared its 5 previously-failing checks; helper via local
  ProjectReference until the NuGet push unblocks).

- [x] **P3-T3 Mount locale-picker + text-size-picker in all 7 shells**;
  evaluate share-picker on component-detail pages (adopt or record
  the decision).
  Verify: e2e asserts `lang`/`dir` and `data-text-size` application.
  Done 2026-08-26: all seven shells carry theme + locale + text-size,
  each app with a site-preferences e2e (lang, Arabic dir=rtl flip,
  data-text-size, persistence). Share-picker: **recorded, not
  adopted** — its `targets` are an editorial/per-product decision the
  demo apps should not fake, and the detail pages have no share story
  to tell; revisit if a real destination list emerges.

- [x] **P3-T4 `prefers-color-scheme` first-visit default** (opt-in
  prop; Svelte canonical then 6 ports; minor bumps; CHANGELOGs).
  Verify: unit tests cover both schemes + storage override;
  `bin/publish-helpers` dry-run green.
  Already implemented when audited 2026-08-27: `detectFromSystem`
  ships in all seven catalogs with §7.20 spec tests (off unless opted
  in, storage wins, both schemes) — the July task predated the
  feature landing. Nothing to build.

- [x] **P3-T5 `bin/check-theme` conformance script.**
  Each `themes/*.css`: `:where(...)`-wrapped hooks that exist in
  `css-style-sheet-template.css`; core `--theme-*` tokens declared.
  Verify: exits 0 on all 45 themes; wired into `bin/test`.
  Done 2026-08-27, with contracts corrected to what the themes really
  promise: hooks resolve against components.tsv (+ sub-classes and
  helper hooks), the consumer-wins mechanism is `@layer lily` OR
  top-level `:where()`, the pinned token set is the real `--color-*` /
  `--lily-*` / `--radius-*` contract (not `--theme-*`), the
  `data-theme` guard must equal the filename slug, and the shared
  appended sections are pinned byte-identical (the component body is
  deliberately per-variant). Four fault classes seeded and bitten.
  The first run found real drift, all fixed across the 45: invented
  hooks (`.link`, `.scroll-view`, `.tree-view`, one `.submit-button`)
  and six NHS themes whose truncated guards the picker never set.

- [ ] **P3-T6 DTCG token source.**
  `themes/tokens/*.json` in Design Tokens 2025.10 format for the core
  `--theme-*` set; generator emits the custom-property blocks; drift
  fails `bin/test`; RFC.md §RFC 6 updated with the outcome.
  Verify: generator run twice → no diff; a hand-edit to generated CSS
  fails the gate; tokens validate against the DTCG schema.

- [ ] **P3-T7 Theme provenance + GDS/NHS refresh.**
  Header comment per reference theme naming the upstream system and
  version tracked (GOV.UK Frontend v6.x, NHS.UK frontend v9/v10,
  USWDS, Spectrum, Protocol); refresh the GDS theme against v6's
  updated type scale/colours; record deltas in `spec/theme/index.md`.
  Verify: every `themes/*.css` carries a provenance header;
  `bin/check-theme` passes; spec matrix updated.

- [ ] **P3-T8 Dark/high-contrast variant audit** across families;
  coverage matrix in `spec/theme/index.md`; backfill or record
  deliberate exclusions.
  Verify: matrix matches `ls themes/`.

## Phase 4 — Accessibility assurance

- [ ] **P4-T1 Full-catalog axe sweep** on all 491 `/components/{slug}`
  routes in the SvelteKit app; fix findings; baseline in spec §11.5.
  Verify: sweep exits clean; baseline table updated.

- [ ] **P4-T2 Accessibility statement + WCAG mapping**
  (`docs/accessibility-statement.md`, surfaced on the site): what is
  tested by what, what is not, known gaps, audit intention. "Targets"
  wording throughout; no "compliant" claim.
  Verify: `bin/check-links` passes; linked from README, site, and
  SECURITY.md's closing section.

- [ ] **P4-T3 Component maturity labels.**
  `status` field (`experimental`/`beta`/`stable`) added to catalog
  metadata (`components/{slug}/AGENTS.md` + a rubric doc); surfaced in
  per-component docs and the site catalog; initial assignment
  documented (test depth, screen-reader evidence, production use).
  Verify: all 491 components carry a status; `bin/test` gains a check
  that none is missing; rubric linked from spec/components.

- [ ] **P4-T4 Screen-reader testing matrix.**
  VoiceOver + NVDA (JAWS as funded) × ~20 representative interactive
  components; per-component results recorded; CONTRIBUTING's ask
  becomes a structured intake template (issue form).
  Verify: matrix doc exists with ≥20 rows of real results; issue
  template live.

- [ ] **P4-T5 External audit readiness pack**
  (`docs/audit-readiness.md`): scope, environments, component list,
  known-issues register — so funding converts to an audit without
  delay.
  Verify: doc exists, linked from CONTRIBUTING's money section.

## Phase 5 — Documentation and site surfaces

- [ ] **P5-T1 News + roadmap routes on the site.**
  `/news` fed from NEWS.md; `/roadmap` fed from plan.md's phases
  (GOV.UK pattern). Closes the outreach plan's blog-route gate.
  Verify: both routes build and render current content; site nav
  links them.

- [ ] **P5-T2 Developer on-ramp in CONTRIBUTING.**
  Dev setup, monorepo + subtree model, the copy-pattern, full
  add-a-component walkthrough (14 subprojects + docs + registries +
  CSS hook), `bin/` tool guide.
  Verify: walkthrough dry-run on a scratch slug passes `bin/test`,
  then reverts cleanly.

- [ ] **P5-T3 `bin/generate-api-docs`**: per-component reference from
  `components/{slug}/AGENTS.md` into the site; idempotent; drift
  fails `bin/test`.
  Verify: run twice → no diff; site builds; a seeded metadata edit is
  caught.

- [ ] **P5-T4 Migration guides**: `docs/migrating/nhs-uk.md` (v9/v10)
  and `docs/migrating/govuk.md` (v6) — component → Lily slug tables,
  gaps noted.
  Verify: every referenced slug exists in `components.tsv`;
  `bin/check-links` passes.

- [ ] **P5-T5 `lily-figma` decision.**
  Either seed a community Figma library from P3-T6 tokens and document
  it, or replace the placeholder with an honest not-planned page
  linking RFC.md §RFC 6. No "coming soon" remains.
  Verify: the route renders real content either way.

- [ ] **P5-T6 Tutorials gain runnable end states.**
  Each site tutorial's finished code exists in-repo (fixture or
  example-app route) and is referenced from the tutorial; verified by
  build/test.
  Verify: per-tutorial verify commands documented and green.

- [ ] **P5-T7 Spell-check gate in CI** over root docs + site content
  (cspell with a project dictionary).
  Verify: CI green; a seeded typo on a branch is caught.

## Phase 6 — Examples deepening

- [ ] **P6-T1 Composed-page parity matrix** (12 routes × 7 apps) in
  `spec/examples/index.md`; backfill gaps, including first composed
  pages for nunjucks-eleventy; un-skip its responsive sweep.
  Verify: matrix matches reality; per-app e2e passes on new routes.

- [ ] **P6-T2 Flagship "book an appointment" scenario — SvelteKit.**
  Multi-step form, validation, error summary, summary list,
  confirmation; ~30 components; Playwright + axe; written up as
  Lily's first pattern doc (`docs/patterns/book-an-appointment.md`).
  Verify: e2e + axe clean; pattern doc link-checked.

- [ ] **P6-T3 Port the flagship scenario to the other 6 apps.**
  Verify: same per app.

- [ ] **P6-T4 RTL demo route** in each app.
  Verify: e2e asserts `dir="rtl"` and no horizontal overflow.

- [ ] **P6-T5 `/components` search upgrade**: category + suffix-pattern
  filters; SvelteKit first, then ports.
  Verify: e2e covers filter behaviour.

## Phase 7 — Tooling, CI, and stretch

- [ ] **P7-T1 CI completeness.**
  Add: 7 headless unit suites, blazor helpers `dotnet test`, one
  example-app Playwright smoke, and P2-T7's consumer smoke — matrixed
  with caching.
  Verify: all jobs green on main; total wall-clock recorded.

- [ ] **P7-T2 `bin/test` profiling.**
  ~63 s today; profile, batch the per-component filesystem checks,
  target < 20 s with zero checks weakened.
  Verify: `time bin/test` < 20 s; same error output on a seeded
  missing-file fault as before.

- [ ] **P7-T3 `bin/new-component` end-to-end generator** (catalog row,
  docs dir, CSS hook, 7 implementations + tests + stories, demos,
  registries).
  Verify: scratch slug → `bin/test` passes → clean revert.

- [ ] **P7-T4 `bin/check-coverage` drift matrix** (catalog ↔
  implementations ↔ tests ↔ stories ↔ demos ↔ CSS hooks), non-zero on
  drift, in CI.
  Verify: exits 0 now; seeded fault detected.

- [ ] **P7-T5 (stretch) Visual regression baseline**: ~30 components ×
  3 themes × light/dark, Playwright screenshots, SvelteKit app.
  Verify: baseline commit + zero-diff re-run.

- [ ] **P7-T6 (stretch) Web Components headless subproject** — 8th
  headless library as custom elements; full catalog; required files;
  tests; Storybook.
  Verify: `bin/test` recognises it; suite passes.

- [ ] **P7-T7 (stretch) `motion-picker` helper** (`data-motion`,
  reduced-motion default) — Svelte canonical, then 6 ports, following
  the five-helper contract in `AGENTS/helpers.md`.
  Verify: per-catalog tests pass; `bin/publish-helpers` dry-run
  includes it.

---

Lily™ and Lily Design System™ are trademarks.
