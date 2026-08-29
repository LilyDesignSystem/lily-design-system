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

- [x] **P3-T6 DTCG token source.**
  `themes/tokens/*.json` in Design Tokens 2025.10 format for the core
  `--theme-*` set; generator emits the custom-property blocks; drift
  fails `bin/test`; RFC.md §RFC 6 updated with the outcome.
  Verify: generator run twice → no diff; a hand-edit to generated CSS
  fails the gate; tokens validate against the DTCG schema.
  Done 2026-08-27: 45 `themes/tokens/*.json` in DTCG 2025.10 form
  (structured oklch/srgb color values, dimension objects, token
  commentary as $description), extracted losslessly (value-diff
  against the originals: none), canonical generation idempotent,
  drift check wired into bin/test and bite-proven. Scope: the
  per-theme primitives only — the derived `--lily-*` layer and
  component body stay CSS, being shared logic not per-theme data.
  RFC 6 updated.

- [x] **P3-T7 Theme provenance + GDS/NHS refresh.**
  Header comment per reference theme naming the upstream system and
  version tracked (GOV.UK Frontend v6.x, NHS.UK frontend v9/v10,
  USWDS, Spectrum, Protocol); refresh the GDS theme against v6's
  updated type scale/colours; record deltas in `spec/theme/index.md`.
  Verify: every `themes/*.css` carries a provenance header;
  `bin/check-theme` passes; spec matrix updated.
  Done 2026-08-27: all 45 carry exactly one "Upstream tracked:" line
  (now check-theme's sixth assertion); the GDS theme is refreshed to
  the v6.0.0 web palette (green #0f7a52, red #ca3535; blue/black/
  focus-yellow unchanged); NHS themes pin v9.x with a re-check note
  for v10's stable release; Wales pins the DHCW system.

- [x] **P3-T8 Dark/high-contrast variant audit** across families;
  coverage matrix in `spec/theme/index.md`; backfill or record
  deliberate exclusions.
  Verify: matrix matches `ls themes/`.
  Done 2026-08-27: 31 light / 14 dark computed from `color-scheme`;
  reference families are deliberately light-only (their upstreams are
  light-first; a dark NHS would be speculation presented as
  reference); no dedicated high-contrast theme ships — recorded as a
  real gap with WCAG 1.4.6 as the bar for building one, not a
  relabel of an aesthetic theme.

## Phase 4 — Accessibility assurance

- [x] **P4-T1 Full-catalog axe sweep** on all 491 `/components/{slug}`
  routes in the SvelteKit app; fix findings; baseline in spec §11.5.
  Verify: sweep exits clean; baseline table updated.
  Done 2026-08-27: `e2e/axe-catalog.spec.ts` (a test per catalog
  entry) — first run 467/491, now 491/491. The 24 failures split
  three ways: 21 demo-map defects (radio roles without aria-checked,
  orphaned menuitem/tab roles, unlabelled inputs, one corrupted demo
  string), 2 shared theme-body defects (video-player text-on-black,
  call-to-action UA-blue links), and 4 NHS themes' accent too light
  for white content — fixed in the DTCG token source. §11.5a records
  the details; standard suites re-verified (74/74; angular spot-check
  29/29 with the propagated demos).

- [x] **P4-T2 Accessibility statement + WCAG mapping**
  (`docs/accessibility-statement.md`, surfaced on the site): what is
  tested by what, what is not, known gaps, audit intention. "Targets"
  wording throughout; no "compliant" claim.
  Verify: `bin/check-links` passes; linked from README, site, and
  SECURITY.md's closing section.
  Done 2026-08-28: docs/accessibility-statement.md (verified-by table,
  the not-verified-by-anything section, review-with-practice rule) +
  a site /accessibility route in the main nav; linked from README,
  SECURITY.md, CONTRIBUTING.md.

- [x] **P4-T3 Component maturity labels.**
  `status` field (`experimental`/`beta`/`stable`) added to catalog
  metadata (`components/{slug}/AGENTS.md` + a rubric doc); surfaced in
  per-component docs and the site catalog; initial assignment
  documented (test depth, screen-reader evidence, production use).
  Verify: all 491 components carry a status; `bin/test` gains a check
  that none is missing; rubric linked from spec/components.
  Done 2026-08-28: evidence-based mechanical rubric (stable = exercised
  in composed flows, 151; beta = the seven-framework default, 332;
  experimental = the newest batch, 8) recorded in spec/components with
  promotion rules. Status lives as a bullet in each AGENTS.md and a
  line in each index.md; the site registry generator reads it from the
  canonical metadata and the catalog renders a badge, so the site
  cannot drift. bin/test asserts exactly one valid Status per
  component (bite-proven).

- [/] **P4-T4 Screen-reader testing matrix.**
  VoiceOver + NVDA (JAWS as funded) × ~20 representative interactive
  components; per-component results recorded; CONTRIBUTING's ask
  becomes a structured intake template (issue form).
  Verify: matrix doc exists with ≥20 rows of real results; issue
  template live.
  Structure done 2026-08-28: docs/screen-reader-matrix.md (twenty
  representative components matched to audit tier 1, result
  vocabulary, per-combination environment format, a sessions ledger
  every cell must trace to) and the screen-reader-report issue form,
  linked from CONTRIBUTING. **Every result cell is deliberately
  empty** — the verify clause wants real results, and this project
  does not record announcements nobody observed. Open remainder: the
  human sessions (the maintainer's VoiceOver would be the first).

- [x] **P4-T5 External audit readiness pack**
  (`docs/audit-readiness.md`): scope, environments, component list,
  known-issues register — so funding converts to an audit without
  delay.
  Verify: doc exists, linked from CONTRIBUTING's money section.
  Done 2026-08-28: docs/audit-readiness.md — tiered scope (interactive
  core incl. the five hand-rolled helper patterns first; composed
  flows; sampled long tail), harness environments, the day-one
  materials, and the publish-the-report-verbatim ask.

## Phase 5 — Documentation and site surfaces

- [x] **P5-T1 News + roadmap routes on the site.**
  `/news` fed from NEWS.md; `/roadmap` fed from plan.md's phases
  (GOV.UK pattern). Closes the outreach plan's blog-route gate.
  Verify: both routes build and render current content; site nav
  links them.
  Done 2026-08-28: bin/sync pipes the canonical NEWS.md and plan.md
  into the site's content dir (so the standalone github.io subtree
  builds alone); the routes render them at build time via marked with
  repo-relative links rewritten to canonical GitHub URLs (the
  sync-special-files rule, applied client-side); both prerender with
  real content and sit in the main nav. Zero hand-maintained copy —
  the site cannot drift from the files.

- [x] **P5-T2 Developer on-ramp in CONTRIBUTING.**
  Dev setup, monorepo + subtree model, the copy-pattern, full
  add-a-component walkthrough (14 subprojects + docs + registries +
  CSS hook), `bin/` tool guide.
  Verify: walkthrough dry-run on a scratch slug passes `bin/test`,
  then reverts cleanly.
  Done 2026-08-28: docs/developing.md (linked from CONTRIBUTING's new
  on-ramp section) — setup, monorepo shape, bin/ tool order, and the
  seven-step walkthrough derived by actually performing it: a
  scratch-probe component was added until bin/test passed (which
  revealed the true gate set: svelte + sveltekit-copy + nunjucks
  implementations ARE machine-gated; the single-line demo-map format
  is mandatory) and then reverted to a clean tree. The walkthrough
  carries an honesty note naming the frameworks bin/test does not yet
  gate (the check-coverage gap, P7-T4).

- [x] **P5-T3 `bin/generate-api-docs`**: per-component reference from
  `components/{slug}/AGENTS.md` into the site; idempotent; drift
  fails `bin/test`.
  Verify: run twice → no diff; site builds; a seeded metadata edit is
  caught.
  Done 2026-08-28: a marked "Canonical contract" region on each of the
  491 site pages, rendering Metadata/ARIA/Keyboard/Props straight from
  AGENTS.md (curated page prose untouched — the generator owns only
  its region, the existing marker-region precedent). Idempotent;
  --check wired into bin/test; a seeded HTML-tag edit caught; braces
  emitted as entities because the output lands in Svelte template
  markup (area-chart's `{ name: string }` prop type broke compilation
  before that). Site builds with all 491 sections prerendered.

- [x] **P5-T4 Migration guides**: `docs/migrating/nhs-uk.md` (v9/v10)
  and `docs/migrating/govuk.md` (v6) — component → Lily slug tables,
  gaps noted.
  Verify: every referenced slug exists in `components.tsv`;
  `bin/check-links` passes.
  Done 2026-08-29: mapped against the live GOV.UK (37) and NHS (38)
  component indexes. 31/37 and 36/38 resolve directly; gaps are
  honestly typed — page-level patterns GOV.UK documents as components
  but Lily treats as composition (cookie banner, exit-this-page,
  feedback), one better served by a helper than a component
  (language navigation -> locale-picker), and two genuine catalog
  gaps (character count, textarea) pointed at RFC.md rather than
  papered over. Every slug reference verified against components.tsv
  before publishing. Linked from COMPARISONS.md.

- [x] **P5-T5 `lily-figma` decision.**
  Either seed a community Figma library from P3-T6 tokens and document
  it, or replace the placeholder with an honest not-planned page
  linking RFC.md §RFC 6. No "coming soon" remains.
  Verify: the route renders real content either way.
  Decided 2026-08-29: not-planned, with a real self-serve path. A
  maintained Figma library/plugin is a separate ongoing commitment
  this project has not taken on. The page instead documents importing
  a theme's DTCG tokens (themes/tokens/*.json, shipped P3-T6) into
  Figma via the existing Tokens Studio community plugin — gets you
  Lily's colours and shape tokens, not Lily's components as Figma
  components, and says so. Links RFC 6 for what would change the
  decision. No "coming soon" remains; the route was an orphan (no
  inbound nav links) and stays one, honestly.

- [x] **P5-T6 Tutorials gain runnable end states.**
  Each site tutorial's finished code exists in-repo (fixture or
  example-app route) and is referenced from the tutorial; verified by
  build/test.
  Verify: per-tutorial verify commands documented and green.
  Done 2026-08-29 by compiling every framework tutorial's exact
  snippet (svelte/server, tsup, vue SSR compile, ng-packagr source,
  Blazor component source, and a byte-check against html/nunjucks'
  plain markup) rather than assuming they worked. Found and fixed a
  real, identical defect in **four of seven** framework tutorials
  (svelte, react, vue, angular) plus Blazor: the Step-3 form snippet
  nested a separate `Label` component inside `Field`, which renders
  TWO labels (one empty, `for` mismatched) because `Field` already
  renders its own from a `label` prop it has in every framework —
  confirmed by rendering the broken version and seeing the duplicate
  `<label>` in the output. All five corrected to the one-label form
  that matches each example app's real, e2e-and-axe-tested
  contact-form route, which each tutorial now links. The theming and
  helpers tutorials' five helper snippets and combined example were
  compiled individually against the published 0.1.1 packages and held
  up unchanged — both gain a verified note.

- [x] **P5-T7 Spell-check gate in CI** over root docs + site content
  (cspell with a project dictionary).
  Verify: CI green; a seeded typo on a branch is caught.
  Done 2026-08-29: cspell.config.yaml (en_US + en_GB, so `behaviour`/
  `colour`/`organisation` don't trip it) + a categorised
  `.cspell/project-words.txt` (150 words: acronyms, tool/brand names,
  coined technical terms, and the 30+-country national-identifier
  names in their native spelling — every one traced to an actual
  finding, none bulk-added). Scope is root `*.md`, `docs/`, `help/`,
  and the site's **hand-authored** routes; the 491 generated
  `/components/{slug}` pages are excluded (they bake `components/*/
  index.md` prose into giant escaped JS-string literals — checking
  491 dirs of catalog prose, much of it in 30+ languages, is a
  separate and much larger undertaking than "docs + site content"
  asks for). Bite-proven: a seeded typo in CONTRIBUTING.md was caught,
  then the file was restored byte-identical. Wired as its own CI job.

## Phase 6 — Examples deepening

- [x] **P6-T1 Composed-page parity matrix** (12 routes × 7 apps) in
  `spec/examples/index.md`; backfill gaps, including first composed
  pages for nunjucks-eleventy; un-skip its responsive sweep.
  Verify: matrix matches reality; per-app e2e passes on new routes.
  Done 2026-08-29: matrix computed — six apps already had all 12,
  nunjucks-eleventy had none. Ported all 12 from html-css-js into
  `layouts/page.njk` templates; extended `accessibility.spec.ts` and
  `responsive.spec.ts`. Chasing apparent flakiness on the new routes
  surfaced four real, pre-existing defects (none specific to the new
  pages — the worst reproduced on the untouched home page): a
  cascade-layer bug where the app's own unlayered `reset.css` was
  silently beating the theme's `@layer lily` component rules
  regardless of specificity (header locale-picker: white text on its
  own white surface); two component CSS files never wired into
  `main.css`'s `@import` list (net-promoter-score-picker family,
  five-face-rating family, container); a default `<dd>` UA margin
  overflowing a grid column; and one breadcrumb/sidebar link combo
  the established `nhsuk-bright-blue`-fails-AA fix hadn't reached yet.
  All fixed. Bite-proven: the four top-level spec files (122 tests)
  pass 5/5 consecutive runs versus a reproducible ~15-30% intermittent
  failure rate before; full 612-spec per-slug suite still green. Full
  record: [CHANGELOG.md](CHANGELOG.md).

- [x] **P6-T2 Flagship "book an appointment" scenario — SvelteKit.**
  Multi-step form, validation, error summary, summary list,
  confirmation; ~30 components; Playwright + axe; written up as
  Lily's first pattern doc (`docs/patterns/book-an-appointment.md`).
  Verify: e2e + axe clean; pattern doc link-checked.
  Done 2026-08-29: `/book-an-appointment` in
  lily-design-system-svelte-sveltekit-examples — 5 steps (reason,
  date and time, your details, check your answers, confirmation)
  composing 32 components (StepList/StepListItem progress,
  RadioGroup, Fieldset, Field, DateInput, Select, TextAreaInput +
  CharacterCounter, SummaryList/SummaryListItem with "Change" links,
  ErrorSummary/ErrorMessage, SuccessPanel, Panel, WarningCallout,
  Details, InsetText, and more). Two real defects found and fixed
  while building it, both documented in the pattern doc: native HTML5
  `required` validation was intercepting `Continue` before the custom
  error summary could run (fixed with `novalidate` on every step's
  `<Form>`); an early draft double-nested `RadioGroup` (which already
  renders its own fieldset) inside a second `Fieldset`. Verified: 9
  dedicated e2e tests in `e2e/book-an-appointment.spec.ts` (happy
  path, one per validation rule, Back button, Change link, reset) all
  passing against a production build; axe-core zero violations across
  all 8 distinct UI states (start screen, reason empty/error/expanded,
  date-time, your-details, check-answers, confirmation); route added
  to the app's `accessibility.spec.ts` and `responsive.spec.ts`
  composed-page sweeps (74/74 passing); `pnpm run check` clean on the
  new file. Full record: [CHANGELOG.md](CHANGELOG.md).

- [x] **P6-T3 Port the flagship scenario to the other 6 apps.**
  Verify: same per app.
  Done 2026-08-29: `/book-an-appointment` ported to React/Next.js,
  Vue/Nuxt, Angular/Analog, Blazor Web, HTML+CSS+JS, and
  Nunjucks/Eleventy — all 7 example apps now carry the flagship
  pattern. Each port trusted its own app's actual headless component
  sources rather than assuming the Svelte reference's prop shapes
  carry over, and each was independently build-verified and e2e
  tested (9-10 dedicated tests per app, axe-clean across every
  distinct UI state). Two real, previously-undiscovered defect classes
  surfaced along the way: Angular's RadioInput/CheckboxInput/StepList/
  SummaryList wrapper-host components can't do what this flow needs
  (extends the existing §11.8 wrapper-host finding from lists to form
  controls; worked around with the same direct-class-hook-markup
  pattern this app already uses elsewhere), and — more seriously —
  five pre-existing Blazor composed pages turned out to be silently
  non-functional (logged as its own tracked item, P7-T8, below, rather
  than folded into this one). Full record: [CHANGELOG.md](CHANGELOG.md).

- [x] **P6-T4 RTL demo route** in each app.
  Verify: e2e asserts `dir="rtl"` and no horizontal overflow.
  Done 2026-08-29: `/rtl-demo` in all 7 example apps — a real `dir="rtl"
  lang="ar"` page (breadcrumb, data table, pagination, a form with
  radios/checkboxes) proving AGENTS/internationalization.md's
  "components do not assume LTR layout", not just a localized page.
  Built canonical-Svelte-first, then ported with the same exact
  reviewed Arabic strings reused verbatim everywhere. Surfaced real,
  previously-unknown defects in 3 of the 7 apps, each fixed in place:
  a cascade-layer/physical-property mix in nunjucks-eleventy's own
  live CSS (caught by a genuine test failure — computed `textAlign`
  was `"left"`, not `"start"` — then fixed across 8 files); a
  double-nested `<fieldset>` around the radio group in an early draft
  of the html-css-js port, the exact anti-pattern
  `docs/patterns/book-an-appointment.md` warns against; and, while
  investigating that app further, a real regression in its own earlier
  P6-T3 port (rules added to a CSS file that turned out to be dead,
  and an invented `.visually-hidden` class with no matching CSS
  anywhere) — fixed by swapping to the catalog's real
  `.screen-reader-span`. Two bigger, unscoped findings from the same
  investigation are tracked separately as P7-T9 and P7-T10 below.
  Verified per app: 4 dedicated e2e tests (dir/lang + overflow, real
  component mirroring — not just text direction, axe, keyboard
  operability), re-run independently for every port; each app's own
  build/check gate green. Full record: [CHANGELOG.md](CHANGELOG.md).

- [x] **P6-T5 `/components` search upgrade**: category + suffix-pattern
  filters; SvelteKit first, then ports.
  Verify: e2e covers filter behaviour.
  Done 2026-08-29: two new selects — Category and Suffix pattern — sit
  alongside the existing free-text search in all 7 example apps, all
  three combining as an intersection. New root canonical data:
  `components-categories.tsv` (491 rows: slug, tag, category), built by
  the new `bin/generate-component-categories` from two sources that
  were already single-source-of-truth — each component's own "HTML
  tag" line in `components/{slug}/AGENTS.md`, and
  `AGENTS/national-person-identifiers.tsv` for the National
  identifiers bucket. `category` is a best-effort STRUCTURAL grouping
  (root element + naming-convention suffix family) — documented in the
  script itself as exactly that, not an editorial content taxonomy.
  `bin/generate-registries` now joins it into every registry it
  writes, so 6 of the 7 apps got the `tag`/`category` fields and a
  shared `CATEGORY_LABEL` map for free; nunjucks-eleventy's own
  build-time data scan (`src/_data/components.js`) reads the same root
  TSV directly, since it isn't part of that generator. Suffix pattern
  needs no generated data at all — it's a pure function of the slug,
  ported identically into every app's own language: the ordered suffix
  list mirrors `AGENTS/components.md`'s suffix→element table and
  compound name-pattern families verbatim, with slugs matching none of
  them (175/491) honestly bucketed "standalone" rather than force-fit.
  Built canonical-Svelte-first, then ported to React, Vue, Angular,
  Blazor, HTML+CSS+JS, and Nunjucks/Eleventy — each independently
  reviewed and re-verified (not just trusting the port's own report):
  build/typecheck, the ported suffix-pattern unit tests, and 4-5
  e2e cases per app asserting against ground truth computed from that
  app's own data (never hardcoded counts), all run for real against
  each app's actual built output in a real browser. React's page had
  no search at all before this — added together with the two filters.
  Nunjucks/Eleventy's had no client-side search either, and its own
  "pages work without JS" principle meant building the whole filter
  panel as a progressive-enhancement injection (the first module in
  its existing `data-module` bootstrapper) rather than server-rendering
  controls that would silently do nothing without JavaScript. Real,
  unrelated bugs fixed along the way: a stale "407 headless components"
  count in Svelte, React, Vue, and Blazor's pages (the catalog is 491
  today) — each now reads its own registry's length live. A concurrent-
  agent hazard surfaced during verification: six ports ran in parallel
  against the same checkout, and several apps' Playwright configs
  default to the same ports (3000, 4173) another sibling app's server
  was using at the same moment — resolved per app by using a distinct
  scratch port for independent re-verification, not by changing any
  shipped config. Full record: [CHANGELOG.md](CHANGELOG.md).

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

- [ ] **P7-T8 Blazor-web-examples: 5 composed pages pass non-existent
  component parameters and silently do nothing.** Found 2026-08-29
  while building P6-T3's Blazor port. `lily-design-system-blazor-headless`
  was rewritten at some point to a minimal, uniform shape —
  `TextInput`, `EmailInput`, `TelInput`, `DateInput`, `TextAreaInput`,
  `Select`, `Option`, `RadioInput`, `CheckboxInput`, `Form`, `Field`,
  `Fieldset`, `SummaryListItem`, etc. now declare only
  `Label`/`CssClass`/`AdditionalAttributes` — no `Value`/`ValueChanged`,
  `Checked`/`CheckedChanged`, `OnSubmit`, `Legend`, `Required`, `Error`,
  or `Term`. `ContactForm.razor`, `SettingsPage.razor`,
  `RatingAndFeedback.razor`, `SearchAndFilter.razor`, and
  `TaskManagement.razor` still pass PascalCase `Value=`/`ValueChanged=`/
  `OnSubmit=`/`Legend=` as if those parameters existed. They don't
  error — the attributes land in `AdditionalAttributes` and get
  splatted onto the root element verbatim, which wires nothing (a
  capital-letter attribute is never recognised as a DOM event handler,
  and `ValueChanged` isn't an event at all) — so the pages *render*
  fine and pass the existing page-load-only accessibility/responsive
  smoke tests, but no real two-way binding or form submission happens
  on any of the five. `dotnet build` even hints at it indirectly
  (`CS0649` on `RatingAndFeedback`'s never-assigned fields). This went
  undetected because no existing e2e test in this app types into a
  field or submits a form and checks the result — only
  `BookAnAppointment.razor` (P6-T3) does that, using the idiom that
  actually works: lowercase `value`/`checked` attributes plus
  `@onchange`/`@oninput`/`@onsubmit` directives, which attribute
  splatting wires correctly regardless of component boundary.
  Fix requires a deliberate choice: restore the removed parameters to
  5+ headless components, or rewrite the 5 pages onto the working
  native-attribute idiom (matching `BookAnAppointment.razor` and the
  one working precedent already in `SettingsPage.razor`'s `@onclick`
  on `RadioInput`). Also update this app's own `AGENTS.md`, whose "Key
  Component APIs" section still documents the old, no-longer-true
  `Value`/`ValueChanged`/`OnSubmit` contract.
  Verify: each fixed page's e2e spec actually types/selects/submits
  and asserts the result, not just page-load + axe.

- [ ] **P7-T9 Per-app legacy `nhs.css`/equivalent is dead code in (at
  least) 6 of the 7 example apps.** Found 2026-08-29 while building
  P6-T4's RTL demo route, then independently re-confirmed per-app
  while porting it to the other five. Nothing imports it any more in
  `lily-design-system-svelte-sveltekit-examples` (`src/lib/css/nhs.css`),
  `lily-design-system-react-next-examples` (`assets/css/nhs.css`),
  `lily-design-system-vue-nuxt-examples` (`assets/css/nhs.css`),
  `lily-design-system-angular-examples` (`src/styles/nhs.css`), or
  `lily-design-system-blazor-web-examples` (`wwwroot/css/nhs.css`) —
  each app's real styling comes entirely from the runtime-swapped root
  `themes/*.css` the theme-picker loads (2026-08-26's "wire themes
  into example apps" work superseded these files without removing
  them). `lily-design-system-html-css-js-examples` has the same dead
  `assets/css/nhs.css`, but see P7-T10 below — that app's story is
  worse than "harmless dead file." `lily-design-system-nunjucks-eleventy-examples`
  is the one confirmed exception: its own `src/assets/css/` is fully
  live (P6-T1/P6-T4 both found and fixed real bugs in it). ~2000 lines
  per app of plausible-looking, actively misleading CSS that changes
  nothing a visitor sees — early drafts of the RTL route "fixed" RTL
  bugs in the Svelte and html-css-js copies before this was caught
  both times. Decide whether to delete outright or fold anything
  genuinely still-relevant into the theme files, for all 6 apps.
  Verify: `grep -rn "nhs.css"` (or each app's equivalent filename)
  under each app's own source tree returns nothing once resolved.

- [ ] **P7-T10 `lily-design-system-html-css-js-examples`: `app-shell.css`
  depends on `--nhs-*` custom properties that only exist in the dead
  `nhs.css` (P7-T9), so they resolve to nothing wherever they're used.**
  Found 2026-08-29 while fixing a regression from P6-T3's own
  `book-an-appointment.html` port (which had added rules to the dead
  `nhs.css`, believing it was live). Confirmed directly in a live
  browser: `getComputedStyle(document.documentElement)
  .getPropertyValue('--nhs-black')` and `--nhs-space-4` both return
  `""` on a served page. `app-shell.css` — the file that actually is
  linked and does style the shared chrome (skip-link, page-wrapper,
  site-header) — uses these tokens throughout
  (`var(--nhs-black)`, `var(--nhs-space-4)`, `var(--nhs-max-width)`,
  etc.), so an unknown amount of that chrome styling is silently a
  no-op on every page in this app, not just the composed ones. Two
  narrower, related gaps found alongside it: (1) the shared reference
  theme has no base `:where(.status-tag)` rule (only
  `[data-status="..."]` variants) and no `:where(.panel)` rule at all,
  so a bare `.status-tag`/`.panel` — used on `book-an-appointment.html`
  — renders with zero styling in every one of the 7 apps, not just
  this one; (2) `book-an-appointment.html` used an invented
  `.visually-hidden` class with no matching CSS anywhere, instead of
  the catalog's real `.screen-reader-span` (fixed in the same commit
  as the RTL demo port, since it's a one-line, obviously-correct
  swap — the `--nhs-*` token gap and the missing shared-theme rules
  were left for this backlog item, since the right fix requires a
  decision this session shouldn't make unilaterally: restore the
  handful of still-needed `--nhs-*` tokens into `app-shell.css`'s own
  `:root`, or migrate its rules onto the theme's `--lily-*`/`--color-*`
  tokens instead).
  Verify: `getPropertyValue('--nhs-black')` etc. return real values on
  a served page; `.status-tag`/`.panel` render visibly styled in every
  app that uses them.

- [ ] **P7-T11 `lily-design-system-angular-examples` has no working
  vitest setup — 491 orphaned `src/app/components/*.spec.ts` files
  can't run.** Found 2026-08-29 while adding P6-T5's suffix-pattern
  unit tests: this app has copies of all 491 `.spec.ts` files from
  `lily-design-system-angular-headless` (part of the standard
  copy-pattern) but never received the matching `vitest.config.ts` /
  TestBed / jsdom / `@analogjs/vite-plugin-angular` wiring that
  angular-headless's own config provides — running `vitest` cold fails
  with `MODULE_NOT_FOUND`. A new `vitest.config.ts` landed in the same
  commit, but deliberately scoped to `src/app/*.spec.ts` only (the
  suffix-pattern test, not the component copies), since actually
  wiring up 491 pre-existing non-functional specs is a separate,
  larger piece of work than one search filter.
  Verify: `pnpm test` runs and passes at least a representative sample
  of `src/app/components/*.spec.ts`, not just the app's own top-level
  logic tests.

- [ ] **P7-T12 pnpm major-version skew across the monorepo: 10 (CI,
  `publish.yml`) vs 11 (this machine's tooling, which is what actually
  maintains the checked-in `pnpm-lock.yaml` files) resolves some
  lockfiles differently, and pnpm 11 alone can't be swapped in blind.**
  Found and part-fixed 2026-08-29 while building P7-T1's new CI jobs,
  in two rounds:
  1. `lily-design-system-svelte-sveltekit-examples`'s lockfile pins
     `cookie@0.6.0` (correct for its `@sveltejs/kit@2.70.3`), but
     installing with pnpm 10 resolves `cookie@2.0.1` instead — a
     hoisting/dedup difference between the majors — breaking the app's
     build outright (`[MISSING_EXPORT] "parse"/"serialize" is not
     exported by ".../cookie/dist/index.js"`). Reproduced directly
     (`pnpm@10 install --no-frozen-lockfile` vs `pnpm@11`, same
     lockfile, different `cookie`).
  2. Bumping *every* `pnpm/action-setup` step in `ci.yml` to 11 (the
     first attempt) broke the six other pnpm-based jobs instead: pnpm
     11 no longer reads the legacy `pnpm.onlyBuiltDependencies` key
     from `package.json` (a `[WARN]` says as much) and now hard-fails
     installs with `[ERR_PNPM_IGNORED_BUILDS]` on any ignored
     postinstall/build script (`esbuild` in this case) rather than
     silently skipping it. The fix landed was scoped instead: only
     `example-smoke`'s `pnpm/action-setup` stays on 11 (the one job
     that actually needs it); `helpers`, `headless`, and
     `html-headless` went back to 10, which the first CI run already
     proved works for all of them.
  This leaves two real, unresolved risks: (a) `publish.yml` still pins
  10, so any future subproject whose *publish* build depends on a
  similarly hoisting-sensitive package could hit round 1's failure the
  next time a tag is pushed — untouched here since it's the tag-gated
  real-publish pipeline and deserves its own dedicated verification,
  not a same-session fix; (b) every subproject's `package.json` still
  carries the legacy `pnpm.onlyBuiltDependencies`/`pnpm.overrides`
  fields pnpm 11 ignores — fine while CI stays on 10, but the moment
  anything else needs 11 (per (a), or a future pnpm-10-only bug), those
  fields need moving to the pnpm-11 location (`pnpm-workspace.yaml` or
  `.npmrc`) first, project-wide, not job-by-job.
  Verify: decide a single pnpm major version for the whole monorepo
  (CI + publish + local tooling) rather than the current per-job split;
  migrate every subproject's build-script allowlist to wherever that
  version reads it; dry-run `publish.yml` and confirm every pack step
  still produces the expected tarball contents.

---

Lily™ and Lily Design System™ are trademarks.
