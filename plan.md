# Lily Design System™ — Improvement Plan

Plan for major improvements across capabilities, functionality, release
engineering, accessibility assurance, documentation, and examples.
Companion checklist: [tasks.md](tasks.md).

> **Relationship to `spec/`**: the living specification remains
> [spec/index.md](spec/index.md); this file is a bounded improvement
> initiative to be executed by an AI coding agent in phased work
> sessions. As work lands, fold outcomes back into `spec/index.md`
> §11–§14 and `CHANGELOG.md`. This revision (2026-08-26) supersedes the
> 2026-07-11 plan: completed work is recorded in
> [spec/history](spec/history/index.md#improvement-plan-phases-completed-moved-from-planmd-on-2026-10-30), still-open
> items are carried forward, and new phases are grounded in fresh research of
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

## Current state (verified 2026-10-25)

Facts below were read from the tree, the registries or a command run on 2026-10-25, except the grid-like helper feature levels and the label-pack paragraph, which are as of 2026-10-18 and _not re-verified_.
Earlier snapshots are kept in `CHANGELOG.md` and `spec/history/`.

- **Catalog**: **581 rows** in `components.tsv`. All 8 headless libraries implement every row except Web
  Components, which implements 546 (the 35 table sub-elements and interactive `*ListItem` families are permanently
  excluded). `bin/check-coverage` reports no drift.
- **Subprojects**: 213 top-level directories — 184 implementation subprojects (9 headless including Alpine.js, 8 example
  apps, 167 helper packages, one each since 2026-10-10), 27 Claude Skills, 9 `locale-translations` packages,
  `lily-design-system-themes` and the docs site. `bin/check-links` is clean (15,180 markdown files) and runs in `bin/test` (2026-10-25: the site's `.md` twins now carry absolute URLs, and generator fixtures are skipped).
- **Helper packages** (167): in every framework, the eleven `*-picker`s (the time-zone picker joined 2026-10-24), `picker-bar`, `data-grid`, `kanban-board`,
  `gantt-chart`, `calendar` and `filter` (Nunjucks also has `listbox-behavior`). The grid-like helpers are at the
  same feature level in all eight catalogs for what carries a label: typed fields, inline editing with undo/redo,
  export and copy, search, the Gantt `criticalLabel` and kanban title editing. **Svelte-only for now**: the optional
  Gantt critical-path calculation (`shared/critical-path.ts`, calendar or working-day lag), the kanban
  `allowLaneChange`, the lane argument to `canMove`, `showSearchLabel` and `fieldLayout`, the calendar `periodTitle`
  anchor argument, and the data grid's footer totals over filtered rows, `--data-grid-pinned-offset` and
  remembered column order.
- **Label packs** (2026-10-18): 64 per-locale `labels` packs in `shared/label-packs/`, loaders for every
  catalog, and `bin/check-label-packs`. **63 are unreviewed machine drafts**, Welsh included. Not yet a published
  package. Contract: `spec/label-packs/`.
- **Published** (registry state read 2026-10-18): headless npm `svelte`/`react`/`vue`/`nunjucks` 0.5.0,
  `angular` 0.6.0, `web-components` 0.6.0, `html` 0.7.0; NuGet `LilyDesignSystem.Blazor.Headless` 0.5.0;
  `@lilydesignsystem/themes` 0.5.0. Every helper package version in the tree is on its registry
  (`bin/verify-published`). **Unreleased in the tree**, committed but not versioned or published: the Svelte
  widgets' peer dependency on `svelte-headless`, `criticalLabel`, `periodTitle`'s anchor argument, the data grid
  and kanban additions, the title-edit and `criticalLabel` ports, and the label-pack loaders.
- **Releases**: monorepo tags `v0.2.0`–`v0.9.0` exist (latest `v0.9.0`). _Not re-verified_: the GitHub Releases
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
4. **Report contrast, don't repair it.** Its theme tooling is to validate final contrast pairs and _report_ failures
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

## Research findings (2026-10-21): capabilities and code quality

An audit of the tree as it stands on 2026-10-21 (commit `c25bfe528`). Every number below was measured that day by a
command run against the working tree; nothing is carried over from earlier sections.

### What is strong

- **Breadth and parity are real.** 581 catalog rows; nine headless libraries (Alpine.js joined 2026-10-21, Web
  Components at 546); 167 helper packages; `bin/check-coverage` and `bin/check-class-names` keep the catalogs in step.
- **Contracts are machine-checked.** `bin/test` exits 0 and gates required files, links, class names, shared-module
  drift, example-component drift, label packs, helper docs and theme conformance. Few design systems check this much.
- **The grid-like helpers are tested in depth** where it matters most: the Svelte, React, Vue and Angular data grids
  each carry ~2,650 lines of tests against ~3,300 lines of source; pure logic lives in `shared/` with its own tests.
- **Low debt markers.** 108 `TODO`/`FIXME` and 62 files with a type or lint suppression across ~190 subprojects.

### What needs work

1. **No lint, no formatter, no typecheck in CI.** None of the nine headless libraries has an ESLint or Prettier
   config. `svelte-check` exists only as a `check` script in the 16 Svelte helpers and the SvelteKit app — not in
   `svelte-headless`, and `ci.yml` never runs it. `tsc --noEmit` on `react-headless` reports **405 errors** (389 in
   `*.stories.tsx`: stories without `args`; 16 in tests: missing required props, `unknown` as `ReactNode`); the
   components themselves type-check clean. Types are what consumers rely on, and nothing guards them. → P12-T1, P12-T2, P12-T3.
2. **Keyboard behaviour is missing in Angular and HTML, and test depth is uneven.** Mean test cases per component file:
   Web Components 6.0, Nunjucks 6.1, React 5.8, Vue 5.7, Svelte 5.4 — but Angular 2.7, HTML 2.7, Alpine 2.3. Digging
   in (2026-10-21) showed the cause is not only thin tests: of 162 components with a documented keyboard contract, 23
   handle keys in Svelte's source and **none** do in Angular's (`Dialog`, `Menu`, `TabBar` are bare wrappers) or in the
   HTML library's component files, while the HTML `index.md` claims "full keyboard support for all interactive
   components". A keyboard-test heuristic that only counts tests (159 of 162 "missing" in Angular) overstates the gap,
   since many contracts are native (`button`); the behaviour gap is the real one. → P12-T4, P12-T4a, P12-T5.
3. **`bin/test` takes 5 m 42 s** (25 s user, 215 s system — filesystem-bound), against a ~63 s baseline and a <20 s
   target set in Phase 7. A five-minute local gate gets skipped. → P12-T7.
4. **CI installs are not reproducible.** Every `pnpm install` in `ci.yml` (six sites) uses `--no-frozen-lockfile`, so a
   CI run can resolve different versions from the committed lockfiles and pass on code nobody pinned. → P12-T6.
5. **Dependency drift across 141 independent lockfiles.** No root workspace; ~24 GB of `node_modules` across
   subprojects. Ranges in use: `vitest` ^4.0.0 / ^4.1.11 (15 packages) vs ^5.0.x (122); `typescript` ^5.9.3 (90) vs
   ^6.0.3 (43); `svelte` ^5.0.0 (17) vs ^5.57.x (18). Every bump is 141 separate edits and 141 installs. → P12-T8.
6. **HTML and Web Components helpers are hand-kept duplicates.** `data-grid.ts` differs by 4 lines out of 2,066; the
   kanban, Gantt and data-grid element files by 0 of 581; `calendar` by 10 of 1,797. `AGENTS/helpers.md` says the two
   "must be kept in step deliberately, since nothing ports between them automatically". That is the same drift
   problem `bin/sync-shared-modules` solved for `shared/`; generate one from the other with the tag prefix as the only
   parameter. → P12-T9.
7. **Shared modules ship as copies.** `search-text.ts` exists in 39 packages, `export-data.ts` in 29, `edit-history.ts`
   in 28. The drift check makes this safe; it does not make a bug fix one release. The `@lilydesignsystem/core`
   package from `spec/headless-improvements` Tier 2.2 is the durable fix. → P12-T10 (maintainer decision).
8. **Monolithic helper components.** `DataGrid.svelte` 1,843 lines, `KanbanBoard.svelte` 1,496, `GanttChart.svelte`
   1,304, `CalendarView.svelte` 1,179 — each port mirrors the size. Logic that is not rendering (sorting, filtering,
   selection, column state, windowing) can move to tested pure modules in `shared/` the way grid navigation did,
   shrinking every port at once. → P12-T11.
9. **Picker attributes have no default styling in the themes.** `text-size-picker` sets `data-text-size` and
   `motion-picker` sets `data-motion`, but none of the 57 `themes/*.css` reacts to either; only the docs site's own
   `style.css` maps text size. A consumer who installs a picker and a theme sees a picker that does nothing. Also:
   2 of 57 themes handle `forced-colors`, none `prefers-contrast`. → P12-T12, P12-T13.
10. **Stale counts and maps.** `spec/index.md` still says "491-component catalog" in its topic table and §2, and
    "150 implementation subprojects / 133 helper packages" in §3; this plan's "Current state" says 172 subprojects
    and omits Alpine entirely. Actual: 187 subprojects = 9 headless + 8 example apps + 133 helpers + 27 skills +
    9 locale-translations + themes. → P12-T14.
11. **Root clutter.** Five one-off scripts at the root (`generate-component-demos.js`, `generate-component-docs.js`,
    `upgrade-component-docs.js`, `upgrade-html-component-demos.js`, `upgrade-subproject-docs.js`), last touched
    April–September 2026; only the first is referenced (by `bin/generate-registries`). → P12-T15.
12. **Lessons backlog is not in `tasks.md`.** The bootstrap (10 items), daisyUI (11), ShardsUI (4) and coss (items 1,
    4, 5, 6 still open) topics each list planned work that has no task ID, so it cannot be scheduled or closed. → P12-T16.
13. **`bin/check-links` failed (26 broken links, later 86; fixed 2026-10-25 and now run by `bin/test`)** in the `/components/{slug}.md` copies added by `c25bfe528`;
    `bin/test` still passed because it does not run `bin/check-links`, contrary to "Current state" above. → P12-T17.

### Advice, in priority order

1. **Guard what consumers touch first**: typecheck and lint in CI (P12-T1–T3) and frozen lockfiles (P12-T6). Cheap, and both
   stop silent regressions in published packages.
2. **Close the keyboard-behaviour gap** in Angular and HTML for the 23 components Svelte implements, or correct the
   claim (P12-T4/T4a/T5). This is the accessibility claim; it should be the best-tested thing in the repo.
3. **Make `bin/test` fast again** (P12-T7) so the gate is actually run.
4. **Stop hand-copying**: generate the Web Components helpers from the HTML ones (P12-T9), then decide on a root pnpm
   workspace (P12-T8) and the core package (P12-T10). These cut future maintenance cost the most.
5. **Close the capability gaps users would notice**: themes that honour `data-text-size` / `data-motion` and
   forced-colors (P12-T12/T13).
6. Defer new components until 1–3 land; the catalog is broad, the guarantees behind it are the weaker half.

## Phase 12 — Code quality and capability gaps (2026-10-21)

Goal: make the guarantees as strong as the breadth. Tasks P12-T1 to P12-T17 in [tasks.md](tasks.md).

1. **Static checks in CI**: lint + typecheck for every TypeScript catalog and helper; fix the React story/test types.
2. **Behaviour tests**: keyboard and ARIA-state tests for interactive components in Angular, HTML and Alpine.
3. **Fast, reproducible verification**: `bin/test` under a minute; frozen lockfiles in CI; one dependency policy.
4. **Less duplication**: Web Components helpers generated from HTML; pure helper logic moved into `shared/`; decide
   the workspace and core-package questions.
5. **Theme capability**: default `data-text-size`, `data-motion` and forced-colors handling in all 57 themes.
6. **Truth**: restamp counts in `spec/index.md` and this plan; tidy root scripts; turn the lessons topics into tasks;
   fix the broken generated links.

## Phase 13 — chanhdai.com and sv-chanhdai lessons (2026-10-22)

Goal: adopt the packaging and contract ideas from two reviewed repositories without importing their styling or effects.
Tasks P13-T1 to P13-T16 in [tasks.md](tasks.md); detail and sources in
[spec/chanhdai-lessons](spec/chanhdai-lessons/index.md).

1. **Repo and tooling hygiene**: a generated-files table, `--dry-run` scaffolders, golden tests for the generators,
   a port-parity check (P13-T1, T4, T5, T7).
2. **AI-readable surface**: `.md` twins of every page and one per-component URL convention (P13-T2, T3).
3. **Contracts**: reduced-motion sections, the async-button pending contract, the APG carousel and slider tightening
   (P13-T6, T9, T14, T15).
4. **Recipes, no endpoints**: open-in-assistant links and package-manager tabs (P13-T8, T10).
5. **New components**: `wheel-picker` and `middle-truncation`; decisions on `item`, `frame`, `highlight`, `annotation`
   (P13-T11, T12, T13).
6. **Decisions**: record the declines (`slide-to-unlock`, `apple-hello-effect`) and the open questions (P13-T16).

Sequencing: P13-T3 and P13-T16 need a maintainer decision before code. P13-T14 and P13-T15 start by reading the Svelte
source, because they were scoped from the docs. The new components follow the existing rule: Svelte first, then the
other seven libraries. These are lower priority than Phase 12's guards (the plan's own advice: defer new components until
the static checks and keyboard-test work land).

## Research findings (2026-10-29): competitive position

A review of the seven rows in COMPARE.md §"Where the alternatives are stronger". Each row was checked against what the
named competitors ship in October 2026 and against the tree on 2026-10-29. Detail, sources and the full per-row table:
[spec/competitive-position](spec/competitive-position/index.md).

### Assessment

**The seven rows share one root cause: competitors win on evidence, and Lily wins on breadth.** Base UI (1.0 in
December 2025), Ark UI and React Aria are trusted because their behaviour has years of exercise and because they
publish how they test it. React Aria names its screen-reader and browser matrix. Carbon and USWDS publish conformance
material. shadcn made copying a tool. Lily has 582 components × 8 frameworks, so every unit of proof costs it more than
it costs them. Adding breadth widens the gap. Making proof cheaper and concentrating it closes the gap.

What the research found, in brief:

1. **COMPARE.md is partly out of date.**
   - Ark UI now ships Svelte, so it covers React, Solid, Vue and Svelte through one Zag.js state machine per component.
   - "Nothing else spans this range" holds only because Web Awesome, whose custom elements run in every framework, is
     not in the matrix.
   - Radix and React Aria are recommended in the prose but have no matrix column, and Base UI is absent.
2. **Behaviour is ported by hand eight times.** Angular reached the 23 keyboard components on 2026-10-22, and RFC 3
   records shipped defects in exactly that code. `shared/` holds navigation helpers but no popup or composite state
   machines.
3. **The platform has caught up, and Lily barely uses it.**
   - Popover API is Baseline 2025, anchor positioning Baseline 2026, and command invokers were in Interop 2025.
   - In Svelte, 14 components use `popover` and none uses `commandfor`.
   - Native primitives are behaviour the browser vendors already test.
4. **The copy path can use shadcn's tooling as it stands.** shadcn CLI 3 installs from any namespaced registry. Lily's
   `/r/{slug}.json` uses its own schema, so `npx shadcn add` cannot read it.
5. **The tokens are almost standard.** `color` and `dimension` follow DTCG 2025.10. The 114 `fluidDimension` tokens use
   a type the spec does not define, so strict parsers reject them. There is no Resolver document.
6. **Proof Lily could have today is missing.** All 20 rows of the screen-reader matrix are empty, there is no ACR, and
   151 of 582 components are `stable`.
7. **Support is undefined rather than absent.** There is no published support or deprecation policy and no second
   publisher.

### Advice, in priority order

1. **Fix what COMPARE.md says** (P16-T1) and **fill the screen-reader matrix** (P16-T9). Both are cheap, and they are
   the evidence everything else cites.
2. **Use the platform and the standard** (P16-T4 native primitives, P16-T6 strict DTCG). These are mechanical changes,
   and each one lowers future proof cost.
3. **Concentrate proof on a named Core tier** (P16-T2), and **write the behaviour once** (P16-T3, which is how P12-T10
   would be delivered). Claims outside Core say "beta", which answers RFC 1 without cutting the catalog.
4. **Adopt shadcn's registry schema** rather than building `lily add` (P16-T5, which resolves P10-T6).
5. **After Core exists**: a self-assessed ACR (P16-T7) and a funded external audit (P16-T8).
6. **At any time**: a support policy and a second publisher (P16-T10), and public-sector reference versions (P16-T11).

Not adopted: a Figma component library (P5-T5 stands), Zag.js as a dependency (it has no Angular, Blazor, Nunjucks or
Alpine adapter), shadow DOM, and a default visual design.

## Phase 16 — Competitive position (2026-10-29)

Goal: make Lily's claims as strong as its competitors' by making proof cheaper and concentrating it, without adding
breadth. Tasks P16-T1 to P16-T11 in [tasks.md](tasks.md); rationale in
[spec/competitive-position](spec/competitive-position/index.md).

1. **Truth**: COMPARE.md corrected and the matrix widened (T1).
2. **Evidence**: the screen-reader matrix filled (T9), and a Core tier with a generated quality page (T2).
3. **Cheaper proof**: one behaviour core with thin adapters (T3), and native primitives first (T4).
4. **Standards, not rivals**: a shadcn-compatible registry (T5), and strict DTCG 2025.10 with a Resolver document (T6).
5. **Assurance**: a self-assessed ACR (T7) and an audit funding application (T8).
6. **Sustainability**: a support policy and a second publisher (T10), and public-sector reference versions (T11).

Status 2026-10-29:

- **Done:** T1, T2, T6, T7 and T11. Core has 0 of 40 candidates, because the evidence does not exist yet.
- **Partly done:** T3 (the listbox machine, Svelte and React only), T4 (the audit, plus a `<select>` prototype in Svelte
  only), T5 (React only; its CI job has not yet run on GitHub) and T10 (no second publisher yet).
- **Open:** T8 and T9.
  - T8: the NGI Zero Commons Fund closed, and NLnet's 2026-10 AI policy bars AI-written proposals.
  - T9: needs a human screen-reader session.
- **New findings to schedule:**
  - five components claim `aria-modal` without trapping focus;
  - no component uses the Popover API;
  - the NHS England and NHS Scotland themes reference nhsuk-frontend 9.x, against 10.7.1 current;
  - every Playwright config runs Chromium only.

## Phase 20 — Investigate a SolidJS port (2026-10-30)

Goal: decide, with evidence, whether Lily gains a SolidJS family as a peer of Svelte, React, Vue, Angular, Blazor,
Nunjucks, HTML, Web Components and Alpine: a headless library, the helper packages and an example app. Investigation
only; no port starts before the decision. Task P20-T1 in [tasks.md](tasks.md).

1. **Fit**: Solid's JSX and fine-grained signals against Lily's contracts: rest-props (`splitProps`, never destructured
   props), class hooks (`class`, not `className`), bindable open state, SSR with SolidStart, the Popover API and
   `showModal()` paths, and whether the shared modules (`shared/listbox-machine.ts`, grid navigation) drop in unchanged.
2. **Cost**: a spike porting a sample (one container, one form control, `Listbox`, `Dialog`, `DataTable` parts, one
   picker) from the React headless library, measuring how mechanical the translation is; tests with
   `@solidjs/testing-library` and Vitest; Storybook and docs-site support; the recurring cost of a tenth framework in
   `bin/check-coverage`, `bin/check-class-names`, `bin/check-port-parity`, publishing, skills and the label-pack loaders.
3. **Alternatives**: Solid renders custom elements well, so the Web Components catalog may already serve Solid users;
   measure what they lose (typed props, SSR, events) before choosing a full port.
4. **Decision**: port (all 583 components, the 20 helpers, a SolidStart example app), a partial port, or decline
   with Web Components as the documented route, recorded in `spec/frameworks`.

## Phase 21 — Visual identity principles (2026-11-01)

Goal: give Lily a written visual-identity policy and the small mechanisms that let an adopter apply their own identity
without forking a theme or giving up accessible contrast. Research, assessment and advice:
[spec/visual-identity](spec/visual-identity/index.md). Tasks P21-T1 to P21-T8 in [tasks.md](tasks.md).

Advice, in priority order:

1. **Write the policy first** (T1): cheap, and it fixes what every later item may and may not do.
2. **Split brand colour from content colour** (T3), then the **brand overlay** (T2): together they are the main adopter
   value, and the overlay needs the split to check contrast.
3. **Logo slot composition** (T4) and **font licence audit** (T5): documentation and a column; no new component.
4. **Icon contract** (T6), **`theme-color`** (T7), **identity change log** (T8): small and independent.

Not adopted: a logo or guideline generator, bundled marks, imagery rules in the headless layer, motion identity, one
clear-space number.

## Sequencing and dependencies

Finished phases (1 to 7 and 18), their sequencing notes and the original definition of done are in
[spec/history](spec/history/index.md#improvement-plan-phases-completed-moved-from-planmd-on-2026-10-30).

- Phase 13 is unscheduled and lower priority than Phase 12; see its own sequencing note.
- Phase 16 has no hard dependency on Phase 12 except T3, which needs the P12-T10 decision.
  - Do T1 and T9 first.
  - T7 needs T2, and T2 needs T9.
  - T5 resolves P10-T6.
  - T4's `<select>` prototype is the evidence RFC 3 asks for.
- Phase 20 is an investigation with no dependency; the spike reuses the React headless library as its source and
  should follow the P12-T10 shared-core decision if that lands first.
- Phase 21: T1 first; T3 before T2 and T7 (both read `--lily-brand`); T2 should reuse the theme generator format from
  `spec/daisyui-lessons` item 3 rather than invent a second one; T4 to T6 and T8 are independent.
- Phase 12: static checks and frozen lockfiles first (they protect everything after), then behaviour tests, then
  the duplication work; P12-T8 and P12-T10 need a maintainer decision before any code.

## Definition of done

- Each open phase is done when every one of its tasks in [tasks.md](tasks.md) is checked and its Verify line passes.
- `bin/test` and `bin/check-links` pass.
- Outcomes are folded back into `spec/` (the topic the phase changes), `CHANGELOG.md`, and `NEWS.md` where users see
  them; a finished phase moves to [spec/history](spec/history/index.md#improvement-plan-phases-completed-moved-from-planmd-on-2026-10-30).

## Phase 22 — Lessons topics triaged into tasks (2026-11-02)

The 29 untasked items in the Bootstrap, daisyUI, ShardsUI and coss ui lessons topics, each now a task in [tasks.md](tasks.md#phase-22--lessons-topics-triaged-into-tasks-2026-11-02). Order: P22-T20 now (no AA failures remain); P22-T13 is the keystone, since P22-T14, T15 and the mode axis wait on it; P22-T3 before T4; P22-T27 before T11; P22-T18 before T19. Six are maintainer decisions (T3, T13, T16, T18, T24, T28).

---

Lily™ and Lily Design System™ are trademarks.
