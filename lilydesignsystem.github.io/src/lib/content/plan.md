# Lily Design System™ — Improvement Plan

Plan for major improvements across capabilities, functionality, release
engineering, accessibility assurance, documentation, and examples.
Companion checklist: [tasks.md](tasks.md).

> **Relationship to `spec/`**: the living specification remains
> [spec/index.md](spec/index.md); this file is a bounded improvement
> initiative to be executed by an AI coding agent in phased work
> sessions. As work lands, fold outcomes back into `spec/index.md`
> §11–§14 and `CHANGELOG.md`. This revision (2026-08-26) supersedes the
> 2026-07-11 plan: completed work is recorded below, still-open items
> are carried forward, and new phases are grounded in fresh research of
> the monorepo and of the GOV.UK, NHS, USWDS, and design-tokens
> ecosystems.

## How to execute this plan

- Work phase by phase; phases are ordered by dependency and value.
- Each task in [tasks.md](tasks.md) has an ID (`P1-T1`), touched paths,
  acceptance criteria, and a verify command. Do not mark a task done
  until its verify command passes.
- Always run `bin/test` before finishing a session; it must exit 0.
  Run `bin/sync-special-files` after editing any root special file.
- Respect the binding rules in `AGENTS/*.md` (headless, accessibility,
  internationalization, theme, helpers, examples). Svelte is the
  canonical reference implementation; port outward from it.
- The helpers are the ten `*-picker` packages (theme, locale,
  text-size, motion, share, search, link, menu, settings, date-time) plus `picker-bar` — the July plan's
  `*-select` names are obsolete and must not reappear.
- Keep commits small and per-task; note completed task IDs in commit
  messages.

## Completed since the 2026-07-11 plan

Recorded so the delta is auditable; details in
[CHANGELOG.md](CHANGELOG.md) and [NEWS.md](NEWS.md).

- **Helpers**: renamed to `*-picker` at full depth; `share-picker` and
  `date-time-picker` added (five helpers × seven catalogs = 35
  packages); two accessibility-hardening sweeps; pointer-close made
  part of the contract; idempotent apply; 1,847 tests across the seven
  catalogs. All 30 JS helper packages published to npm at 0.1.0.
- **Headless publishing (was Phase 3)**: svelte, react, and vue
  headless published at 0.3.0 with real `dist/`, barrel exports,
  types, and `sideEffects: false` — after discovering 0.2.0 was
  unusable (declared a `main` that was never built). Verified by
  installing packed tarballs into scratch consumers.
- **Special files (new work)**: the repo root and all 22 subprojects
  (then published as subtree repositories) now carry the 16-file public-repo set (LICENSE,
  CITATION.cff, NEWS, COMPARISONS, BENCHMARKS, INSTALL, CONTRIBUTING,
  CODEOWNERS, MAINTAINERS, CHANGELOG, AI_STATEMENT, GOVERNANCE,
  SECURITY, CODE_OF_CONDUCT, RFC, README), propagated by
  `bin/sync-special-files` with link rewriting and per-repo generated
  CITATION/INSTALL, gated by `bin/test`. Spec topic:
  [spec/special-files-for-public-repos/](spec/special-files-for-public-repos/index.md).
- **Licensing**: the `CC BY-NC-SA` / MIT / ISC contradiction resolved
  to one SPDX menu (`MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only
  OR BSD-3-Clause`) across `LICENSE.md`, spec §14, all 50 JS manifests
  and 5 `.csproj` files. "WCAG 2.2 AAA compliant" corrected to
  "Targets WCAG 2.2 AAA" in package descriptions. Wrong npm repository
  URLs (react/vue pointed at `github.com/lily`, an unrelated account)
  fixed in-tree; **the live registry copies stay wrong until a patch
  release** (P1).
- **`CONTRIBUTING.md`** exists (time / code / money), plus
  `GOVERNANCE.md`, `SECURITY.md`, `AI_STATEMENT.md`, `RFC.md` (twelve
  open questions), `.github/FUNDING.yml`.
- **Promotion plan**: [help/outreach/index.md](help/outreach/index.md)
  — audiences, channels, readiness gates. Its Gate 1 (license) is
  closed; Gate 2 (publish all frameworks) is this plan's P2.
- **Site**: `lilydesignsystem.github.io` gained per-framework
  tutorials, theming and helpers tutorials, help, why, about,
  comparisons — and a placeholder `lily-figma` route (P5 decides its
  fate).

## Current state (verified 2026-10-18)

Facts below were read from the tree, the registries or a command run on 2026-10-18, except where marked *not re-verified*.
Earlier snapshots are kept in `CHANGELOG.md` and `spec/history/`.

- **Catalog**: **571 rows** in `components.tsv`. All 8 headless libraries implement every row except Web
  Components, which implements 536 (the 35 table sub-elements and interactive `*ListItem` families are permanently
  excluded). `bin/check-coverage` reports no drift.
- **Subprojects**: 172 — 144 implementation subprojects (8 headless, 7 example apps, 129 helper packages, one each
  since 2026-10-10), 26 Claude Skills, `lily-design-system-themes` and the docs site. `bin/check-links` is clean
  (13,655 markdown files).
- **Helper packages** (129): in every framework, the ten `*-picker`s, `picker-bar`, `data-grid`, `kanban-board`,
  `gantt-chart`, `calendar` and `filter` (Nunjucks also has `listbox-behavior`). The grid-like helpers are at the
  same feature level in all eight catalogs for what carries a label: typed fields, inline editing with undo/redo,
  export and copy, search, the Gantt `criticalLabel` and kanban title editing. **Svelte-only for now**: the optional
  Gantt critical-path calculation (`shared/critical-path.ts`, calendar or working-day lag), the kanban
  `allowLaneChange`, the lane argument to `canMove`, `showSearchLabel` and `fieldLayout`, the calendar `periodTitle`
  anchor argument, and the data grid's footer totals over filtered rows, `--data-grid-pinned-offset` and
  remembered column order.
- **Label packs** (2026-10-18): 46 per-locale `labels` packs in `shared/label-packs/`, loaders for every
  catalog, and `bin/check-label-packs`. **45 are unreviewed machine drafts**, Welsh included. Not yet a published
  package. Contract: `spec/label-packs/`.
- **Published** (registry state read 2026-10-18): headless npm `svelte`/`react`/`vue`/`nunjucks` 0.5.0,
  `angular` 0.6.0, `web-components` 0.6.0, `html` 0.7.0; NuGet `LilyDesignSystem.Blazor.Headless` 0.5.0;
  `@lilydesignsystem/themes` 0.5.0. Every helper package version in the tree is on its registry
  (`bin/verify-published`). **Unreleased in the tree**, committed but not versioned or published: the Svelte
  widgets' peer dependency on `svelte-headless`, `criticalLabel`, `periodTitle`'s anchor argument, the data grid
  and kanban additions, the title-edit and `criticalLabel` ports, and the label-pack loaders.
- **Releases**: monorepo tags `v0.2.0`–`v0.9.0` exist (latest `v0.9.0`). *Not re-verified*: the GitHub Releases
  and which subtree/forge pushes are current.
- **Publishing**: NuGet publishes through OIDC trusted publishing from `publish.yml` (`NUGET_USER` must be the
  policy creator's username). npm publishes from the maintainer's machine (`bin/publish-helpers`): the repository
  has **no `NPM_TOKEN` secret**, so the workflow's npm step fails with `ENEEDAUTH` (2026-10-17). Check a release
  with `bin/verify-published --wait 900`.
- **Themes**: 57 ship (`bin/check-theme` also forbids a filled current-day cell); the docs site mounts
  `picker-bar`; `bin/sync` keeps the site's and the example apps' copies in step.
- **Demonstration pages**: every example app and the docs site render the live demo, rendered variants and a
  real usage example (`bin/generate-examples`, `bin/generate-site-pages`). The site also has a Label packs page.
- **CI**: `.github/workflows/ci.yml` defines jobs `verify`, `helper-packages`, `headless`, `html-headless`,
  `dotnet-tests`, `dotnet-helper-packages`, `example-smoke`, `eleventy-example`, `consumer-smoke` and
  `spell-check` (job list read from the file; run history not re-checked).
- **Docs checks** (in `bin/test`): `bin/check-helper-docs` (Svelte helpers document every prop, list no shipped
  feature as a non-goal), `bin/check-label-packs`, `bin/check-theme`, `bin/check-links`.
- **Open backlog**: the deferred Baby UI ideas (`attachment`, `tool-chips`, the remaining agent, advanced and
  primitive components — tasks P9-T12, each needing a design pass first); native-speaker review of the 45 draft
  label packs; publishing the packs as a package; porting the Svelte-only items above; a patch release for the
  unreleased items; the `engines.node` range for published packages (decided 2026-10-18: `>=26`).
  Security-posture settings, GitHub topics and README screenshots were **not re-verified**.

## Research findings (2026-08)

What the systems Lily learns from are doing, and what it implies here.

1. **GOV.UK Frontend is at v6** (v6.0.0 breaking: new Sass
   architecture, **updated type scale, updated colours**; v6.1.0
   2026-03). **NHS.UK frontend is at a v10.0.0 pre-release** (v9.x
   added task-list and panel components). Lily's GDS and NHS reference
   themes were authored against the earlier visual languages, and
   nothing records which upstream version each theme tracks. →
   *Theme provenance pinning and a refresh pass* (P3).
2. **GOV.UK's professional apparatus** — a public roadmap, a
   "what's new" page, a published accessibility strategy, disciplined
   versioned releases with migration notes, and explicit contribution
   criteria — is the visible difference between a maintained system
   and a repository. Lily now has the repo-side files; the site lacks
   the roadmap/news surfaces and the release discipline lacks tags. →
   P2 (release engineering) and P5 (site surfaces).
3. **Component maturity labels.** GOV.UK/USWDS mark components as
   experimental/stable and say what evidence backs them. Lily's 491
   components are uniformly presented, but their depth varies —
   honest labelling is the cheap, high-trust move that matches this
   project's stated ethos. → P4.
4. **Design tokens standardised.** The DTCG Design Tokens spec
   reached its **first stable version (2025.10)**; Style Dictionary
   v4, Figma Variables, Tokens Studio, Penpot and Sketch support it;
   adoption hit ~84% of surveyed teams in 2026. Lily's `--theme-*`
   flat-token convention predates this. A DTCG-format token source
   that *generates* the custom properties would cost little, make the
   45 themes machine-consumable, and give the placeholder `lily-figma`
   page something real to say. → P3/P5, and RFC.md §RFC 6.
5. **Patterns, not just components.** NHS and GOV.UK ship
   task-oriented *patterns* ("ask users for…", multi-page flows) above
   the component layer. Lily has composition patterns in AGENTS but no
   pattern-level guidance; the flagship scenario route (P6) is the
   first step and should be written up as a pattern doc, not only code.

## Research findings (2026-10-11): bref-ui

[bref-ui](https://github.com/feuersteiner/bref-ui) (MIT, Svelte 5) was read at commit `3333552` (2026-10-11). It is a
small styled library — 17 components (button, checkbox, combobox, dialog, icon, pill, pill-group, pill-choice-group,
popover, progress, select, spinner, surface, switch, text-area, text-input, theme, tree-view) — that ships the same
source two ways: an npm package, and a Bun CLI that copies a component and its dependencies into the consumer's project
(shadcn's source-ownership model). Lily already has a counterpart for every component, so the value is in its
techniques, not its catalog. What it implies here:

1. **Form reset and native validation.** Its combobox mirrors its value into a hidden native `<select>` (so `required`
   and `form.checkValidity()` work natively, and an `invalid` event moves focus to the visible field), and both the
   combobox and the pill choice group restore their initial value on the form's `reset` event — deferred one tick so a
   consumer's `preventDefault()` is honoured. No Lily headless component or helper listens for `reset` today; a
   stateful control (the pickers' hidden inputs, `date-time-picker`, `combobox`, `tag-input`,
   `multi-select-with-extras`, `segment-group`, …) keeps its own state when its form is reset, so what the user sees
   and what the form submits can diverge. → P10-T1.
2. **Native Popover API and CSS anchor positioning.** Its popover uses `popover="auto"` with
   `showPopover({ source })`, which brings top-layer stacking, Escape and outside-click (light) dismissal from the
   browser, and positions with `position-area` / `position-try-fallbacks` / `anchor-size()` instead of script. Lily's
   headless `Popover` renders only while `open` and leaves Escape, outside click and positioning to the consumer. →
   P10-T2 (design pass; browser support must be checked, not assumed).
3. **Touch target size.** It enlarges controls under `@media (pointer: coarse)` (a 2.75rem minimum). None of Lily's 45
   themes has a coarse-pointer rule, though Lily targets WCAG 2.2 AAA, whose 2.5.5 asks for 44×44 CSS px targets. →
   P10-T3.
4. **Report contrast, don't repair it.** Its theme tooling is to validate final contrast pairs and *report* failures
   without silently replacing the author's colours. `bin/check-theme` checks no contrast today; the error-text defect
   closed in P9-T13 was found by an axe sweep, not by the theme check. → P10-T4.
5. **One compact agent entry per component.** Its `/llms.txt` gives every component the same short block — purpose,
   one working example, and all props on one line, required first, with types and defaults — generated from the docs
   pages' own prop data, with a contributor rule that any public API change updates it. Lily's `llms.txt` is a curated
   map; per-component props live only in `components/*/AGENTS.md`. → P10-T5.
6. **Copy-into-project distribution.** Each component carries a `registry.json` (files, exports, dependencies); one
   loader validates ids, file existence and an acyclic dependency graph, and `add` previews `add` / `unchanged` /
   `conflict` files and asks before each overwrite. Lily publishes whole libraries; a copy path would let a team own
   one component's source without forking a catalog. A maintainer decision, not a task yet. → P10-T6.
7. **Choice chips on real inputs.** Its pill choice group is a `radiogroup` of radio inputs (single) or a `group` of
   checkboxes (multiple), each visually a pill and optionally deletable — real form controls under a chip skin. Lily
   has `tag-group`, `segment-group` and `toggle-group`, but no filter-chip group whose items are form inputs. →
   P10-T7 — decided 2026-10-11: no new component; `radio-group` / `checkbox-group` with a chip look, documented as a
   composition pattern.

**Not adopted.** Its English defaults (`"Select…"`, `"Tree view"`, `"No options found"`) — Lily takes every string
from the consumer. The `surface()` paint recipe and `glass` variants — visual decisions that belong in Lily's themes,
not its headless layer. The Material Symbols font dependency — Lily bundles no fonts or icon sets. Select options as
`aria-pressed` buttons rather than a listbox, and a tree view that is a group of buttons rather than a tree — Lily's
existing `select` and `tree-*` semantics are the stronger choice. Its "seekable" progress bar that becomes a range
input — Lily keeps `progress` and `slider` separate.

---

## Phase 1 — Truth, hygiene, and registry cleanup

Goal: every live claim is true — in the spec *and on npm*.

1. **Reconcile catalog counts** (carried): identify the 491st
   component, verify full propagation, fix spec §11.4/§14 and any
   other stale 490s that state present-tense facts (point-in-time
   snapshot labels may stand with their dates).
2. **npm registry hygiene**: `npm deprecate` the three broken 0.2.0
   headless packages with an upgrade message; publish patch releases
   of svelte/react/vue headless so the corrected metadata (SPDX
   license menu, right repository URLs, "targets" wording) is what the
   registry serves.
3. **Angular examples Playwright e2e** (carried).
4. **Analog SSG**: file the drafted upstream issue; prototype the
   `@angular/build:application` prerender fallback (carried).
5. **Svelte dual-mirror specs** for the 80 national identifiers
   (carried).
6. **Fresh verification sweep**: re-run every suite in spec
   §11.4–§11.7; restamp tables (carried).
7. **Repo presentation**: GitHub topics + descriptions on all 23
   repos; two screenshots in the root README (styled example app vs
   the same markup unstyled); confirm/enable the SECURITY.md posture
   table (secret scanning, push protection, private vulnerability
   reporting) and record what is actually on.

## Phase 2 — Release engineering

Goal: every advertised artifact is installable, and releases are real
events with tags, notes, and provenance.

1. **Publish the remaining headless libraries**: html, angular,
   nunjucks to npm; blazor headless to NuGet — same verified-tarball
   discipline as 0.3.0. Push the five built blazor helper `.nupkg`
   files to NuGet.
2. **`bin/publish-headless`** (or extend `bin/publish-helpers`),
   dry-run by default (carried).
3. **Tags and GitHub Releases**: annotated tag per release, release
   notes generated from CHANGELOG sections, applied retroactively to
   0.2.0–0.6.0 where commits are identifiable.
4. **Supply-chain posture**: npm 2FA confirmed, `--provenance` on
   publishes from CI, tag-gated dry-run-default publish workflow
   (carried, extended). Optional: Zenodo DOI wired to CITATION.cff.
5. **Consumer smoke tests in CI**: install each published tarball into
   a scratch project and import/render 3 components — the check that
   would have caught the 0.2.0 breakage (carried).
6. **Versioning & release policy doc** `docs/releasing.md` (carried).

## Phase 3 — Themes live + tokens

Goal: the 45 themes become a user-visible capability with a
standards-based token layer underneath.

1. **Wire `theme-picker` into all 7 example app shells** (SvelteKit
   canonical first), curated list, localStorage persistence, e2e
   coverage (carried; renamed).
2. **Mount `locale-picker` and `text-size-picker`** in the shells too;
   consider `share-picker` on component-detail pages (carried,
   extended to the five-helper reality).
3. **`prefers-color-scheme` first-visit default** for theme-picker
   (opt-in prop; canonical then 6 ports) (carried).
4. **`bin/check-theme` conformance script** (carried).
5. **DTCG token source** (new): `themes/tokens/*.json` in Design
   Tokens 2025.10 format for the core `--theme-*` set; a generator
   emits the custom-property blocks the themes consume; drift between
   generated and committed CSS fails `bin/test`. Update RFC.md §RFC 6
   with the outcome.
6. **Theme provenance + refresh** (new): record the upstream version
   each reference theme tracks (GOV.UK Frontend v6.x, NHS.UK frontend
   v9/v10, USWDS, Spectrum, Protocol); refresh the GDS theme against
   v6's updated type scale and colours; document the deltas.
7. **Dark/high-contrast coverage audit** (carried).

## Phase 4 — Accessibility assurance

Goal: move from "targets WCAG 2.2 AAA" toward *demonstrated* claims,
per-component and per-app.

1. **Full-catalog axe sweep**: all 491 `/components/{slug}` routes in
   the SvelteKit app; fix findings; record the baseline (carried).
2. **Accessibility statement + WCAG mapping** (new): a published doc
   in the GOV.UK accessibility-strategy mould — what is tested by
   what (axe AA rule sets, unit ARIA assertions, keyboard contracts),
   what is not, known gaps, and the audit intention already named in
   CONTRIBUTING.
3. **Component maturity labels** (new): `status` column
   (`experimental` / `beta` / `stable`) in the catalog metadata,
   surfaced in per-component docs and on the site; initial assignment
   rubric documented (test depth, screen-reader evidence, production
   use).
4. **Screen-reader testing matrix** (new): VoiceOver/NVDA/JAWS ×
   representative components; results recorded per component; the
   scarce-input ask in CONTRIBUTING becomes a structured intake.
5. **External audit readiness pack** (new): scope, environments, and
   the component list an auditor would need — so funding, if it
   arrives, converts to an audit without delay.

## Phase 5 — Documentation and site surfaces

Goal: the site carries the living surfaces a maintained system shows.

1. **News/what's-new route** on the site fed from NEWS.md; **roadmap
   route** fed from this plan (GOV.UK pattern; also closes the
   outreach plan's blog-route gate).
2. **Developer on-ramp in CONTRIBUTING**: dev setup, the copy-pattern,
   add-a-component walkthrough across all 14 subprojects + registries
   + CSS hook (the July P4-T1 content the current file lacks).
3. **`bin/generate-api-docs`**: per-component reference pages
   generated from `components/{slug}/AGENTS.md` into the site;
   idempotent; drift fails `bin/test` (carried).
4. **Migration guides**: NHS UK frontend → Lily and GOV.UK Frontend v6
   → Lily slug-mapping tables with gaps noted (carried, version
   -pinned).
5. **`lily-figma` decision** (new): either a community Figma library
   seeded from the P3 DTCG tokens, or replace the placeholder with an
   honest "not planned, here's why + RFC link". No "coming soon" left
   standing.
6. **Tutorials gain runnable end states**: each site tutorial's
   finished code exists in-repo (fixture or example-app route) and is
   verified (carried, reshaped — the tutorials now exist; the runnable
   artifacts do not).
7. **Doc quality gates in CI**: link check already runs; add spell
   check over docs and the site content (carried).

## Phase 6 — Examples deepening

Goal: examples demonstrate the system, not just the components.

1. **Composed-page parity matrix + backfill**, including first
   composed pages for nunjucks-eleventy (carried).
2. **Flagship "book an appointment" scenario** — SvelteKit first, then
   ports; ~30 components; Playwright + axe; written up as Lily's first
   *pattern* doc (carried, extended per research finding 5).
3. **RTL demo route** per app (carried).
4. **`/components` search upgrade**: category + suffix filters
   (carried).

## Phase 7 — Tooling, CI, and stretch

1. **CI completeness** (new): headless unit suites (7), blazor helpers
   (`dotnet test`), one example-app Playwright smoke, and the P2
   consumer smoke — matrixed, cached, and green.
2. **`bin/test` profiling** (new): ~63 s today; find the hot loop
   (per-component file checks are the likely cost), target < 20 s
   without weakening any check.
3. **`bin/new-component` end-to-end generator** (carried).
4. **`bin/check-coverage` drift matrix** (carried).
5. **Visual regression baseline** (stretch, carried).
6. **Web Components headless library** (stretch, carried; also
   RFC-relevant — it would make Lily usable with zero framework).
7. **`motion-picker` helper** (stretch, carried; renamed from
   `motion-select`; follows the five-helper contract).

## Sequencing and dependencies

- Phase 1 first — registry hygiene and true claims before anything is
  amplified; it also closes outreach Gates 2–4 prerequisites.
- Phase 2 before any promotion push (help/outreach Gate 2).
- Phase 3 before Phases 5–6 (site and examples reference the live
  switcher and tokens).
- Phase 4 can interleave with 3; its maturity labels feed Phase 5's
  generated reference pages.
- Phase 7 items 1–2 can land any time and are cheap wins.

## Definition of done (whole plan)

- `bin/test` and `bin/check-links` pass; spec §11 tables restamped.
- All 7 headless libraries + all 35 helpers installable from a
  registry; broken versions deprecated; tags and GitHub Releases
  exist; consumer smoke tests run in CI.
- Theme switching live in all 7 example apps; DTCG token source
  generating the `--theme-*` layer; theme provenance recorded.
- Accessibility statement published; maturity labels on all 491
  components; full-catalog axe baseline recorded.
- Site has news + roadmap routes; api-docs generated from canonical
  metadata; migration guides published; no placeholder pages.
- Flagship scenario live in all 7 apps with its pattern doc.
- Outcomes folded back into `spec/index.md`, `CHANGELOG.md`, NEWS.md,
  and RFC.md where a question is answered.

---

Lily™ and Lily Design System™ are trademarks.
