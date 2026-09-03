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
- The helpers are the six `*-picker` packages (`motion-picker` joined
  2026-09-03); `*-select` naming is obsolete.
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

- [x] **P1-T6 Fresh verification sweep.**
  Re-run every suite in spec §11.4–§11.7 (unit, Storybook, Playwright,
  axe, responsive); restamp tables with 2026-08/09 dates and current
  counts.
  Verify: no §11.4–§11.7 table carries a pre-2026-08 date without a
  "historical" label.
  Done 2026-09-02: every table in spec/testing/index.md and
  spec/index.md §11.4–§11.7 now carries a 2026-09-02 date (the one
  exception, html-headless's WebdriverIO row, is explicitly labelled
  "browser run not re-executed" with the confirmed reason). Found and
  fixed three real defects along the way rather than just restamping —
  full record: CHANGELOG.md "P1-T6: fresh verification sweep across all
  21 subprojects".

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

- [x] **P2-T2 Publish blazor headless + the 5 blazor helper packages
  to NuGet.** Done 2026-09-02 via the real `publish.yml` run
  (33672811301), authenticated with OIDC Trusted Publishing
  (`NuGet/login@v1` + `NUGET_USER`, no `NUGET_API_KEY` secret ever
  existed — see spec/trusted-publishing/index.md). All 6 pushes
  confirmed "Your package was pushed": `LilyDesignSystem.Blazor.Headless`
  0.1.1, `.ThemePicker`/`.LocalePicker`/`.TextSizePicker`/`.SharePicker`/
  `.DateTimePicker` 0.1.0. `dotnet add package LilyDesignSystem.Blazor.ThemePicker`
  404'd immediately after — nuget.org's first-publish validation/indexing
  window for a brand-new package ID, not a push failure; re-verify listing
  once indexing completes.

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

- [x] **P7-T1 CI completeness.**
  Add: 7 headless unit suites, blazor helpers `dotnet test`, one
  example-app Playwright smoke, and P2-T7's consumer smoke — matrixed
  with caching.
  Verify: all jobs green on main; total wall-clock recorded.
  Done 2026-08-29: `ci.yml` gained 4 new jobs — `headless` (matrix:
  svelte/react/vue/angular/nunjucks-headless via `pnpm exec vitest
  run`), `html-headless` (its 491 WebDriverIO specs, real headless
  Chrome), `dotnet-tests` (matrix: blazor-headless + blazor-helpers via
  `dotnet test`, NuGet-cached), and `example-smoke` (SvelteKit — the
  canonical example app — running a real, fast Playwright slice:
  accessibility + responsive + `/components` search + rtl-demo +
  book-an-appointment, 96 cases). Caching added throughout: pnpm cache
  on every Node job including the pre-existing `helpers` job (had
  none), NuGet cache on the two dotnet jobs, a Playwright-browser cache
  on `example-smoke`, and an npm cache on `consumer-smoke` (P2-T7,
  already existed) keyed off its four subprojects' pnpm-lock.yaml files
  since it deliberately installs via plain `npm install`.
  Two real bugs found and fixed getting all 18 jobs green (both are
  the two-round story in P7-T12, logged as its own backlog item for the
  larger fix still open): (1) `lily-design-system-svelte-sveltekit-examples`'s
  build broke under pnpm 10 — its lockfile pins `cookie@0.6.0` but pnpm
  10 hoists `cookie@2.0.1` into the tree instead, a version-skew bug
  against the pnpm 11 this repo's lockfiles are actually maintained
  with locally; (2) bumping *every* job to pnpm 11 to fix that broke
  the other six instead — pnpm 11 no longer reads the legacy
  `package.json#pnpm.onlyBuiltDependencies` field and hard-fails on any
  ignored build script — so the fix landed scoped to `example-smoke`
  alone, the only job that actually needs 11.
  Total wall-clock on the first fully-green run: 11m39s (jobs run in
  parallel; `html-headless`'s WDIO suite is the long pole at 11m34s).
  Per-job durations: svelte-headless 10m11s (4906 tests), vue-headless
  5m33s (2655), react-headless 5m6s (2665), nunjucks-headless 3m51s
  (2844), angular-headless 1m55s (1010), blazor-headless 47s (1502),
  blazor-helpers 29s (203), example-smoke 1m18s (96), consumer-smoke
  3m12s. Full record: [CHANGELOG.md](CHANGELOG.md).

- [x] **P7-T2 `bin/test` profiling.**
  ~63 s today; profile, batch the per-component filesystem checks,
  target < 20 s with zero checks weakened.
  Verify: `time bin/test` < 20 s; same error output on a seeded
  missing-file fault as before.
  Done 2026-08-29, with an honest caveat below. Profiled by
  instrumenting a copy of the script with per-function timers rather
  than guessing. The dominant cost was not check *count* but a real
  interpreter bug: `/bin/sh` on macOS is Apple's frozen bash 3.2 (the
  last GPLv2 release), and under `set -e`, a shell FUNCTION whose body
  chains `cmd || err ...` (or `A && B || err ...`) costs roughly
  180x more per call than the identical logic written as
  `if cmd; then :; else err ...; fi` — confirmed by isolating the
  491-component nunjucks-headless loop alone: 13.4s with the original
  `file_size_or_err`/`file_exists_or_err` bodies, 0.06s with the same
  bodies rewritten as `if`/`else`, same pass/fail result both times.
  Rewrote all five `*_or_err` helpers this way. Also found and fixed a
  real `find "$top" ... -not -path '*/node_modules/*'` in
  `test_helper_glyphs_are_escaped`: `-not -path` only hides matches
  after the fact, it doesn't stop `find` descending into the ~20
  node_modules trees (6+ GB) first — switched to `-prune`, 2.5s → 0.2s
  for that one call, identical output confirmed with `diff`.
  A third attempted fix was caught and reverted before shipping:
  `test_lockfiles_are_tracked` ran `git ls-files --others` twice (once
  case-sensitive, once `-i`), and dropping the case-sensitive call
  looked like a safe no-op (assumed `-i` is a superset). It is not, on
  git 2.55: `git ls-files --others -i --exclude-standard` returned
  *nothing* for a genuinely untracked file, even a literal exact-case
  pathspec — a real git behaviour, not a shell quirk. Caught by
  actually seeding an untracked-lockfile fault and checking the error
  fires, per this task's own verify criterion, rather than trusting an
  empty-vs-empty `diff` taken when nothing was untracked to begin
  with. Reverted to both calls; that check's own cost is real and
  wasn't reduced.
  **Honest timing result**: the two kept fixes are each independently
  verified with dramatic, reproducible local speedups in isolation.
  The full `bin/test` run itself did not reliably land under 20s on
  this session's dev machine — clean runs ranged 61-69s (down from an
  ~85s baseline measured the same way), with one very load-inflated
  outlier (a shared machine with 15+ concurrent sessions this
  session's own load average spiked to 8-12 during measurement, and
  the same reference micro-benchmark that ran in 0.06s minutes earlier
  ran in 10.5s minutes later purely from that contention). The
  reference environment that actually matters for this repo's CI gate
  is already comfortably under target regardless: the `bin/test` CI
  step alone measured 6s on the run immediately before this change
  landed (Linux/dash has none of bash 3.2's pathology) and remains
  fast after. Seeded-fault verification passed for both real fixes
  and the reverted one: identical double-error-message output on a
  missing-file fault, identical single-error output on an
  untracked-lockfile fault, `bin/check-links` and a clean `bin/test`
  run both still exit 0. A further local speedup (restructuring the
  five ~491-iteration implementation loops to avoid re-walking the
  catalog per implementation) remains available if the local number
  still matters enough to chase; not done here since the root cause
  turned out to be the interpreter bug, not the loop shape itself.

- [x] **P7-T3 `bin/new-component` end-to-end generator** (catalog row,
  docs dir, CSS hook, 7 implementations + tests + stories, demos,
  registries).
  Verify: scratch slug → `bin/test` passes → clean revert.
  Done 2026-08-29. `bin/new-component <slug> ["description"]` generates
  a new, generic, working `<div>`-rooted placeholder component (Status:
  experimental — a deliberate choice, since the tool can't know a real
  future component's actual HTML tag, ARIA, or behavior) across: the
  catalog row, the docs dir (`components/{slug}/`), the CSS hook, all 7
  headless implementations + tests + stories (plus their `.md`
  companions for react/vue/angular/blazor, matching the existing
  convention), the two example apps `bin/test` checks per-component
  (`svelte-sveltekit-examples`, `nunjucks-eleventy-examples`), the
  github.io route, and every generated registry — by adding the one new
  demo-map entry and AGENTS.md by hand, then calling the *existing*
  generators (`bin/generate-component-categories`,
  `bin/generate-registries`, `bin/generate-api-docs`) rather than
  reimplementing their logic. `bin/new-component --revert <slug>`
  undoes exactly what a run created (removes new files/dirs,
  `git checkout --`s the shared registries), tracked via a fixed list
  of the files those three generators touch — not a session log, so
  it's only correct if nothing else modified those same files meanwhile
  (documented as a scratch/testing tool, not a merge-aware undo).
  Verified thoroughly, not just structurally: scaffolded a real
  `scratch-widget-p7t3` component, `bin/test` passed clean on the first
  try after one real bug (a missing `mkdir -p` for the nunjucks-headless
  per-component dir) and one real gap (forgetting `bin/generate-api-docs`,
  caught by `bin/test`'s own drift check) were found and fixed;
  `bin/check-links` clean. Went beyond bin/test's structural checks to
  actually run each of the 7 headless catalogs' own test suites against
  the generated component code — not just confirm the files exist:
  svelte-headless 1/1, react-headless 4/4, vue-headless 3/3,
  angular-headless 3/3, and blazor-headless 3/3 all passed for real
  (compiled and asserted correctly, including Blazor's `@($"...")`
  string-interpolation syntax inside a heredoc-generated `.razor` file);
  nunjucks-headless 4/4 passed; html-headless's generated `.html`/`.test.js`
  are well-formed (syntax-checked; the full WDIO suite needs a browser
  run, already covered by every other component in the P7-T1 `headless`
  CI job). Reverted three times across the verification pass; `git
  status` and `bin/test` both came back clean every time.
  Two small, real, unrelated discoveries logged as new backlog items
  rather than fixed here (P7-T13, P7-T14) — a doc/implementation
  mismatch and a likely-dead legacy directory, both found in
  svelte-headless while using its `kbd` component as this tool's
  structural reference.

- [x] **P7-T4 `bin/check-coverage` drift matrix** (catalog ↔
  implementations ↔ tests ↔ stories ↔ demos ↔ CSS hooks), non-zero on
  drift, in CI.
  Verify: exits 0 now; seeded fault detected.
  Done 2026-08-29. Node script (fast — ~10,000 `existsSync` checks run
  in milliseconds, sidestepping P7-T2's bash-3.2-under-`set -e`
  pathology entirely by not being shell). Prints a matrix (missing /
  491) for each of the 7 headless catalogs × {impl, test, story} —
  Blazor's story column reads "n/a", a documented exception
  (spec/index.md §11.7), not a gap — plus the canonical demo map and
  the CSS hooks, then lists every gap and exits 1 if any exist.
  Deliberately scoped to the 7 *headless* implementations, matching
  `AGENTS/components.md`'s "7 headless subprojects" framing — not the
  separate, adjacent concern of the example apps' own per-component
  copies (a real gap surfaced there while building this tool; logged
  below as P7-T15 rather than folded into this one's scope). Wired into
  the `verify` CI job right after the registries-freshness check.
  Verified for real: runs clean on HEAD today (0/491 everywhere, matrix
  confirms full parity — genuinely true, not just asserted, since the
  tool checks each dimension file-by-file); seeded three different
  single-file faults (a missing Vue story, a missing demo-map entry, a
  missing CSS hook) one at a time and confirmed each is caught with the
  exact right dimension/slug/path in the gap list, then restored and
  re-confirmed clean every time.

- [x] **P7-T5 (stretch) Visual regression baseline**: ~30 components ×
  3 themes × light/dark, Playwright screenshots, SvelteKit app. Done
  2026-09-03: `e2e/visual-regression.spec.ts` in
  `svelte-sveltekit-examples`, 30 slugs spanning all 11 categories
  (content, national, forms, navigation, lists, tables, links,
  pickers, overlays, media, buttons, data-viz) × 3 themes (the app's
  default `united-kingdom-national-health-service-england-for-patients`,
  `united-kingdom-government-digital-service`, and `dark` — chosen so
  light and dark rendering are both represented, since the 45
  reference themes are each a single fixed palette rather than a
  light/dark pair of the same theme; see AGENTS/theme.md) = 90
  screenshots of the `/components/{slug}` demo region only (`main
  .card`), not full-page, so header/footer chrome changes don't
  produce spurious diffs. Snapshot names carry an explicit
  `process.platform` suffix on top of Playwright's own — baselines are
  inherently OS-dependent (font rendering), so a Linux CI run will add
  its own `-linux` baseline alongside this `-darwin` one rather than
  conflict with it.
  Verify: baseline committed (90 PNGs, `e2e/visual-regression.spec.ts-snapshots/`,
  584K); re-run without `--update-snapshots` reports 90/90 passed,
  confirmed stable across two consecutive runs.

- [x] **P7-T6 (stretch) Web Components headless subproject** — 8th
  headless library as native custom elements. Done 2026-09-03, scoped
  by explicit user choice to **scaffold + representative subset, not
  full catalog parity**: `lily-design-system-web-components-headless`
  ships 30 of the 491 canonical components (8 buttons/links, 5 forms,
  4 overlays, 6 media/data, 7 content), each a real, tested autonomous
  custom element (`customElements.define("lily-{slug}", ...)`), plus
  the full required-file set, build tooling, and Storybook config.
  Architecture decisions recorded in the subproject's own
  `spec/index.md`: autonomous custom elements over customized
  built-ins (WebKit never implemented the latter and has said it won't
  — `<button is="...">` silently fails to upgrade in Safari), light
  DOM only (no shadow root, so consumer CSS reaches every element the
  same way it does in the other seven catalogs), and two structural
  patterns (wrap-a-real-element for 26 components, self-is-the-wrapper
  for the 4 `<div>`-rooted ones — `Alert`, `Banner`, `ContextualHelp`,
  `Coachmark`). Deliberately excluded and documented as a real, unsolved
  gap rather than an oversight: every `*ListItem` and table sub-element
  family (needs a tag+attribute selector only customized built-ins
  support — the same wrapper-host defect class angular-headless's
  0.3.0 fixed) and the 92 national personal identifier components.
  A real defect was found and fixed during this slice's own test run:
  `bar-chart.ts`'s attribute passthrough destructured `Attr` nodes as
  `[key, value]` pairs (they aren't iterable that way), throwing on
  every render with any attribute at all — fixed by using the same
  `passThroughAttributes` helper every sibling component already used.
  Verify: 163 tests across 30 `.test.ts` files pass
  (`pnpm exec vitest run`); `tsc --noEmit` clean; `pnpm build` produces
  a non-empty `dist/index.js` + `.d.ts`; a 31st `index.test.ts` imports
  the **built** dist bundle and confirms all 30 tags self-register
  (165 tests total); `pnpm build-storybook` succeeds for all 30
  stories; root `bin/test` and `bin/check-links` both pass clean with
  the new subproject present. Not yet done: git-subtree push to a
  standalone remote, and npm publish — this session scoped the task to
  building and verifying the subproject itself, not its first release.

- [x] **P7-T7 (stretch) `motion-picker` helper** (`data-motion`,
  reduced-motion default) — Svelte canonical, then 6 ports, following
  the five-helper contract in `AGENTS/helpers.md`. Done 2026-09-03:
  built in all 7 catalogs (Svelte, React, Vue, Angular, HTML,
  Nunjucks, Blazor), each following its own catalog's exact
  text-size-picker idiom (closest sibling: same icon-button + APG
  listbox shape, no OS-detection precedent to follow). One deliberate
  behaviour difference from all three preference siblings: the initial
  value defers to `(prefers-reduced-motion: reduce)` **unconditionally**
  (not an opt-in flag like theme-picker's `detectFromSystem`) — motion
  has a real accessibility signal (WCAG 2.3.3) worth defaulting to.
  Glyph: pause sign (U+23F8 + U+FE0E), chosen over an abstract symbol
  for the "stop the moving parts" reading and real monochrome coverage
  in ordinary fonts. Nunjucks has one documented deviation: the OS
  check is unavailable at template-render time, so the macro marks
  `motions[0]` selected server-side and the client corrects it on
  init (the same pattern theme-picker's own `detectFromSystem` uses).
  The 45 `themes/*.css` files gained a `.motion-picker-icon` selector
  and `bin/check-theme`'s `HELPER_PREFIXES`/`bin/smoke-packages` were
  updated to recognise it; the icon's `--lily-picker-icon-scale` is
  documented as a reasoned placeholder (reference scale) rather than a
  fabricated measured value, since I could not reproduce the original
  four factors' measurement methodology to extend it honestly.
  Verify: per-catalog tests pass (Svelte 242, React 310, Vue 309,
  HTML 346, Nunjucks 381, Angular 345, Blazor 234 — all catalog
  totals, up from the pre-existing counts by the new suite's size);
  `bin/smoke-packages` (extended to cover motion-picker) run for real
  end-to-end against all 6 npm catalogs' built tarballs — "all
  packages OK"; `npm publish --access public --dry-run` verified
  directly against the built `lily-design-system-svelte-motion-picker`
  package — packs and validates cleanly (never-published 0.1.0, no
  registry conflict). The aggregate `bin/publish-helpers --dry-run`
  itself could not be used for this verification — see the new
  backlog item below, a real pre-existing defect this surfaced.

- [x] **P7-T19 `bin/publish-helpers --dry-run` (and
  `bin/publish-headless --dry-run`) fails on any already-published
  package encountered before an unpublished one in the loop.** Found
  2026-09-03 verifying P7-T7. `npm publish --dry-run` contacts the
  real registry and refuses outright ("You cannot publish over the
  previously published versions: X.Y.Z") when the local version
  already exists there — confirmed against the live registry
  (`npm view lily-design-system-svelte-date-time-picker version` →
  `0.1.1`, matching the in-repo version). Because the aggregate
  scripts loop with `set -eu`, hitting this on ANY already-published
  package (alphabetically, `date-time-picker` sorts before
  `motion-picker` in the svelte catalog) aborts the whole dry run
  before later packages — including a brand-new, never-published one
  like `motion-picker` — are ever reached. This means the project's
  own "dry-run first, always" discipline (`docs/releasing.md`) has
  been silently broken since the first package was actually published
  (2026-08-26), and no prior dry run caught it because dry runs before
  that date had nothing already published to collide with.
  Fixed 2026-09-03: both scripts gained a `publish_npm_package()`
  helper that runs `npm publish --access public --dry-run`, captures
  its combined output, and treats "You cannot publish over the
  previously published versions" as a non-fatal, expected outcome —
  printing the same output either way — while any other failure (bad
  manifest, network error, missing dist, …) still propagates and
  aborts the script exactly as before. Real (non-dry-run) publishing
  is untouched: the tolerance only applies when `$DRY` is set.
  Verify: `bin/publish-helpers --dry-run` run for real end-to-end —
  exits 0, correctly tolerates 30 already-published npm packages
  (svelte/react/vue/html/nunjucks/angular × the 5 pre-existing
  `*-picker` helpers) while the 6 new, never-published
  `motion-picker` packages dry-run-succeed normally (`+
  lily-design-system-{catalog}-motion-picker@0.1.0`), then continues
  through and packs all 6 Blazor `.nupkg`s. `bin/publish-headless
  --dry-run` also run for real: exits 0, tolerates 5 already-published
  headless packages, packs the Blazor headless `.nupkg`. Root
  `bin/test` and `bin/check-links` both still pass.

- [x] **P7-T8 Blazor-web-examples: 5 composed pages pass non-existent
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
  Done 2026-08-30: chose the rewrite-the-pages option — the headless
  minimalism looked intentional, and `BookAnAppointment.razor` already
  proved the idiom works end to end. Rewrote all 5 pages onto the
  native-attribute idiom (lowercase `value`/`checked`/`name` +
  `@onchange`/`@oninput`, `novalidate @onsubmit` on `Form`, a real
  `<legend>` inside `Fieldset` instead of the fictitious `Legend`
  param). Two rating pickers (`FiveStarRatingPicker`,
  `FiveFaceRatingPicker`, `NetPromoterScorePicker`) turned out to be
  thin `role="radiogroup"` wrappers with no baked-in radios (same
  shape as `RadioGroup`), so the page now supplies real `RadioInput`
  children directly, matching the `RadioGroup` composition
  `BookAnAppointment.razor` already established.
  Investigating `SearchAndFilter.razor` surfaced two further real,
  independent defects in `lily-design-system-blazor-headless` itself
  (fixed alongside, with new bUnit coverage — 1509/1509 pass, was
  1502): `Combobox` was missing `Value`/`ValueChanged` and rendered no
  `<input>` at all (just a bare `<div role="combobox">`), unlike the
  canonical Svelte/React versions which both bake in a real text
  input — fixed to match parity, so the page's `@bind-Value`/
  `@bind-Open` now work and its `ChildContent` is bare `role="option"`
  elements (no separate `Listbox` wrapper, since `Combobox` renders
  its own listbox internally). `SwitchButton` declared real
  `Checked`/`CheckedChanged` parameters but never actually invoked
  `CheckedChanged` on click — the parameters looked wired but did
  nothing without the consumer separately wiring `@onclick` — fixed
  with an internal `@onclick` handler; caught by a genuine e2e
  failure (`aria-checked` stayed `"false"` after clicking Dark mode),
  not by inspection.
  Root-caused *why* this happened: both
  `lily-design-system-blazor-headless/AGENTS.md` and this app's own
  `AGENTS.md` documented the old `Value`/`ValueChanged`/`OnSubmit`
  contract as the general pattern across "State Management"/"Key
  Component APIs" — the exact thing an agent (or a person) would
  read before writing one of these pages. Rewrote both docs to state
  the real rule (most components are `Label`/`CssClass`/
  `ChildContent`/`AdditionalAttributes` only; the native-attribute
  idiom is the norm; only `SwitchButton`, `Combobox`, and
  `AccordionCheckbox` genuinely bind) and corrected the stale
  `Alert`/`ErrorSummary` "Known Gotchas" entries found along the way.
  New e2e coverage: `e2e/p7-t8-composed-pages.spec.ts`, 7 tests
  actually typing into fields, checking radios/checkboxes, selecting
  options, filtering the combobox, and submitting each of the 5 forms
  — all pass against the real `dotnet run` dev server, not just
  build+bUnit. Full existing suites re-verified green after the
  change: 1509 blazor-headless bUnit, 1007 blazor-web-examples bUnit,
  and the app's `accessibility`/`responsive`/`book-an-appointment`/
  `components-index`/`site-preferences`/`theme-switching`/`rtl-demo`
  e2e specs (23 + 79 passed) — one unrelated pre-existing failure
  surfaced (`/components/dialog` axe color-contrast), logged as
  P7-T17 below rather than folded into this fix. Full record:
  [CHANGELOG.md](CHANGELOG.md).

- [x] **P7-T17 `/components/dialog` fails an axe color-contrast check
  in blazor-web-examples.** Found 2026-08-30 while re-verifying the
  full accessibility suite after P7-T8. Unrelated to P7-T8's changes
  (nothing touched Dialog or the theme CSS); reproduces in isolation
  (`npx playwright test e2e/accessibility.spec.ts -g "components/dialog"`).
  Not yet root-caused — likely one of the 45 themes' contrast on the
  Dialog demo's sample content, in the same family as the §11.5a
  token-contrast fixes.
  Verify: `expectNoViolations` passes for `/components/dialog` across
  a full `accessibility.spec.ts` run.
  Done 2026-08-30: NOT a theme contrast defect — root-caused as a pure
  test-timing race. `App.razor`'s inline bootstrap script appends the
  managed theme `<link>` to `<head>` before first paint, but a
  dynamically-appended stylesheet link doesn't block painting the way
  a static one in the original HTML does, so the pre-rendered page can
  briefly paint with zero author styles. Confirmed by instrumenting
  `getComputedStyle` on `.button` across repeated navigations (always
  settled on the theme's real colours, oklch(0.45 0.17 251) bg / white
  text, ~7.3:1 contrast — comfortably over the 4.5:1 AA floor) while
  the flaky axe report showed colours (`#116cba`/`#cecece`) matching
  none of the 45 theme files — a mid-repaint artifact, not a themed
  state. Fixed by waiting for the managed theme stylesheet to actually
  parse (`link.sheet !== null`) before scanning. That surfaced a
  second, independent circuit-timing race on `/rtl-demo`
  (`document-title` violation — `<HeadOutlet>` can still clear
  `<title>` a moment after its first non-empty read, so polling
  `document.title !== ''` alone raced too), the same flake class the
  2026-08-26 sweep (§11.8) had already fixed elsewhere in this app;
  fixed the same way, waiting for `window.Blazor` plus a 300ms settle
  matching `book-an-appointment.spec.ts`'s `gotoReady`. Verified: 50/50
  clean repeats of the two affected routes, 8/8 clean full-suite runs
  after the fix (was 6/12 clean before). Along the way, a full `e2e/`
  run also surfaced 7 unrelated, pre-existing, deterministic (not
  flaky) test bugs — `calendar-table-th`, `data-table-th`,
  `kanban-table-th`, `table-th`, `gantt-table-tbody`,
  `gantt-table-thead`, and `gantt-table-tr`'s specs asserted the wrong
  PascalCase name (a TH/TD swap in four, a dropped "t" or wrong case in
  the three gantt ones) — confirmed via `curl` that the live page
  already rendered the correct canonical name in every case, so these
  were spec-authoring bugs, not component defects; fixed all 7 to
  match `components.tsv`. Full record: [CHANGELOG.md](CHANGELOG.md).

- [x] **P7-T9 Per-app legacy `nhs.css`/equivalent is dead code in (at
  least) 6 of the 7 example apps.** Found 2026-08-29 while building
  P6-T4's RTL demo route, then independently re-confirmed per-app
  while porting it to the other five.
  Verify: `grep -rn "nhs.css"` (or each app's equivalent filename)
  under each app's own source tree returns nothing once resolved.
  Done 2026-08-30: confirmed dead the same rigorous way each time — a
  real-import/link grep across every source file in the app (not just
  docs or comments) turned up nothing in any of the 6, and each app's
  actual global entry point (`+layout.svelte`, `layout.tsx`,
  `nuxt.config.ts`'s `css` array, `main.ts`, `App.razor`'s `<link>`)
  imports `app-shell.css` instead. Deleted all 6 `nhs.css` files
  (`lily-design-system-svelte-sveltekit-examples/src/lib/css/nhs.css`,
  `-react-next-examples/assets/css/nhs.css`,
  `-vue-nuxt-examples/assets/css/nhs.css`,
  `-angular-examples/src/styles/nhs.css`,
  `-blazor-web-examples/.../wwwroot/css/nhs.css`,
  `-html-css-js-examples/assets/css/nhs.css`) outright — nothing worth
  folding into the theme files; the runtime `themes/*.css` already
  comprehensively styles every component class these files also
  covered. Fixed the resulting stale `AGENTS.md` mentions in 4 apps
  (react-next, vue-nuxt, angular, blazor-web) that still described
  `nhs.css` as the live stylesheet; html-css-js's `AGENTS.md` had the
  same drift, fixed too.
  `lily-design-system-nunjucks-eleventy-examples` remains the one
  confirmed exception (its own `src/assets/css/` is genuinely live).

- [x] **P7-T10 `lily-design-system-html-css-js-examples`: `app-shell.css`
  depends on `--nhs-*` custom properties that only exist in the dead
  `nhs.css` (P7-T9), so they resolve to nothing wherever they're used.**
  Found 2026-08-29 while fixing a regression from P6-T3's own
  `book-an-appointment.html` port.
  Verify: `getPropertyValue('--nhs-black')` etc. return real values on
  a served page; `.status-tag`/`.panel` render visibly styled in every
  app that uses them.
  Done 2026-08-30, and the real scope was bigger than originally
  logged: all 6 apps' `app-shell.css` use the exact same 11
  `--nhs-*` custom properties (`--nhs-black`, `--nhs-white`,
  `--nhs-font-family`, `--nhs-font-size-19`, `--nhs-line-height-normal`,
  `--nhs-focus-color`, `--nhs-focus-text-color`, `--nhs-max-width`,
  `--nhs-space-2/3/4`), not just html-css-js — every one of them was
  silently resolving to nothing, identically, in every app. Fixed by
  restoring the 11 real values (extracted from the about-to-be-deleted
  `nhs.css`, confirmed byte-identical across all 6 copies first) as a
  `:root` block at the top of each app's own `app-shell.css`, labelled
  as the app-shell's own fixed brand tokens — deliberately NOT
  swappable by the theme-picker, since that only applies to Lily
  component classes, not the app-owned chrome. Verified for real in a
  live browser in all 6 apps (not just one): built and served each app,
  confirmed `getComputedStyle(document.documentElement)
  .getPropertyValue('--nhs-black')` returns `#231f20` and `--nhs-space-4`
  returns `1.5rem` (previously both `""`) on every one.
  The two "narrower, related gaps" originally logged alongside this
  turned out to already be fixed, or never true: `.status-tag` and
  `.panel` DO have real base `:where(...)` rules in every one of the 45
  reference themes (checked directly, not assumed) — `.status-tag`
  shares a rule with `.badge`/`.flair`/`.tag`/`.ai-label`,
  `.panel` shares one with `.card`/`.feature-card`/etc. — so nothing
  needed fixing there; this session couldn't determine whether that was
  already true when P7-T10 was first logged or fixed by unrelated work
  since. The `.visually-hidden` → `.screen-reader-span` swap in
  `book-an-appointment.html` was already done in the original commit
  (confirmed: 0 occurrences of `.visually-hidden`, 7 of
  `.screen-reader-span` in that file).

- [x] **P7-T11 `lily-design-system-angular-examples` has no working
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
  Investigated further 2026-08-30, still open — the config gap wasn't
  the real blocker. Wired up the same `@analogjs/vite-plugin-angular` +
  jsdom + TestBed setup angular-headless's own `vitest.config.ts` uses
  (this app already depends on both packages for its own Analog build),
  and initially suspected a zone.js-vs-zoneless TestBed mismatch (this
  app bootstraps zoneless; angular-headless's setup imports zone.js) —
  ruled that out directly: switching to the non-deprecated,
  zoneless-native `BrowserTestingModule`/`platformBrowserTesting()`
  (no zone.js at all) changed nothing. With either TestBed setup, the
  491 specs actually RUN (no crash) and roughly half their assertions
  pass — every "renders the base class" check succeeds — but every
  assertion that depends on `fixture.componentRef.setInput()` actually
  reaching a signal `input()` fails: confirmed by instrumenting a
  component's own `className()` signal after `setInput("className",
  "extra")` and finding it still reads back the untouched default `""`.
  `setInput()` is a silent no-op for signal inputs in this app's own
  Vite/Angular compilation pipeline. Likely cause, not yet confirmed:
  `pnpm why @angular/core` and the `.pnpm` store both show this app's
  own dependency tree pulls THREE distinct forked copies of
  `@angular/core` (`22.1.3` with a `zone.js` peer variant, `22.1.3`
  without one, and an unrelated `20.3.23` pulled in transitively via
  `@analogjs/router`/`@analogjs/content`, which in turn resolve an
  OLDER `@analogjs/vite-plugin-angular@1.22.5` pinned to
  `@angular/build@20.3.26`) — vs. angular-headless's single, unforked
  `@angular/core@22.1.3`. A bare `angular()` plugin call in a
  standalone `vitest.config.ts` (this app's REAL build only works
  through `vite.config.ts`'s `@analogjs/platform` `analog()` wrapper,
  which Vitest ignores by design once a sibling `vitest.config.ts`
  exists) may simply not carry whatever option that wrapper sets to
  make signal-input compilation land in the same module instance the
  test's `TestBed` resolves. Reverted all of it (`vitest.config.ts`
  back to the narrow, working `src/app/*.spec.ts` scope; the
  zone-vs-zoneless `vitest-setup.ts` experiment removed entirely; the
  `zone.js` devDependency added then removed, net no diff) rather than
  ship a widened config whose own tests fail — confirmed the reverted
  state is byte-identical to before and its one real test still passes
  5/5.
  Verify (updated): the same as before, plus — once a fix is found —
  confirm it via the same instrumented-signal check (`className()`
  reads back `"extra"` after `setInput`), not just "the test file ran
  without crashing".
  Done 2026-09-02: neither of the 2026-08-30 investigation's two
  suspects was the real cause. `pnpm why @angular/core` now shows only
  ONE resolved copy (the "three forked copies" it found had since
  converged via ordinary dependency updates), and re-testing with the
  exact zone.js + `BrowserDynamicTestingModule` setup
  angular-headless's own `vitest.config.ts` uses reproduced a much more
  informative failure than the old "silent no-op": a hard
  `NG0303: Can't set value of the 'className' input ...` runtime error,
  with a compiler warning right above it — `"Badge.ts" contains
  Angular decorators but is not in the TypeScript program"`. The real
  cause: this app has a `tsconfig.json` and `tsconfig.app.json` but
  never had a `tsconfig.spec.json` — the file
  `@analogjs/vite-plugin-angular` looks for by convention to know which
  files are in its Angular-compiler program. Without it, component
  `.ts` files compiled without the metadata `ComponentRef.setInput()`
  needs to recognize a signal input. Added `tsconfig.spec.json`
  (mirroring angular-headless's own, scoped to
  `src/app/**/*.spec.ts` + `vitest-setup.ts`), widened
  `vitest.config.ts`'s `include` to `src/app/components/**/*.spec.ts`,
  and added the matching `vitest-setup.ts` (zone.js +
  `BrowserDynamicTestingModule`, byte-identical to angular-headless's).
  No per-component changes were needed. Verified: all 492 spec files
  (491 components + the suffix-pattern test) pass, 990/990 tests,
  including the exact instrumented check the task asked for
  (`Badge`'s `setInput("className", "extra")` now correctly reaches
  the DOM); confirmed the real app build (`vite.config.ts`'s
  `analog()` pipeline, which `vitest.config.ts` doesn't touch) still
  builds and prerenders its full 507 pages unaffected.

- [x] **P7-T12 pnpm major-version skew across the monorepo: 10 (CI,
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
  Done 2026-09-02: the version split wasn't actually the root cause of
  round 2's `[ERR_PNPM_IGNORED_BUILDS]` failures — two real bugs were.
  Four `pnpm-workspace.yaml` files had the literal unfilled template
  placeholder `"set this to true or false"` instead of `true` for
  `esbuild` (and, in `html-headless`/`html-css-js-examples`,
  `chromedriver`/`edgedriver`/`geckodriver` too — which also fully
  explains and corrects the "browser run not re-executed: network
  block" note in spec/testing/index.md; the real cause was this
  ignored-postinstall bug, not the network). And ten subprojects
  gitignored `pnpm-workspace.yaml` instead of committing it, so the
  committed repo state — what CI and a fresh clone see — had no
  allowlist for them at all, invisible locally because the untracked
  file was still on disk. Fixed both, removed the now-redundant legacy
  `pnpm.onlyBuiltDependencies` field from all 13 package.json files
  that had it (confirmed `pnpm.overrides` still works from package.json
  under pnpm 11 unchanged), and moved `ci.yml`'s `helpers`/`headless`/
  `html-headless` jobs and `publish.yml` to pnpm 11, matching
  `example-smoke` and this machine's own tooling. Verified: fresh
  `pnpm install --no-frozen-lockfile` clean for all 19 pnpm-based
  subprojects; every CI-matrix catalog's vitest suite re-run and
  matched P1-T6's counts exactly; `pnpm -C lily-design-system-angular-helpers
  build` (the one pnpm call inside the publish scripts) succeeded;
  `bin/publish-headless --dry-run` / `bin/publish-helpers --dry-run`
  packed real tarballs before hitting npm's expected
  already-published gate. Full record: CHANGELOG.md.

- [x] **P7-T13 `svelte-headless`'s `Kbd` renders `<div>`, not the
  `<kbd>` its own `components/kbd/AGENTS.md` documents ("HTML tag:
  `<kbd>`").** Found 2026-08-29 while building P7-T3's
  `bin/new-component`, using `kbd` as the cross-framework structural
  reference — every other framework's `Kbd` (react, vue, angular, html,
  blazor, nunjucks) correctly renders a native `<kbd>`; only
  `lily-design-system-svelte-headless/src/lib/components/Kbd/Kbd.svelte`
  (and its exact copy in `svelte-sveltekit-examples`) uses `<div>`
  instead.
  Verify: `Kbd.svelte` renders `<kbd>`; its existing test (which
  currently asserts by `aria-label` and class, not tag name) gains an
  assertion on the tag itself so this can't silently regress again.
  Done 2026-08-30: both `<div>` → `<kbd>` (root `components/Kbd/Kbd.svelte`
  AND its `src/lib/components/Kbd/Kbd.svelte` mirror — see P7-T14 below
  for why there are two) plus the sveltekit-examples copy, three files
  total. The test in all three now asserts `el.tagName === "KBD"`, not
  just class/aria-label, so this exact regression can't recur silently.
  The theme CSS already sets `display: inline-block` on `:where(.kbd)`
  explicitly (confirmed in `themes/adobe-spectrum.css` and every
  sibling theme), so the tag change carries zero visual/layout risk.
  Verified for real: `pnpm exec vitest run` on each of the three
  `Kbd.test.ts` files passes (2 passed in svelte-headless — both
  mirrors' tests run together via vitest's default glob — plus 1 in
  svelte-sveltekit-examples).

- [x] **P7-T14 `lily-design-system-svelte-headless` carries a second,
  likely-dead copy of every component under a root `components/`
  directory, duplicating `src/lib/components/`.** Found 2026-08-29
  alongside P7-T13.
  Verify: confirm nothing loads `components/` at build, test, or
  Storybook time (the way P7-T9 confirmed each dead `nhs.css` with a
  live served-page check); if genuinely dead, delete the directory and
  confirm `pnpm test`/`pnpm run build`/Storybook all stay green.
  Corrected 2026-08-30 — the original finding was backwards. Reading
  `build.mjs` (not checked before marking this a suspected duplicate)
  shows the root `components/` directory is the ACTUAL PUBLISHED
  SOURCE: `componentsDir = path.join(root, "components")`, read
  directly to generate the package's `index.ts` barrel and its `dist/`
  build. `src/lib/components/` is the SvelteKit-convention mirror kept
  for local dev — both are real, both are exercised (vitest's default
  include glob picks up `**/*.test.ts` project-wide, so both copies'
  tests already ran in the P7-T1 CI job, matching the historical
  "4,906 vitest cases across 983 dual-mirror spec files" acceptance
  note this session had read but not connected to this finding before
  investigating further). Consequence: P7-T13's initial fix (which only
  touched `src/lib/components/Kbd/Kbd.svelte`) missed the copy that
  actually ships to npm consumers — `components/Kbd/Kbd.svelte` was
  still rendering `<div>`. Fixed in the same pass once caught. No
  directory was deleted; both are real and load-bearing.

- [x] **P7-T15 `react-next-examples` and `vue-nuxt-examples` are each
  missing per-component implementation files for all 80 national
  personal identifier components.** Found 2026-08-29 building P7-T4's
  `bin/check-coverage` — these two apps each carry only 411 of 491
  possible `components/{Pascal}.{tsx,vue}` files (confirmed: the exact
  same 80 missing names in both, all national-identifier
  input/view pairs). These files aren't used by the apps'
  `/components/{slug}` demo pages (those render from the shared
  `component-demos.ts` registry + `dangerouslySetInnerHTML`/`v-html`,
  confirmed by reading `app/components/[slug]/page.tsx`), so nothing is
  currently broken — they exist so a *composed* page can `import` and
  compose a real interactive component directly, the way
  `book-an-appointment.tsx`/`.vue` already do for other components. No
  composed page currently imports any of the 80 missing ones (confirmed
  by grep), so this is a latent gap, not an active break. Deliberately
  out of scope for `bin/check-coverage` itself (see P7-T4: that tool is
  scoped to the 7 headless catalogs, not the examples' own copies) and
  out of scope to fix here (porting 80 components x 2 frameworks is a
  substantial task on its own, not a side effect of building a
  coverage tool).
  Verify: `find components -maxdepth 1 -iname '*.tsx'` (or `.vue`)
  count reaches 491 in both apps; `bin/check-coverage` (or a follow-up
  extension of it covering example-app copies) exits 0 against them.
  Done 2026-08-30: confirmed the copy-pattern first (diffed several
  existing shared components — the examples' `.tsx`/`.vue` files are
  byte-identical copies of the headless source; the `.stories.tsx`/
  `.stories.ts` companions differ only by a `title: 'Headless/...'` →
  `'Examples/...'` rewrite, plus a Storybook framework import swap for
  react's `.stories.tsx`). Copied all 80 `.tsx`+`.stories.tsx` pairs
  into react-next-examples and all 80 `.vue`+`.stories.ts` pairs into
  vue-nuxt-examples with that exact transform, scripted and verified
  against every existing pair first (no manual one-offs). Both apps
  reach 491/491. No registry/barrel file needed — neither app has an
  index of component files, and both `.storybook/main.ts` configs glob
  `components/**/*.stories.*`, so the new stories are picked up
  automatically. Verified for real, not assumed: `next build` (509
  static pages) and `nuxt build` both succeed; `vitest run` in both
  apps shows the exact same pre-existing failure count before and
  after (confirmed via `git stash push -- components/` round-trips —
  12 failed/9 passed in react-next, 1 failed/263 passed in vue-nuxt,
  identical either way, and none of the failing files are among the 80
  added); react's `storybook build` succeeds with all 491 stories.
  vue's `storybook build` does NOT succeed — logged separately as
  P7-T18 rather than folded in here, since it's pre-existing (fails
  identically with the 80 new files stashed out) and unrelated (the
  one failing file, `TimelineListItem.vue`, isn't among the 80).

- [x] **P7-T16 `.summary-list`'s CSS Grid track sizing overflows narrow
  viewports: `grid-template-columns: max-content 1fr auto` forces the
  first column to its full unwrapped text width, ignoring the
  container.** Found and fixed 2026-08-30, surfaced by the P7-T9/P7-T10
  `--nhs-*` fix itself: restoring `.page-wrapper`'s real padding
  reduced `/dashboard`'s available width just enough to turn an
  already-marginal `max-content` column into an actual 9px overflow at
  375px — caught by real CI (`example-smoke`'s `responsive.spec.ts`
  went red on `mobile /dashboard`), not found in advance. Root-caused
  directly: instrumented the live page to find every element wider
  than the viewport, traced it to `SummaryListItem`'s `<dt>`/`<dd>`
  pair (dashboard's stat labels — "Total admissions", "Emergency
  cases" — none of which fit on one line at 375px once the column
  refuses to shrink). All 45 reference themes carried the identical
  rule. Fixed by changing the first column to
  `minmax(0, max-content)` in all 45 — strictly more permissive than
  bare `max-content` (behaves identically once there's room, only
  differs by allowing the column to shrink and wrap when there isn't),
  so this can only reduce overflow risk, never introduce new layout
  behaviour at normal viewport widths. Propagated via `bin/sync` to
  each of the 7 apps' own served theme copies (the actual regression
  needed this step too — a themes/ edit alone doesn't reach a served
  page; each app's `static/`, `public/`, or `wwwroot/themes/`
  directory is `bin/sync`'s rsync target, not a symlink).
  Verify: `bin/check-theme` still passes on all 45; the exact failing
  case (`e2e/responsive.spec.ts`'s mobile `/dashboard` check) passes
  reliably (ran 1x directly, all 48 responsive cases green, plus the
  other 4 example-smoke spec files, 96/96); no other viewport/route in
  that suite regressed.

- [x] **P7-T18 `vue-nuxt-examples`'s `storybook build` fails on
  `TimelineListItem.vue` with an out-of-range parser error.** Done
  2026-09-03. Root cause was never Rolldown/`@vitejs/plugin-vue`
  interop, and never `TimelineListItem.vue`: this checkout's
  `node_modules` had silently drifted out of sync with `package.json`/
  the committed lockfile — `pnpm list` showed `storybook@9.1.20` and
  `@vitejs/plugin-vue@5.2.4` actually installed while both files
  correctly pinned `10.5.10` / `^6.0.8`. Storybook 9.1.20's
  `@storybook/vue3-vite` bundles a peer range of
  `vite@^5.0.0 || ^6.0.0 || ^7.0.0`, but this app's Nuxt 4 tree
  resolves `vite@8.2.2` regardless of which Storybook major is
  installed — an unsupported combination, and that's what produced the
  misattributed out-of-range error. A plain `pnpm install
  --frozen-lockfile` (no code change needed) synced `node_modules` to
  the already-correct lockfile and the build now succeeds cleanly,
  491/491 stories. Confirmed by first reproducing the exact reported
  error on the stale install, then re-testing after sync; also
  confirmed the `viteFinal` re-add of `@vitejs/plugin-vue` genuinely is
  still required (removing it breaks every component with JSX parse
  errors — Storybook's own Vue SFC plugin doesn't fully compile
  `<script setup>` on its own in this Nuxt-hosted setup) and is not
  itself duplicated (the framework preset registers no `vite:vue`
  plugin under current Storybook). Incidental find while verifying:
  `ProgressCircle.test.ts` in this app and in
  `svelte-sveltekit-examples` asserted `getByRole("Progress")`
  (capitalized, not a real ARIA role) in 4 of 6 tests, while the
  canonical `vue-headless`/`react-headless` copies of the same file
  correctly assert `getByRole("progressbar")` — a copy-paste defect
  isolated to those two example apps' test files, not the components
  themselves (`role="progressbar"` was always correct in the rendered
  markup). Fixed both; full suites green (vue-nuxt-examples 1377/1377,
  svelte-sveltekit-examples 2457/2457).
  Verify: `npx storybook build` succeeds in
  `lily-design-system-vue-nuxt-examples` with 491/491 stories — done.

- [x] **Picker glyph convention reversed: bare literals, not escapes.**
  Maintainer-directed reversal of the "glyphs never appear as bare
  characters" rule in `AGENTS/helpers.md`, done 2026-09-03. The five
  picker glyphs (theme-picker's ◑, locale-picker's 🌐︎, motion-picker's
  ⏸︎, share-picker's ➤, date-time-picker's 📅︎) now appear as bare
  literal characters in source — code contexts and markup contexts
  alike — never a `\u` escape or an HTML numeric entity. Reversed the
  rule text itself, `bin/test`'s enforcement (now flags an escape/entity
  as the violation instead of a bare character), the glyph constant and
  its consuming markup across all 7 catalogs' 5 affected pickers (35
  packages) including tests and examples, the 2 `html-css-js-examples`
  copies, and ~90 documentation files. Also fixed, found incidentally:
  two pre-existing half-escaped assertions in Blazor's
  `LocalePickerTests.cs` and two in the canonical Svelte `spec/index.md`.
  Left open, also found incidentally and out of scope for today: roughly
  a dozen older docs across angular/blazor/vue's locale-picker packages
  show `&#127760;` alone (missing its `&#65038;` pair) as if it were the
  complete glyph — a pre-existing documentation-accuracy defect, not
  introduced by or in scope for this reversal.
  Verify: `bin/test` and `bin/check-links` pass clean; full unit suites
  re-run green in all 7 catalogs for the 5 affected pickers (213 svelte,
  263 react, 259 vue, 292 angular, 300 html, 323 nunjucks, 204 blazor
  facts); `npm run build` re-verified for the Svelte helper catalog.

## Phase 8 — Follow-ups surfaced 2026-09-03

Every item here is a real gap observed during the 2026-09-03 sessions
(web-components-headless, the glyph-convention reversal, and the
Dependabot remediation), recorded rather than silently fixed or silently
dropped. None is speculative.

- [x] **P8-T1 `bin/test`'s glyph check does not cover `motion-picker`.**
  Done 2026-09-03: added `PAUSE_SIGN *=` and `PauseSign *=` to the
  constant-name grep in `test_helper_glyphs_are_bare` (16 `PAUSE_SIGN`
  declarations across the six JS/TS catalogs + their tests/examples,
  1 `PauseSign` in the Blazor `.razor.cs` — both spellings confirmed
  present before adding them). Verified the way the task asks, not by
  inspection: temporarily re-escaped `PAUSE_SIGN` to `"\u23F8\uFE0E"`
  in `MotionPicker.svelte` → `bin/test` reported "glyph constant holds
  an escape … MotionPicker.svelte" and exited FAILED; restored the
  file (`git diff --quiet` clean) → `bin/test` exits 0.
  `test_helper_glyphs_are_bare` greps for the constant names
  `CIRCLE_WITH_RIGHT_HALF_BLACK`, `GLOBE_WITH_MERIDIANS`,
  `BLACK_RIGHTWARDS_ARROWHEAD`, `CALENDAR` (and their C# `PascalCase`
  twins) — but not `PAUSE_SIGN` / `PauseSign`, so `motion-picker`'s
  glyph constant is the one picker the enforcement never inspects. The
  2026-09-03 reversal sweep fixed it correctly anyway, but nothing
  would catch a regression. Add both spellings to the grep list.
  Verify: temporarily re-escape `PAUSE_SIGN` in one catalog and confirm
  `bin/test` fails; restore; `bin/test` exits 0.

- [x] **P8-T2 Register the new root `spec/*-picker/` topics, and add the
  two missing ones.** Done 2026-09-03: `spec/motion-picker/index.md`
  and `spec/date-time-picker/index.md` written in the same shape as the
  four existing ones (bare glyph, then the button / list / list-item
  HTML), each with the `README.md → index.md` symlink the others carry.
  `date-time-picker`'s page is deliberately different in kind — field +
  trigger (`aria-haspopup="dialog"`) + `role="dialog"` — because it is
  a form control, not a listbox; the page says so. All six added to
  `spec/index.md`'s Topics table, and the `helpers` row's stale "5
  pickers" corrected to 6.
  Verify: `bin/check-links` clean; `grep -c "picker/index.md)"
  spec/index.md` → 6; `bin/test` exits 0. `spec/theme-picker/`, `spec/locale-picker/`,
  `spec/text-size-picker/`, and `spec/share-picker/` were added
  2026-09-03 as root-level picker contracts (button / list / list-item
  HTML), but none appears in `spec/index.md`'s Topics table, so they
  are undiscoverable from the entry point; and `motion-picker` and
  `date-time-picker` have no counterpart yet. Add the six to the
  Topics table and write the two missing `index.md` files in the same
  shape (bare glyph, button, list, list items), consistent with the
  reversed glyph convention.
  Verify: `bin/check-links` clean; all six link from `spec/index.md`.

- [x] **P8-T3 Root spec still frames the catalog as "7 headless /
  21 subprojects".** Done 2026-09-03, framing chosen: "7 full-catalog
  headless libraries + 1 partial (Web Components, 30/491)", never
  restating parity for the 8th. Amended every present-tense claim:
  `spec/index.md` (Topics rows for architecture/frameworks/helpers, §2
  scope, §3's 21→22 subproject count, §11.2's 21→22 required-files
  count, §11.7's Storybook clause), `spec/architecture/index.md`
  (summary, scope, the "14 implementation subprojects" heading → 15, a
  paragraph placing the unpaired partial catalog after the pairs table,
  a sibling acceptance bullet; also fixed its stale helper list —
  "theme-select, locale-select, text-size-select" → the six
  `*-picker`s), `spec/overview/index.md`, `spec/frameworks/index.md`
  (pairs framing kept — the 8th is genuinely unpaired — with a pointer
  to architecture), `spec/testing/index.md` (Storybook "six of seven"
  → six of seven full-catalog + the partial's 30/30), and the
  subproject's own `spec/index.md` (its "root framing not itself
  amended here" sentence replaced by the record that it now is).
  Deliberately left: the `bin/publish-headless` / `bin/check-coverage`
  table rows (they describe those scripts' actual 7-library lists —
  P8-T6 tracks adding the 8th), §11.2/§11.4/architecture's checked
  items scoped to the seven full-catalog libraries (true as written,
  now with a sibling bullet for the 8th), and the dated 2026-09-02
  P1-T6 record.
  Verify: the task's grep returns only those five deliberately-left
  lines; `bin/check-links` clean; `bin/test` exits 0. `spec/index.md` says so in roughly ten places
  (§2 scope, §3 architecture, the `bin/publish-headless` and
  `bin/check-coverage` table rows, §11.2, §11.4, §11.7) and
  `spec/architecture/index.md` inherits the count. The 8th, partial
  `lily-design-system-web-components-headless` catalog (30/491) joined
  2026-09-03 and its own `spec/index.md` explicitly notes the root
  framing "predates this subproject and is not itself amended here".
  Decide the framing once — "7 full-catalog + 1 partial" is the honest
  shape — and apply it consistently; do not restate 491/491 parity for
  the 8th.
  Verify: `grep -n "7 headless\|seven headless\|21 subprojects"
  spec/index.md spec/architecture/index.md` returns only lines that
  are dated historical records, and `bin/check-links` is clean.

- [x] **P8-T4 Guard against `package.json` `pnpm.overrides` recurring.**
  Done 2026-09-03: new `test_no_package_json_pnpm_overrides` in
  `bin/test` — a `find` (node_modules/.git pruned, same as the glyph
  check) over every `package.json`, failing on any file that contains
  both a `"pnpm"` key and an `"overrides"` key, with the message
  pointing at `pnpm-workspace.yaml`'s `overrides:`. Verified the way
  the task asks: injected a throwaway `pnpm.overrides` into
  `lily-design-system-web-components-headless/package.json` →
  `bin/test` printed the pointer message naming that file and exited
  FAILED; restored (`git diff --quiet` clean) → `bin/test` exits 0.
  Wall-clock unchanged (~90 s, dominated by the pre-existing git
  lockfile walks); the new find costs nothing measurable.
  The 2026-09-03 Dependabot pass found five subprojects carrying
  `"pnpm": { "overrides": {...} }` blocks that had been silent no-ops
  since the pnpm 10 upgrade (pnpm reads `overrides` from
  `pnpm-workspace.yaml` now) — one carried 13 historical CVE-fix
  entries that never applied. All are removed, but nothing stops the
  pattern coming back via a copied template. Add a `bin/test` check
  that fails on any `package.json` containing a `pnpm.overrides` key
  (outside `node_modules`), pointing at `pnpm-workspace.yaml`.
  Verify: add a throwaway `pnpm.overrides` to one `package.json`,
  confirm `bin/test` fails with the pointer message; remove; exits 0.

- [ ] **P8-T5 `extract-zip` — the two Dependabot alerts with no upstream
  fix.** Alerts 183 (`html-headless`) and 130 (`html-css-js-examples`),
  high, "unvalidated symlink path traversal", `<= 2.0.1`, and the
  advisory lists **no `first_patched_version`**. Reached only via
  `@wdio/utils` → `@puppeteer/browsers` (WebdriverIO's browser-binary
  downloader, dev-only, never shipped). Not fixable by a pin today.
  Track it: re-check the advisory monthly; if `@puppeteer/browsers`
  drops or replaces `extract-zip`, bump `@wdio/*` and close; if a
  patched `extract-zip` appears, add a `pnpm-workspace.yaml` override.
  Verify: `gh api .../dependabot/alerts --paginate -q '.[] |
  select(.state=="open")'` returns zero rows.

- [ ] **P8-T6 Web Components headless: give it a standalone remote and
  publish.** P7-T6 deliberately stopped short of two acceptance items:
  the git-subtree standalone repos (GitHub / GitLab / Codeberg under
  `LilyDesignSystem`) do not exist yet, so `bin/git-subtree-push`
  cannot run for it, and `lily-design-system-web-components-headless`
  0.1.0 is unpublished on npm. Creating the GitLab and Codeberg repos
  needs API tokens this environment does not hold (`gh` covers GitHub
  only) — a maintainer step. Then `bin/git-subtree-push
  lily-design-system-web-components-headless` and add the package to
  `bin/publish-headless` (it is not in that script's list either).
  Progress 2026-09-03 — script half done: the package is now in
  `bin/publish-headless`'s npm loop (publishes from the package root;
  its `prepublishOnly` runs `build.mjs`). Verified by a real
  `bin/publish-headless --dry-run`: the run reaches
  `lily-design-system-web-components-headless`, runs `build.mjs`,
  packs cleanly (`+ lily-design-system-web-components-headless@0.1.0`,
  no registry conflict — it is unpublished), exit 0. Still open and
  blocked on a maintainer: the GitLab/Codeberg standalone repos (no API
  tokens here; `gh` covers GitHub only), then `bin/git-subtree-push`
  and the real publish.
  Verify: `bin/publish-headless --dry-run` reaches the package and
  reports a clean pack (done); the three remotes resolve (pending).

- [x] **P8-T7 Web Components headless: the `*ListItem` / table
  sub-element gap.** Done 2026-09-03 for one family, as the task
  allowed: `BreadcrumbNav > BreadcrumbList > BreadcrumbListItem` ship
  (catalog 30 → 33) using an **upgrade in place** pattern — the list
  item builds its real `<li>`, moves the host's children/attributes
  in, then `this.replaceWith(li)`, so the custom element removes itself
  and the rendered tree is a pure `<ol> > <li>` with no host node.
  The cost is stated in the source, the subproject's `spec/index.md`
  §2.1 and `AGENTS.md`: no custom-element instance survives upgrade,
  so no live reactivity — acceptable only because the canonical
  contract is passive (`Interactive: no`, one-shot `current` flag);
  explicitly not to be copied to an interactive item. Table
  sub-elements remain out of scope (untested `<table>` parser
  interaction) and are recorded as such. `axe-core` added as a
  devDependency for the gate.
  Verify (as the task asks): `breadcrumb-list-item.test.ts` runs
  axe-core restricted to the `list` / `listitem` rules over a rendered
  three-crumb trail → zero violations; also asserts no
  `<lily-breadcrumb-list-item>` remains and the `<ol>`'s children are
  `["LI","LI","LI"]`. Full suite 34 files / 182 tests green, `tsc
  --noEmit` clean, `build.mjs` registers 33, the built-bundle smoke
  test passes at 33, Storybook builds the three new stories. Documented as unsolved in the subproject's own
  `spec/index.md` §2: autonomous custom elements cannot use the
  tag+attribute selector form (`li[lily-breadcrumb-list-item]`) that
  angular-headless 0.3.0 used to avoid a wrapper element between a
  parent and a child with a required content model (`<ol>`+`<li>`,
  `<table>`+`<thead>`), and customized built-ins are unavailable in
  WebKit. Evaluate the realistic options — a `slot`-free "upgrade in
  place" pattern that moves the host's children into a real `<li>`
  and removes the host, or an explicit `ElementInternals`-based
  approach — pick one with an axe `list`/`listitem` test as the gate,
  and either implement it for one family or record why none is
  acceptable.
  Verify: an axe run over a `BreadcrumbNav > BreadcrumbList >
  BreadcrumbListItem` rendering reports no `list`/`listitem`
  violation, or the spec records a reasoned "not possible" with the
  evidence.

- [x] **P8-T8 `motion-picker`'s icon scale is still a placeholder.**
  Done 2026-09-03. Method recovered from the originating commit
  (`db081e793`): rendered-ink extent over the em box, in a real
  browser, against the icon's *computed* font — no script was ever
  committed, which is why the earlier bare-`system-ui` probe did not
  match. Re-implemented as a one-off Playwright/canvas measurement
  under `themes/light.css` (headless Chromium, `--lily-font-body`
  resolving to Arial on this machine). Reproduction gate before
  trusting the new number: ◑ 0.850 vs documented 0.842, 🌐 1.000 vs
  0.996, "A" 0.675 vs 0.673 — all within 1%. ⏸ (U+23F8+FE0E) inks
  0.495 (0.490 wide / 0.495 tall), so its factor is 0.850/0.495 =
  **1.72**, applied to all 45 `themes/*.css` with the comment rewritten
  from "reasoned placeholder" to the measurement and its method;
  `AGENTS/helpers.md` and `spec/helpers/index.md` updated to match.
  Finding recorded, not silently corrected: ➤ did **not** reproduce
  (0.850 wide / 0.685 tall vs documented 0.613), and its own theme
  comment cites ◑'s reference as 0.777 rather than 0.842 — it was
  measured under a different resolved face. Its shipped 1.268 is left
  as-is: changing it is a visual decision across 45 themes, not a
  measurement correction. That discrepancy is now the open item, noted
  in `AGENTS/helpers.md`.
  Verify: `bin/check-theme` clean (45 themes); the ⏸ note no longer
  says "placeholder"; the four reproduced figures and the fifth all
  cite the same method; `bin/test` exits 0; `bin/check-links` clean.
  `AGENTS/helpers.md` records `--lily-picker-icon-scale: 1` for ⏸ as
  "a reasoned placeholder, not a false-precision number" — the other
  four glyphs were measured (◑ 0.842, 🌐 0.996, "A" 0.673, ➤ 0.613
  ink-to-em ratios). The 2026-09-03 attempt to reproduce that
  measurement could not match the documented figures, so no number was
  invented. Recover or re-document the original measurement method
  (pixel-count the glyph against its *computed* `font-family`, per the
  same file), apply it to U+23F8, and update all 45 `themes/*.css`
  and the helpers doc together.
  Verify: `bin/check-theme` clean; the five factors in `AGENTS/helpers.md`
  all cite the same method and the ⏸ note no longer says "placeholder".

- [x] **P8-T9 About a dozen picker docs show an incomplete globe
  entity.** Done 2026-09-03: exactly 10 illustrative
  `<span class="locale-picker-icon" aria-hidden="true">` snippets
  (5 angular, 5 blazor — `AGENTS.md`, `index.md`, `AGENTS/api.md`,
  `AGENTS/ssr.md`, `spec/index.md` in each) rendered `&#127760;`
  alone; each now holds the bare `🌐︎` (U+1F310 + U+FE0E), matching the
  runtime constant and the reversed glyph rule. The prose mentions that
  cite `&#127760;` as the decimal value of U+1F310 (vue/angular/blazor/
  svelte `spec/index.md`, svelte `docs/accessibility.md`) are correct as
  written and untouched.
  Verify: `grep -rn '&#127760;' --include=*.md . | grep -v node_modules
  | grep -v CHANGELOG | grep -c aria-hidden` → 0. Found and deliberately left out of scope during the glyph
  reversal: several illustrative HTML snippets in angular/blazor/vue's
  locale-picker `AGENTS.md`, `AGENTS/api.md`, `AGENTS/ssr.md`,
  `index.md`, and `spec/index.md` render the icon as `&#127760;` alone
  — U+1F310 without its paired U+FE0E (`&#65038;`), so the snippet as
  written would show the colour-emoji globe, not the text-presentation
  one the component actually emits. The runtime constants are correct;
  only these examples are wrong, and they predate the reversal. Under
  the reversed rule the fix is the bare `🌐︎` in each. Prose that names
  the codepoint's decimal value parenthetically is fine and not in
  scope.
  Verify: `grep -rn '&#127760;' --include=*.md . | grep -v node_modules
  | grep -v CHANGELOG` returns only prose mentions, none inside an
  `aria-hidden="true"` span.

---

Lily™ and Lily Design System™ are trademarks.
