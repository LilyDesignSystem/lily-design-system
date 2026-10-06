# History — Lily Design System™ release highlights

**Summary.** The dated, per-event record of what changed and why, moved here from
`spec/index.md` §14.1 (2026-10-06) so the entry-point spec stays short enough to load
into AI context. [CHANGELOG.md](../../CHANGELOG.md) is the canonical release record; this
topic keeps the narrative highlights that earlier versions of the spec carried.

## Scope

Covers events up to and including the picker-tooltip, Baby UI triage and chart work of
2026-10. It does **not** restate current facts: counts, versions and contracts here are
true **as of the date given in each entry** and are deliberately not updated when the
catalog grows. For the current state read [spec/index.md](../index.md) and the topic
that owns the area.

## Principles and rules

- Entries are append-only and dated; correct a mistake by adding a dated correction, not
  by rewriting an old entry.
- Current counts and versions live in `spec/index.md` §5 and §14, never here.

## Highlights

- **`angular-headless` stale endonym-rename exports fixed (2026-09-16)** —
  closed the publish blocker the rescope below surfaced: not missing
  components, a stale barrel. Three national-identifier types (Cyprus,
  Ireland, Northern Ireland) had been renamed to their endonym-first
  canonical names elsewhere in the repo — the real component files
  existed under the new names the whole time — but `index.ts` never
  followed, still exporting the old names against files that no
  longer existed while never exporting the real ones. Fixed by
  correcting the 6 exports to match every sibling catalog. Verified:
  `ng-packagr` build clean, 491/491 tests (1011/1011, unchanged),
  `bin/check-coverage` 0/491 drift, `@lilydesignsystem/angular-
  headless@0.1.0` published. Full record: CHANGELOG.md.
- **All npm packages move to the `@lilydesignsystem` scope (2026-09-16)** —
  maintainer-directed rename of all 63 npm packages (56 helpers minus
  Blazor's 7, plus the 7 headless libraries) from unscoped
  `lily-design-system-*` to `@lilydesignsystem/*`; directory names,
  subtree repo names, and forge URLs are unchanged — only the npm
  identity moves. Every renamed package resets to `0.1.0` (scoped
  packages have no publish history under their old name), per the
  July 2026 `*-select` → `*-picker` rename precedent. The rescope's
  repo-wide doc pass was context-aware (bare npm specifiers only,
  never inside a relative path or markdown link href) and surfaced
  three real pre-existing/latent defects along the way: two catalogs'
  build config guessed the wrong ng-packagr output path for a scoped
  entry point (confirmed against a real build and fixed), and
  `react-helpers/build.js` externalized siblings by directory name
  instead of `package.json#name` (would have broken
  `@lilydesignsystem/react-picker-bar`'s build). Also found, **not
  fixed** (pre-existing, unrelated): `angular-headless/index.ts`
  exports 6 national-identifier components with no corresponding
  source file, blocking only that one catalog's own publish. Full
  record: CHANGELOG.md.
- **`theme-picker`/`locale-picker`/`text-size-picker`/`share-picker` published at their SVG-icon + preventScroll versions (2026-09-16)** —
  real npm publish of the two in-tree-but-unreleased changes below:
  the bundled-SVG icon reversal (breaking — the exported glyph
  constant is removed) and the `preventScroll` page-jump fix. Every
  catalog's four affected pickers bump minor
  (html/nunjucks/react/svelte/vue/blazor 0.1.1 → 0.2.0, angular
  0.2.0 → 0.3.0); `motion-picker` and the Web Components catalog ship
  unaffected at their existing first-release 0.1.0, already containing
  both fixes. `svelte-picker-bar` bumps 0.1.0 → 0.1.1 to widen its
  dependency ranges; every other catalog's `picker-bar` stays an
  unpublished 0.1.0 first release, now depending on the bumped
  versions from birth. Verified per `docs/releasing.md`: `bin/test`,
  `bin/check-links`, `bin/publish-helpers --dry-run`, and
  `bin/smoke-packages` all clean before the real npm publish, executed
  under [GOVERNANCE.md](../GOVERNANCE.md) § AI agent publish
  authority. The four Blazor packages' NuGet release is prepared
  (version bumped, changelog written) but not yet pushed — no local
  OIDC context; needs a `publish.yml` dispatch with `real: true`,
  `nuget_only: true`. Full record: CHANGELOG.md.
- **`picker-bar` helper lands in all eight catalogs (2026-09-15)** — a
  seventh `*-picker` helper, maintainer-directed: composes
  `theme-picker`, `locale-picker`, `text-size-picker`, and
  `share-picker` into one page-header row (`motion-picker` has no
  natural spot in the row; `date-time-picker` is a form control, not a
  header control). Two catalog-wide defaults pre-wired and overridable:
  all 45 root `themes/` slugs (alphabetical, the 8 UK/US government
  themes grouped at the bottom) and the seven-step text-size scale
  (`largest` … `smallest`, starting `normal`). Built first as the
  Svelte canonical reference, then ported to react, vue, angular,
  html, nunjucks, web-components, and blazor the same day — each
  wrapped picker depended on as a real package (npm `dependencies`,
  or for Blazor a `ProjectReference` that `dotnet pack` turns into a
  real NuGet dependency), never vendored or duplicated. Angular and
  Blazor diverge from the other six catalogs' spread/`Object.assign`
  prop-bag pass-through pattern (Angular has no generic
  spread-onto-inputs mechanism, so it flattens the wrapped pickers'
  props onto named inputs and exposes three values as `model()`
  signals; Blazor uses `@attributes` splatting) — both documented as
  real, non-cosmetic framework-idiom deviations in their own package
  spec. Porting surfaced one real, generic build-pipeline defect: four
  of the seven JS catalogs' `tsup`-based builds bundle by default
  (unlike Svelte's `svelte-package`, which only copies source), so each
  silently inlined the four wrapped packages' compiled source into
  `picker-bar`'s own `dist/` instead of depending on them at runtime —
  a latent defect any future composed package in those catalogs would
  also have hit. Fixed generically in each catalog's build script
  (derive `--external` flags from the new package's own
  `package.json#dependencies`), verified by confirming each built
  `dist/` still imports its siblings by bare specifier rather than
  containing their compiled source. Verified per catalog against a
  numbered spec with one test per acceptance clause (16 tests in six
  catalogs, 15 in Angular and web-components, matching each catalog's
  own idiom); full-catalog suites green in all eight (332–403 tests
  per catalog depending on framework); root `bin/test` and
  `bin/check-links` clean throughout. Helper package count: 48 → 56
  (8 catalogs × 7 helpers). Full record: CHANGELOG.md;
  [spec/helpers/index.md § picker-bar contract](helpers/index.md).
- **Web Components headless catalog reaches its full achievable scope
  (2026-09-06)** — grew from the 33-component P7-T6/P8-T7 pilot slice to
  456 of 491 in one day, across three waves of parallel-agent batches:
  all 92 national personal identifier components; a 136-component wave
  (lists, forms, pickers, links, and a mixed overlays/tables/media/
  data-viz/buttons batch); and a final 195-component wave (navigation,
  content — the two largest, most heterogeneous categories, including a
  faithful `ThemeProvider` port of the Svelte canonical's token-
  flattening algorithm, real WAI-ARIA widgets for combobox/listbox/menu/
  tree/slider/tooltip, and the Reuters-Graphics-inspired scrollytelling
  family). The remaining 35 (30 table sub-elements, 5 interactive
  `*ListItem` families) are permanently excluded by a real architectural
  limitation — no wrapper-host-safe registration mechanism exists for
  autonomous custom elements, and the one alternative (customized
  built-in elements) is permanently unsupported in Safari/WebKit — not
  backlog. Real, independently-verified findings along the way: a real
  HTML5-parsing constraint that makes the five table-root components
  unpopulatable via static HTML (documented in each component's header
  and in the subproject's own `spec/index.md` §4.2); 14 of 46 national-
  identifier `-view` components missing a documented `role="text"`; and
  3 components that had drifted into unsanctioned inline styles,
  resolved to CSS custom properties rather than growing the two-item
  named-exception list. Verified: `tsc --noEmit` clean, 2669/2669 vitest
  tests, a clean production build and Storybook build, and all root
  `bin/test`/`bin/check-links`/`bin/check-coverage` checks. Full record:
  CHANGELOG.md.
- **National-identifier documentation completed (2026-09-06)** — all 92
  national-identifier component docs were missing a "Where to find it"
  pointer, and 21 of 46 `-input` docs described only the identifier's
  format, not whether/how it's validated. Filled in from the
  already-vetted `AGENTS/national-person-identifiers.tsv` columns; for
  3 identifiers with a real, well-documented check-digit algorithm
  (Spain's NIF/CIF Modulo-23 control letter, France's NIR/INSEE
  Modulo-97 check key, Northern Ireland's H&C Number sharing the UK NHS
  number's Modulus-11 scheme) the actual algorithm was independently
  verified against public sources and added; the remaining 18 got an
  explicit "no published algorithm" statement rather than silence. Full
  record: CHANGELOG.md.
- **Docs site domain rename, lilydesignsystem.github.io → .com
  (2026-09-06)** — every live-site link across the monorepo, the 21
  subprojects, and the 8 Claude Skills that carried one was updated to
  the deployed custom domain (239 files); bare references to the
  literal GitHub Pages repository name (which must stay
  `lilydesignsystem.github.io` — GitHub requires it) were left alone.
  Also fixed `bin/sync-special-files`'s own `DOCS` constant, which
  generates every subproject's `INSTALL.md`/`CITATION.cff` and would
  otherwise have reverted the rename on its next run. Full record:
  CHANGELOG.md.
- **Docs site gains a live theme/text-size/share picker (2026-09-06)** —
  `lilydesignsystem.github.io`'s header now renders
  `@lilydesignsystem/svelte-theme-picker`, `-text-size-picker`, and
  `-share-picker` (real, published npm dependencies) on every page, via
  a new `src/lib/components/SitePreferences.svelte`. The theme picker
  ships with all 45 reference themes copied into `static/assets/themes/`;
  since the component-detail pages' live demos render real Lily class
  hooks, switching themes now visibly reskins those demos too, not just
  the picker itself. Full record: CHANGELOG.md.
- **Web Components helpers catalog (2026-09-03)** — an 8th
  `*-helpers` catalog, `lily-design-system-web-components-helpers`,
  ships the six pickers as `<lily-*-picker>` custom elements. It is a
  maintainer-directed **independent copy** of the HTML helpers catalog
  (which was already six vanilla custom elements), differing only in
  tag prefix and package naming; both catalogs carry a provenance note
  and nothing ports between them automatically. Verified at exactly
  the HTML catalog's test count (6 files / 346 tests) under the new
  tags. Helper packages 42 → 48. The same day closed Phase 8 of
  `tasks.md` (glyph-check coverage, picker spec topics, catalog
  framing, a `pnpm.overrides` guard, the breadcrumb family for the Web
  Components headless, measured icon scales for ⏸ and ➤, half-glyph
  doc fixes); full record: CHANGELOG.md.
- **Picker glyph convention reversed (2026-09-03)** —
  maintainer-directed reversal of the "glyphs never appear as bare
  characters" rule: the five picker glyphs (◑, 🌐︎, ⏸︎, ➤, 📅︎) now
  appear as bare literal characters in source, in both code and markup
  contexts, never a `\u` escape or HTML entity — a bare character is
  easy to type and proofread by eye, where an escape has to be
  mentally decoded. Reversed in `AGENTS/helpers.md` (+ 24 synced
  copies), `bin/test`'s enforcement, all 7 catalogs' 5 affected
  pickers (35 packages) including tests/examples, and ~90
  documentation files. Full unit suites re-run green in all 7
  catalogs (behaviourally unaffected — string equality doesn't care
  which source form produced the value). Full record: CHANGELOG.md.
- **P7-T19 publish scripts' dry-run fixed (2026-09-03)** —
  `bin/publish-helpers --dry-run` / `bin/publish-headless --dry-run`
  had been silently broken since the first real publish (2026-08-26):
  `npm publish --dry-run` still contacts the live registry and refuses
  on any already-published version, and `set -eu` turned that refusal
  into a hard abort before any later, possibly-unpublished package was
  ever reached. Fixed with a `publish_npm_package()` helper in both
  scripts that tolerates that one specific refusal in dry-run mode
  only, propagating every other failure unchanged. Verified for real
  against the live npm registry: both scripts now run to completion
  (exit 0) with a mix of already-published and never-published
  packages in the loop. Full record: CHANGELOG.md.
- **P7-T6 Web Components headless subproject, (2026-09-03)** —
  an 8th headless catalog, `@lilydesignsystem/web-components-headless`,
  ships 30 of the 491 canonical components as native custom elements
  with no framework runtime — a representative slice by explicit
  scope choice, not full parity with the seven full-catalog libraries
  above. Two architecture decisions: autonomous custom elements over
  customized built-ins (WebKit never implemented the latter and has
  said it will not), and light DOM only (no shadow root, so consumer
  CSS reaches every element the same way the other seven catalogs
  allow). Deliberately excluded and documented as a real, unsolved gap:
  every `*ListItem`/table-sub-element family (needs a tag+attribute
  selector only customized built-ins support — the same wrapper-host
  defect class §11.8's angular-headless fix closed) and the 92
  national personal identifier components. A real defect was found and
  fixed via the slice's own tests: `bar-chart.ts` destructured
  `NamedNodeMap` `Attr` nodes as `[key, value]` pairs (not iterable
  that way), fixed by using the existing `passThroughAttributes`
  helper. Verification: 163 tests across 30 files, `tsc --noEmit`
  clean, a non-empty built `dist/`, a dist-level smoke test (165 tests
  total), a clean Storybook build for all 30 stories, and root
  `bin/test` + `bin/check-links` passing with the subproject present.
  Not yet done: subtree push and npm publish. Full record:
  CHANGELOG.md; full architecture rationale: the subproject's own
  `spec/index.md`.
- **P7-T7 motion-picker helper landed in all 7 catalogs (2026-09-03)**
  — a sixth `*-picker` helper (`data-motion`), built as a Svelte
  canonical + 6 idiom ports, following each catalog's own
  text-size-picker shape. Its initial value defers to
  `(prefers-reduced-motion: reduce)` unconditionally, not behind an
  opt-in flag — the one behaviour difference from its three preference
  siblings. Glyph: pause sign (U+23F8 + U+FE0E). Nunjucks has one
  documented deviation (no `matchMedia` at render time, so the macro
  marks `motions[0]` and the client corrects it). The 45 reference
  themes, `bin/check-theme`, and `bin/smoke-packages` were extended to
  match. Verified per-catalog (316 new tests total across 7
  catalogs) and via a real end-to-end `bin/smoke-packages` run. Found
  a real, unrelated pre-existing defect in `bin/publish-helpers
  --dry-run` along the way — see `tasks.md` P7-T19. Full record:
  [CHANGELOG.md](../CHANGELOG.md).
- **P7-T5 visual regression baseline landed (2026-09-03)** — new
  `e2e/visual-regression.spec.ts` in svelte-sveltekit-examples: 30
  slugs across all 11 catalog categories × 3 themes (the app default,
  GOV.UK GDS, and `dark` for light/dark coverage) = 90 screenshots of
  the demo region only. Baseline committed and re-run confirmed
  zero-diff. Full record: [CHANGELOG.md](../CHANGELOG.md).
- **P7-T18 vue-nuxt-examples storybook build fixed (2026-09-03)** — the
  "out-of-range parser error" recorded against `TimelineListItem.vue`
  was neither a Rolldown interop bug nor that file: `node_modules` had
  drifted out of sync with the committed lockfile (a stale
  `storybook@9.1.20`/`@vitejs/plugin-vue@5.2.4` installed against a
  lockfile correctly pinning `10.5.10`/`^6.0.8`), and Storybook 9.1.20's
  `@storybook/vue3-vite` doesn't support the `vite@8.2.2` this app's
  Nuxt 4 tree resolves. `pnpm install --frozen-lockfile` alone fixed
  it — 491/491 stories build clean, no code change needed. Incidental
  find: `ProgressCircle.test.ts` in this app and
  `svelte-sveltekit-examples` asserted a non-existent `"Progress"` ARIA
  role in 4/6 tests versus the canonical `"progressbar"`; fixed both.
  Full record: [CHANGELOG.md](../CHANGELOG.md).
- **NuGet Trusted Publishing adopted, GitHub only (2026-09-02)** — the
  real P2-T2 publish attempt failed on a missing `NUGET_API_KEY`
  secret (never configured, not broken). Adopted OIDC
  [Trusted Publishing](trusted-publishing/index.md) for NuGet instead
  of minting a long-lived key: `publish.yml` gained a `NuGet/login@v1`
  step (real-mode only) exchanging the job's GitHub OIDC token for a
  1-hour nuget.org key. Deliberate exception to "adopt when the whole
  fan-out is covered" — GitHub was already the only forge that could
  publish to NuGet, so nothing was demoted; npm keeps `NPM_TOKEN`
  pending its real Codeberg gap. `MAINTAINERS.md`, `SECURITY.md`,
  `docs/releasing.md`, and the trusted-publishing spec updated in the
  same change. Two steps remain outside this repo: the maintainer
  registering the nuget.org trusted-publisher policy and adding a
  `NUGET_USER` secret. Full record: [CHANGELOG.md](../CHANGELOG.md).
- **AI attribution and publish authority revised (2026-09-02)** —
  two maintainer-directed governance reversals. `AI_STATEMENT.md` §4/§10
  now permit (and CONTRIBUTING.md recommends) a `Co-Authored-By:`
  trailer naming the AI tool on a commit — disclosure, not authorship
  or a sign-off; git's `Author`/`Committer` fields still always name
  the human. And a new [GOVERNANCE.md](../GOVERNANCE.md) § AI agent
  publish authority authorizes an agentic session to decide a specific,
  already-prepared release meets a written readiness checklist and
  execute the real publish, without asking each time — what a release
  *contains* stays the maintainer's alone. Full record: CHANGELOG.md.
- **P7-T11 angular-examples' 491 component specs fixed (2026-09-02)** —
  two prior investigations blamed a triplicated `@angular/core`
  dependency tree for every `setInput()` assertion silently failing;
  that tree had since converged to one copy via ordinary updates, and
  the real cause was a missing `tsconfig.spec.json` (the file
  `@analogjs/vite-plugin-angular` looks for to know which files are in
  its Angular-compiler program) — angular-headless had one,
  angular-examples never did. Added it, widened `vitest.config.ts`,
  added the matching `vitest-setup.ts`; all 492 spec files now pass,
  990/990 tests, no per-component changes needed. Full record:
  CHANGELOG.md.
- **LilyDesignSystem.Blazor.Headless 0.1.1 (2026-09-02)** — fixed a
  real nuget.org "Readme missing" package-validation warning on the
  already-published 0.1.0: the 5 Blazor helper packages already
  embedded their README via the standard `<PackageReadmeFile>` +
  `<None Include>` pair, but the headless package was missed. Added
  it; verified the packed `.nupkg` actually contains the readme
  content and the `.nuspec` references it. Full record: CHANGELOG.md.
- **P7-T12 pnpm version skew resolved (2026-09-02)** — set out to pick
  one pnpm major for the whole monorepo (CI mixed 10 and 11; this
  machine's tooling is 11) and found the version split wasn't the real
  problem: four `pnpm-workspace.yaml` files carried an unfilled
  template placeholder instead of `true` for their `allowBuilds`
  entries, and ten subprojects gitignored that file instead of
  committing it, so the committed repo state had no build-script
  allowlist for them at all under pnpm 11
  (`[ERR_PNPM_IGNORED_BUILDS]`). Fixing both also fully explains and
  corrects the prior day's note blaming this sandbox's network egress
  for html-headless's WebdriverIO suite — the real cause was
  chromedriver's own postinstall script being silently ignored, so it
  was never cached. Removed the now-redundant legacy
  `package.json#pnpm.onlyBuiltDependencies` field from all 13
  subprojects that had it, and moved `ci.yml`/`publish.yml` fully onto
  pnpm 11. Full record: CHANGELOG.md.
- **P1-T6 fresh verification sweep (2026-09-02)** — re-ran every suite
  in §11.4–§11.7 for real (not a restamp) across all 21 subprojects:
  unit (7 headless + 7 helper catalogs), Storybook coverage (file
  presence), and Playwright e2e + axe-core + responsive on all 7
  example apps. Found and fixed three real, previously-undetected
  defects rather than just refreshing dates: (1) seven table/gantt e2e
  spec files (`table-th`, `calendar-table-th`, `data-table-th`,
  `kanban-table-th`, `gantt-table-thead`, `gantt-table-tbody`,
  `gantt-table-tr`) asserted the wrong PascalCase heading name across
  all three JS frontend apps (svelte-sveltekit, react-next, vue-nuxt —
  21 files); (2) a scrollable-but-not-focusable `<pre>` code snippet on
  long-named component-detail pages (axe `scrollable-region-focusable`)
  — see §11.5b; (3) vue-nuxt-examples' locale-picker never restored a
  persisted locale on reload, because its Nuxt `useHead`-driven
  external ref was seeded with a concrete default value instead of
  empty, defeating the picker's own value-over-storage priority chain
  — fixed by seeding it empty, plus a `gotoAndWaitForTheme` hardening
  for a pre-existing, confirmed-flaky dynamically-appended-stylesheet
  race in that app's `accessibility.spec.ts` (same class of bug already
  fixed for Blazor and html-css-js-examples). Total e2e specs 5,852 →
  9,007, all green; angular-headless's own unit count grew 985 → 1,011
  and blazor-headless's 1,502 → 1,509 as a side effect of the §11.8
  attribute-selector migration's added regression tests. html-headless's
  WebdriverIO run could not be re-executed in this sandbox; at the time
  this was recorded as a confirmed chromedriver-download network block,
  but P7-T12 (2026-09-02) found and fixed the real cause — see
  spec/testing/index.md's html-headless row. Full record: CHANGELOG.md.
- **Angular headless wrapper-host semantics fixed (2026-09-01,
  angular-headless 0.3.0, breaking)** — closed the §11.8 open backlog
  item measured on the Angular app's first axe run. 51 components
  (the 20 `*ListItem` families, the 30 table sub-elements across
  `table`/`data-table`/`calendar-table`/`kanban-table`/`gantt-table`,
  and `Option`) switched from an element selector that wrapped their
  native tag to a combined tag+attribute selector on the native tag
  itself (`li[lily-breadcrumb-list-item]`, Angular Material's own
  idiom for list/table sub-elements), so a required parent-child
  content-model relationship (`<ol>`+`<li>`, `<table>`+`<thead>`, etc.)
  no longer has a wrapper element sitting inside it. The four composed
  pages and `rtl-demo` that had been carrying a direct-class-hook-
  markup workaround for exactly this now use the real components
  again. 491/491 vitest files (1011 tests), `ng-packagr` build clean,
  angular-examples build + 507-page prerender clean, full Playwright
  suite 1574/1574. `DateRange`/`ReviewDate` rendering `<div>` instead
  of the canonical `<span>` — a separate finding from the same axe
  run — remains open. Full record: angular-headless's own
  `spec/index.md`.
- **HTML example app axe + responsive suite failures resolved
  (2026-08-30)** — closed the §11.8 open backlog item measured
  2026-08-26. Two real defects, plus one flaky one found while chasing
  them: `responsive.spec.ts` composed-page routes used trailing-slash
  directory URLs against an app serving flat `.html` files (404s);
  `navigation-and-menus.html`'s dropdown menus wrapped `role="menuitem"`
  `<li>` in a bare `<ul>` (axe `list`/`aria-required-children`); and a
  parser-blocking-stylesheet race gave a flaky color-contrast finding on
  the same page, fixed with the `gotoAndWaitForTheme` wait already used
  for the parallel Blazor fix (P7-T17). No test cases added or removed;
  `accessibility.spec.ts` clean 29/29 across 5 repeats, full `e2e/`
  903/903. Also corrected long-standing drift: the national personal
  identifier catalog grew from its initial 80 components / 40 types
  (0.2.0, 2026-05-24) to the current **92 components / 46 types**
  (`AGENTS/national-person-identifiers.tsv`, committed 2026-05-30) but
  the old 80/40 figures had persisted in prose across the spec, both
  Claude Skills, `llms.txt`/`llms.json`, and the root special files —
  corrected repo-wide. Full record: [CHANGELOG.md](../CHANGELOG.md).
- **Helpers hardening, 2026-07-21 – 2026-07-31** — the `*-select`/
  `*-button` helpers renamed to `*-picker` (`theme-picker`,
  `locale-picker`, `text-size-picker`, `share-picker`; every package
  reset to 0.1.0, nothing had published under the old names) and
  `share-picker` landed as the first helper owning an action rather
  than a preference; then five rounds of cross-catalog accessibility
  hardening (sibling-picker focus/typeahead/PageUp-PageDown fixes,
  locale-picker endonym labels, date-time-picker's `aria-disabled`/
  focus-return/status-region fixes, a pointer-selection-must-close
  contract clarification, and an idempotent-apply fix for a real
  Svelte infinite-loop freeze). Test counts climbed 1231 → 1847 across
  the seven catalogs as each round landed. Full record: CHANGELOG.md.

Older epochs (full detail in [CHANGELOG.md](../CHANGELOG.md), one entry
per version):

- **0.6.0 (2026-07-03)** — Tooling hardening: `bin/test` exits non-zero
  on failure and cross-checks catalog/registries; `bin/generate-registries`
  and `bin/check-links` land; theme-picker/locale-picker reach 0.2.0.
- **0.5.0 (2026-07-03)** — Spec-driven development moves to `spec/`
  directories everywhere; the helpers layer and 45 reference themes
  land; the theme-picker/theme-select naming collision is resolved
  (catalog goes from 492 to 490 components).
- **0.4.0 (2026-05-30)** — Catalog grows from 487 to 492: `question`,
  `answer`, reworked `comment`, `addressograph-box`, `barcode-image`,
  `draft`; `qr-code` renamed `qr-code-image`.
- **0.3.0 (2026-05-30)** — 7th headless + 7th example pair (Angular 20
  + Analog.js) land, fully verified. Canonical national-identifier
  reference files committed at root.
- **0.2.0 (2026-05-24)** — Initial 80 national personal identifier
  components added (since grown to 92 — see the 2026-08-30 entry
  above), bumping the canonical count from 407 to 492. axe-core and
  the responsive sweep land on every example app.


## Full-catalog axe sweeps (moved from spec/index.md §11.5a–b)

#### 11.5a Full-catalog sweep findings (2026-08-27)

The first axe pass over all 491 `/components/{slug}` pages (plan
P4-T1) found 24 failures in 7 rule families, every one a real defect:

- **Demo-markup defects (21 entries in the canonical demo map, fixed
  and regenerated into every app):** `role="radio"` without
  `aria-checked` across the four rating-picker families;
  `menuitem`/`tab` roles rendered without their required
  `menu`/`menubar`/`tablist` parents; unlabelled inputs in the form,
  task-list and date-time-now demos (the last was outright corrupted
  markup); an unnamed `<select>` and listbox; `<dt>/<dd>` inside an
  `<ol>` in the summary-list demos; and a mockup-shell demo whose
  inline light background fought the theme's white text.
- **Shared theme-body defects (fixed in all 45 themes):** `.video-player`
  set a black background without pairing a text colour, and
  `.call-to-action` left inner links on the UA default blue over the
  primary fill.
- **Token defects (fixed in the DTCG source):** four NHS themes'
  accent colour was too light for white accent-content at small sizes
  (ai-label); darkened to L=0.52 with the reasoning recorded in each
  token's `$description`.

#### 11.5b Second full-catalog sweep finding (2026-09-02, plan P1-T6)

Re-running `e2e/axe-catalog.spec.ts` (P1-T6's fresh verification sweep)
found a new, unrelated regression: dozens of `/components/{slug}` pages
whose Usage/Import code snippet is long enough to overflow — mostly the
national personal identifier components, whose names are the longest in
the catalog — failed axe's `scrollable-region-focusable` rule. The
page's own app-shell CSS makes an overflowing `<pre>` horizontally
scrollable (`overflow-x: auto`, to stop a long line breaking page
layout) but the `<pre>` carried no `tabindex`, so keyboard users had no
way to actually scroll it. Fixed by adding `tabindex="0"` to the two
Usage/Import `<pre>` elements on the component-detail page — confirmed
via a full 491/491 re-run, not just the one failing page inspected first.
The same bare-`<pre>`-with-long-content shape exists in the other six
example apps' dynamically-generated component-detail pages (none of
them run an exhaustive per-catalog axe sweep, so none had a failing
test to catch it — nunjucks-eleventy-examples is the exception, since
its 491 component pages are hand/generator-authored static files that
mostly don't embed a code snippet at all), so the same `tabindex="0"`
was applied to those six as a precaution; only svelte-sveltekit's fix
is backed by an exhaustive re-run, but each app's own
`accessibility.spec.ts` sample stayed green after the change. Full
record: CHANGELOG.md.


## Completed backlog items (moved from spec/index.md §11.8)

- [x] Angular subprojects end-to-end verification — closed 2026-08-26.
      angular-headless was already fully verified (§11.2). The
      angular-examples app now emits **full-content static SSG HTML**:
      the route layer was moved off Analog's file-route convention onto
      an explicit 15-route table with plain lazy imports
      (`src/app/views/`, `app.routes.ts`), because the upstream
      injection defect — filed as
      [analogjs/analog#2498](https://github.com/analogjs/analog/issues/2498) —
      had regressed to an empty router in every mode, and even a
      self-owned `import.meta.glob` received empty modules for
      `.page.ts` files. Full record:
      [analog-ssg-notes.md](../lily-design-system-angular-examples/docs/analog-ssg-notes.md).
      The app also gained the canonical detail-page shape (PascalCase
      H1, description, back link) backed by a generated
      `components-data.ts` registry.
- [x] Playwright e2e against angular-examples: landed 2026-08-26,
      1,542 specs green (see §11.4). angular-headless remains covered
      by its vitest + Storybook layers, matching the other headless
      libraries — none of which has a Playwright layer.
- [x] Blazor example app axe/responsive failures: resolved 2026-08-26.
      The 5 checks measured failing on the pre-theme tree pass under
      the theme-layer app (72/72 including theme switching) — the
      overflow went with the shared theme guards, and the
      document-title cases were circuit-timing flakes the reworked
      run no longer hits.
- [x] HTML example app axe + responsive suite failures: resolved
      2026-08-30 (commit `760f7e18b`). Two real defects: `responsive.spec.ts`'s
      composed-page routes used trailing-slash directory URLs against an
      app that serves flat `.html` files (404s, 20/40 checks); switched to
      `/{slug}.html`, matching `accessibility.spec.ts`'s existing shape.
      `navigation-and-menus.html`'s two dropdown menus wrapped
      `role="menuitem"` `<li>` in a bare `<ul>` inside `role="menu"` (axe
      `list`/`aria-required-children`); fixed to the canonical
      `<div role="menuitem">` contract with no list markup. Chasing the
      axe failure also found a flaky color-contrast violation on the
      same page's mobile-menu button — the same parser-blocking-vs-
      dynamically-appended-stylesheet race already fixed for Blazor's
      `/components/dialog` (P7-T17) — fixed with the same
      `gotoAndWaitForTheme` wait. `accessibility.spec.ts` clean 29/29
      across 5 repeats; full `e2e/` suite 903/903.
- [x] **Angular headless wrapper-host semantics.** Closed 2026-09-01
      (angular-headless 0.3.0, breaking). The first-ever axe run
      against the Angular app had shown that element-selector
      components break DOM structures with required parent-child
      semantics: the `<ol>` rendered by `lily-breadcrumb-list`
      contained `<lily-breadcrumb-list-item>` hosts, not `<li>` (axe
      `list` / `listitem`, serious). Fixed at the library level for
      the 51 affected components (the 20 `*ListItem` families, the 30
      table sub-elements across `table`/`data-table`/`calendar-table`/
      `kanban-table`/`gantt-table`, and `Option`): each now uses a
      combined tag+attribute selector on its native tag
      (`li[lily-breadcrumb-list-item]`, per Angular Material's own
      idiom for list/table sub-elements) instead of wrapping it, so
      there is no host element between a parent and a child with a
      required content-model relationship. The four composed pages
      (`page-layout`, `task-management`, `timeline-and-cards`,
      `book-an-appointment`) and `rtl-demo` that had been carrying a
      direct-class-hook-markup workaround for this now use the real
      components again. Verification: angular-headless `vitest run`
      491/491 files / 1011/1011 tests, `ng-packagr` build clean;
      angular-examples build + 507-page prerender clean, full
      Playwright suite 1574/1574 (including axe on every route this
      touched). Full record: angular-headless's own
      `spec/index.md`. The empty `date-range`/`review-date`
      `aria-prohibited-attr` finding from the same axe run is a
      separate, still-open defect (those components render `<div>`
      instead of the canonical `<span>`) — not fixed by this change;
      still worked around with direct class-hook markup in
      `timeline-and-cards.ts`.

## Related topics

- [overview](../overview/index.md)
- [tooling](../tooling/index.md)
- [testing](../testing/index.md)

## Sources

- [CHANGELOG.md](../../CHANGELOG.md)
- [spec/index.md](../index.md)

---

Lily™ and Lily Design System™ are trademarks.
