# Changelog — Lily Design System™

All notable changes to the canonical catalog and monorepo are documented
here. Per-catalog helper changelogs live in each
`lily-design-system-*-helpers/CHANGELOG.md`.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).
The living specification is [spec/index.md](spec/index.md); its §14.1 mirrors these
highlights.

## Accessibility statement + audit-readiness pack — 2026-08-28

[plan.md](plan.md) P4-T2/T5. `docs/accessibility-statement.md` makes
"targets WCAG 2.2 AAA" precise: a verified-by table (what each suite
actually proves, including the new 491/491 catalog baseline), a
not-verified-by-anything section (no audit ever, AAA criteria as
intents not properties, screen readers largely untested — with the
shipped-green-over-real-defects history cited as the reason the
distinction matters), and a plain reporting path. The same content is
a site page at `/accessibility`, in the main nav. `docs/audit-
readiness.md` (P4-T5) prepares the auditor's scope in tiers — the
hand-rolled helper patterns first as the highest-risk surface — with
environments, day-one materials, and the publish-the-report-verbatim
ask, so funding converts to an audit without a discovery phase. Linked
from README, SECURITY.md, and CONTRIBUTING.md.

## First full-catalog axe baseline: 491/491 — 2026-08-27

[plan.md](plan.md) P4-T1. A generated Playwright spec runs axe (WCAG
2.0/2.1 A+AA + 2.2 AA) against every one of the 491 component detail
pages in the SvelteKit app — the previous baseline sampled ~16. The
first run failed 24 pages, and every failure was a real defect fixed at
its own layer: 21 canonical demo-map entries (rating pickers rendered
`role="radio"` without `aria-checked`; menuitem/tab roles without
their required parents; unlabelled form/task-list inputs; the
date-time-now demo was corrupted markup with nested quotes; dt/dd
inside an ol; a mockup-shell demo whose inline background fought the
theme), 2 shared theme-body rules across all 45 themes (video-player's
black chrome now pairs white text; call-to-action links inherit the
primary-content colour instead of UA blue), and 4 NHS themes whose
accent was too light for white content at ai-label sizes — darkened to
L=0.52 in the DTCG token source with the reasoning in $description.
Fixes propagated by `bin/generate-registries`; sweep now 491/491,
standard suites 74/74, angular spot-check 29/29.

## DTCG token source for the 45 themes — 2026-08-27

[plan.md](plan.md) P3-T6 — Phase 3 complete. Each theme's design
primitives now live in `themes/tokens/{slug}.json` in Design Tokens
Community Group 2025.10 format: structured color values (oklch
components; srgb+hex where themes use hex), dimension objects, numbers,
and every token's documentation carried as `$description`.
`bin/generate-theme-tokens` regenerates the CSS token blocks from the
JSON in one canonical emission (Wales's divergent multi-line guard got
normalised on the way), `--check` runs inside `bin/test`, and the
extraction was verified lossless — a value-level diff of old vs
generated blocks shows formatting changes only. Scope is deliberate:
primitives are per-theme data and are token-sourced; the derived
`--lily-*` layer and the component body are shared logic and stay CSS.
This is also the machine-consumable bridge the `lily-figma` decision
(P5-T5) builds on; RFC 6 records the movement.

## Theme provenance, GDS v6 refresh, coverage matrix — 2026-08-27

[plan.md](plan.md) P3-T7/T8. Every one of the 45 themes now carries
exactly one "Upstream tracked:" provenance line — enforced as
`bin/check-theme`'s sixth assertion — so each knows the design-system
version it follows and when to refresh. The GOV.UK theme is the first
beneficiary: refreshed to the Frontend v6.0.0 web palette (green
`#00703c` → `#0f7a52`, red `#d4351c` → `#ca3535`; blue, black, and the
focus yellow are unchanged in v6). NHS themes pin v9.x with a re-check
note for v10; Wales pins the DHCW system it actually follows.

The dark/high-contrast audit lands as a computed matrix in
[spec/theme/](spec/theme/index.md): 31 light / 14 dark; the reference
families are deliberately light-only (their upstreams are light-first
— a dark NHS would be speculation presented as reference); and **no
dedicated high-contrast theme ships**, recorded as a real gap with
WCAG 1.4.6 as the bar for building one rather than relabeling an
aesthetic theme.

## bin/check-theme — and the drift it caught — 2026-08-27

[plan.md](plan.md) P3-T4/T5. P3-T4 was already done: `detectFromSystem`
ships and is spec-tested (§7.20) in all seven catalogs — the July task
predated the feature. P3-T5's checker exists now, with its contracts
corrected against reality before being enforced: the themes' component
body is deliberately per-variant (practitioner "clinical density",
Wales's own language), so the checker pins what is actually shared —
catalog-resolvable hooks, the `@layer lily`/top-level-`:where()`
consumer-wins mechanism, the real token contract
(`--color-*`/`--lily-*`/`--radius-*`, 25 names pinned), a `data-theme`
guard equal to the filename slug, and byte-identical shared guard
sections. Wired into `bin/test`; four seeded fault classes all bite.

Its first run caught real drift, fixed across all 45 themes: rules for
**invented hooks no component emits** (`.link` in the interactive
reset group, `:not(.scroll-view)`/`:not(.tree-view)` exclusions, one
`.submit-button` that meant `.submit-input`), and **six NHS themes
whose `data-theme` guards used truncated slugs** the theme-picker
never sets — their guarded variants could never activate alongside
another theme.

## bin/git-subtree-push exists now — 2026-08-26

The push to the 22 standalone repositories revealed that the
documented `bin/git-subtree-push` script had never existed and every
`.git-subtree-push` file was a 0-byte placeholder (`bin/test` checks
existence, not content). The script now exists — it iterates the
configured remotes (each fanning to GitHub, GitLab, and Codeberg),
honours the per-subproject config file (now populated with each
remote's name), takes optional subproject arguments, and keeps
`git subtree push` output deliberately unpiped: `git subtree split`
dies on SIGPIPE if a downstream filter exits early, which is exactly
how a broken filter silently killed 21 of 22 pushes on the first
attempt today.

## 21 helper packages 0.1.1 — registry metadata catch-up — 2026-08-26

The svelte, react, vue, and nunjucks helper catalogs (and the html
date-time-picker) were published at 0.1.0 before the day's metadata
sweep, so the registry still served the single-license field, the old
URLs, and — for the svelte theme-picker — the phantom `@sveltejs/kit`
runtime dependency. All 21 republished as 0.1.1: SPDX menu, corrected
repository/homepage/bugs, named author, real descriptions; the svelte
theme-picker's framework dependency moves to devDependencies. No
behaviour change; the angular (0.2.0) and remaining html (0.1.1)
helpers already carried current metadata.

## Locale and text-size pickers join every app shell — 2026-08-26

[plan.md](plan.md) P3-T3. All seven example apps now carry the three
preference pickers, each with a site-preferences e2e covering `lang`
application, the Arabic `dir="rtl"` flip, `data-text-size`, and
persistence across reload. Share-picker was evaluated and deliberately
not adopted: its targets are an editorial decision the demos should
not fake.

Three findings from the sweep, each fixed at the honest layer:

- **Headless Chromium lacks Welsh ICU data**, so the locale-picker's
  `Intl.DisplayNames` endonym silently fell back to the English exonym
  ("Welsh (United Kingdom)") while French and Arabic resolved fine.
  The apps now supply explicit `localeLabels` — a consumer that cares
  about a specific list should say so — and the caveat is worth
  knowing wherever the endonym default is relied on.
- **Nuxt's head manager re-asserts declared `htmlAttrs`**, silently
  clobbering the picker's `lang` write while its undeclared `dir`
  survived. In the Nuxt app, unhead is now the writer of record:
  the picker's `v-model` drives a reactive `useHead`, and the static
  `lang` left the config.
- **The Blazor app had no per-page `<PageTitle>` anywhere** — the
  intermittent `document-title` axe failures were real after all,
  surfacing whenever head management raced the static title. All 15
  pages now set one. Also: the 45 themes' input target-size floor
  broadened from three named classes to all text-like inputs, after a
  combobox input slipped under 24px.

Suites re-verified: sveltekit 29 a11y + 5, react 29 a11y + 5, vue 31,
angular 5, html 5, eleventy 658 (full), blazor 34.

## Themes live in all seven example apps — 2026-08-26

The Blazor port closes [plan.md](plan.md) P3-T2. The helper comes in as
a local `ProjectReference` (its NuGet package is packed, push pending
credentials), the layout carries the curated list, and App.razor gets
the pre-paint script. One honest adaptation in its e2e: Blazor's
server-rendered button is inert until the SignalR circuit is
interactive and no DOM signal marks that moment, so the spec's open
step retries until `aria-expanded` actually flips. Full suite 72/72 —
including the five checks that failed on the pre-theme tree (overflow
went with the shared theme guards; the document-title cases were
circuit-timing flakes). Also: the Blazor app's tracked `bin/`+`obj/`
build artifacts (52 files) are untracked, gitignored, and the CI junk
guard now catches .NET build output too.

## Every framework stack updated to current — 2026-08-26

The whole matrix moves to today's releases, per stack, each verified
before its commit:

| Stack | Now on | Verified |
| --- | --- | --- |
| Svelte | svelte 5.56, Kit 2.70, vite-plugin-svelte 7, Vite 8, vitest 4, TS 6 | 4,906 + 211 cases; app 72/72 |
| React | React 19.2, Next 16.3 (Turbopack), vitest 4 | 2,665 + 267 cases; app 71/71 |
| Vue | Vue 3.5.41, Nuxt 4.5, Vite 7, vitest 4 | 2,655 + 261 cases; app 68/68 |
| Angular | Angular 22.1, Analog 2.7, Vite 7, TS 6, ng-packagr 22, Storybook 10, vitest 4 | 1,010 + 290 cases; 491 stories; app 1,545/1,545; headless + 5 helpers published 0.2.0 |
| Nunjucks | Eleventy 3.1, nunjucks 3.2, vitest 4 | 2,844 + 321 cases; app 60/60 |
| Blazor | .NET 10 (already current); AspNetCore packages to 10.0.11 | 1,502 + 203 bUnit cases; app builds |

Real findings along the way: Next 16's Turbopack refused the React
app's `@pgds/*` alias — which turned out to resolve *outside the app*
into the sibling headless subproject, with all 411 local component
"copies" being re-export stubs through it (hollow copy-pattern, broken
in the standalone subtree repo; now real copies under a `@lily/*`
alias, with the 80-component NID gap in that copy set logged). The
Blazor example app's axe/responsive suites carry 5 pre-existing
failures (measured on the pre-bump tree, like the HTML app's) — logged
in spec §11.8, not absorbed. TypeScript lands at what each toolchain
supports: 6.0 for Angular and Svelte-Kit, 5.9 elsewhere.

## Angular stack on 22.1 + Analog 2.7 — 2026-08-26

All three Angular subprojects move to the current stack: Angular
22.1.x, Analog 2.7, Vite 7, TypeScript 6.0, vitest 4, jsdom 30,
ng-packagr 22.1, Storybook 10. The 1.22.5 `pnpm-workspace.yaml`
overrides that pinned the old Analog are gone, `zone.js` is dropped
from the (zoneless) examples app, TS6's stricter side-effect-import
checking gets a `*.css` module declaration, and the deprecated
`baseUrl` leaves the tsconfigs. Everything re-verified on the new
toolchain: examples 1,545/1,545 Playwright specs with full-content
SSG; headless 1,010 vitest cases + 491 Storybook 10 stories —
**published as angular-headless 0.2.0** (peers widen to
`>=20 <23`); helpers 290 vitest cases — **published as 0.2.0 of all
five** with the same widened peers, and the examples app re-verified
against the published packages.

## Themes live in the Eleventy app — 2026-08-26

The cleanest port of the six ([plan.md](plan.md) P3-T2): the nunjucks
catalog's macro + client-runtime split fits Eleventy natively. The
helpers catalog joins the nunjucks loader path, the header partial
calls `themePicker(...)` with the curated list, the client runtime is
passthrough-copied from the helpers catalog (single source, no vendored
drift), and the base layout carries the pre-paint script. 60/60 —
theme switching, axe, and responsive all green on the first run.

## HTML pickers were pointer-broken; themes live in the HTML app — 2026-08-26

Porting the theme switcher to the vanilla HTML example app
([plan.md](plan.md) P3-T2) found the worst defect of the sweep: **the
four HTML popup pickers opened and instantly closed on every pointer
click** — unusable with a mouse, in all four published 0.1.0 packages.
A trusted click targets the icon `<span>`; opening runs the state
sync, whose `replaceChildren()` on the button content detaches that
span mid-event; when the same click bubbles to the document, the
outside-click containment check sees a detached target, judges the
click "outside", and closes the popup it just opened. Synthetic
`button.click()` targets the button element, which survives the swap —
so 294 jsdom tests stayed green over a control no mouse user could
operate. The document handler now judges clicks by their
`composedPath()` snapshot; four regression tests click the actual icon
span (the theme-picker one confirmed to fail without the fix);
**theme-, locale-, text-size-, and share-picker published as 0.1.1**
(298 tests).

The app wiring follows the recipe, vanilla-style: all 15 pages gain
the pre-paint boot script and the `<theme-picker>` element in their
headers (vendored dist via `bin/sync`, declarative CSV/JSON
attributes), `nhs.css` split into app-shell chrome, themes served from
`pages/themes/`. Theme-switching spec: 3/3.

Also measured, not caused: the HTML app's axe/responsive suites fail
**48 of 69** checks on the untouched pre-change tree (composed-page
trailing-slash routes 404 under `http-server`, `component.html` sample
pages fail axe) — the May 2026 "29/29 clean" snapshot no longer
reproduces. Recorded in spec §11.8 as open debt rather than silently
absorbed here.

## Angular themes live — and two real defects under them — 2026-08-26

Porting the theme switcher to the Angular example app ([plan.md](plan.md)
P3-T2) surfaced two defects that jsdom suites had never seen:

- **The Angular listbox pickers could not be closed with Escape in a
  real zoneless app.** Opening focused the list in a microtask that ran
  before zoneless change detection removed `hidden`, so focus silently
  stayed on the button — whose keydown handler does not handle Escape.
  Invisible to the TestBed suites, whose helpers flush detection; caught
  by the example app's real-browser theme-switching spec. Fixed with a
  `detectChanges()` flush before the focus (the fix the date-time-picker
  port already recorded for paging), in theme-, locale-, and
  text-size-picker; **published as 0.1.1** of all three.
- **Every typed input in angular-headless rendered `type="text"`** —
  all 25 (radio, checkbox, date, email, file, password, range, …), a
  generator artifact nothing asserted against. Radio buttons were text
  boxes to the browser and to assistive technology. Found via an axe
  `target-size` finding on the settings page whose "radios" were
  undersized text inputs. All 25 fixed in the library and the example
  app's copies, each spec now asserts its canonical type
  (seeded-fault-checked; suite 985 → 1,010), **published as
  angular-headless 0.1.1**.

The app itself follows the established recipe: helper from npm (0.1.1),
curated list, NHS England patients default, app-shell extraction,
pre-paint script creating the managed link. Full suite: 1,545 / 1,545,
including axe with the theme layer and the new switching spec.

## Themes go live in the SvelteKit example app — 2026-08-26

[plan.md](plan.md) P3-T1, the canonical wiring. The app's component
styling now comes from the runtime theme layer instead of a baked-in
stylesheet: `theme-picker` (installed from npm — the example app is a
real consumer of the published helper) sits in a new site header with a
curated ten-theme list defaulting to NHS England for patients,
`bin/sync` serves the 45 canonical `themes/*.css` at `/themes/`, and
`nhs.css` shrinks to an app-shell file (page scaffolding, header,
footer). A pre-rendered managed `<link>` plus a small pre-paint script
in `app.html` means no flash of unstyled or wrongly-themed content —
the helper adopts the link on hydration.

Switching the default surfaced real accessibility findings the old
stylesheet had been compensating for: **WCAG 2.2 target-size (2.5.8)
failures** on link-shaped hooks (`.action-link`, `.back-link`,
breadcrumb and pagination anchors) and small inputs. All 45 themes now
carry a shared target-size floor section (`:where()`-wrapped, zero
specificity), the app's own content links get the same floor in
app-shell.css, and one undersized inline-styled remove button was
fixed in place. New `e2e/theme-switching.spec.ts` asserts the default
link, select-apply-persist across reload, the pointer-close contract,
and Escape; the full run is 72/72 with the axe and responsive suites
green under the new architecture.

## Release engineering: tags, releases, smoke gate, publish workflow — 2026-08-26

[plan.md](plan.md) P2-T4–T7. Retroactive annotated tags v0.2.0–v0.6.0
created against the identified release commits and pushed to all three
forges; five GitHub Releases carry the CHANGELOG sections as notes —
the project's first tags ever. New `bin/smoke-packages` packs every
npm headless library and imports it from a scratch consumer (React and
Vue SSR renders, an html snippet read, a real nunjucks macro render, an
Angular JIT import, and a genuine Svelte Vite build) — the gate that
would have caught 0.2.0 — and runs in CI as the `consumer-smoke` job.
A tag-gated `publish` workflow runs both publish scripts dry-run by
default with npm provenance enabled; publishing for real requires an
explicit manual dispatch. `docs/releasing.md` records the version
lines, the first-release-is-0.1.0 principle, the two stable contracts
that drive breaking bumps, the deprecate-never-unpublish policy with
0.2.0 as the worked example, and the credential inventory.

## Phase 2 begins: six of seven headless libraries on npm — 2026-08-26

[plan.md](plan.md) P2-T1/T3: `lily-design-system-html-headless`,
`-angular-headless`, and `-nunjucks-headless` published, each first
released at **0.1.0** — a first release numbered higher would imply
registry history that never existed, the helpers' July 2026 reasoning.
Each was verified from its packed tarball in a scratch consumer before
publish: html reads all 491 snippet files through its new node helper
(`componentsDir` / `readComponent` / `listComponents`), nunjucks
renders a real macro through the exported `templatesDir` loader path,
and the Angular APF bundle exposes all 491 component classes (JIT
smoke; consumers link via the Angular CLI). Along the way: the
nunjucks manifest's `type: module` was dropped (it wrapped a CommonJS
payload), and the Blazor headless `PackageId` was corrected from
`LilyBlazorHeadless` to `LilyDesignSystem.Blazor.Headless` **before**
anything claimed the wrong name irreversibly on nuget.org — it is now
packed at 0.1.0 alongside the five helper packages in `dist-nuget/`,
push pending `NUGET_API_KEY`. New `bin/publish-headless` script
(dry-run by default) covers all seven; INSTALL.md tables and the
per-repo generated INSTALL files now state the true publication
status.

## Improvement plan Phase 1 — registry hygiene, catalog truth, Angular closure — 2026-08-26

Executing [plan.md](plan.md) Phase 1 ("truth, hygiene, and registry
cleanup"), plus the day's research-driven groundwork:

- **Catalog reconciled at 491** (P1-T1). The 491st component is
  `image-cropper` (added 2026-07-07). Every live 490 claim in
  `spec/index.md` and nine `spec/{topic}/` docs now says 491; dated
  snapshot records keep their historical numbers. The audit found one
  real propagation gap: **nunjucks-headless had no Storybook story for
  image-cropper** (490/491) — added, all six Storybook libraries now
  carry 491.
- **npm registry hygiene** (P1-T2, P1-T3). The three broken 0.2.0
  headless packages are **deprecated on npm** with an upgrade message.
  svelte/react/vue headless **0.3.1 published**: metadata-only patches
  shipping the SPDX license menu, the corrected LilyDesignSystem
  repository URLs (react and vue pointed at `github.com/lily`, an
  unrelated account), and "Targets WCAG 2.2 AAA" wording. Each tarball
  was verified by installing into a scratch consumer and rendering
  components (React/Vue SSR render, Svelte via a real Vite build).
- **Angular examples: SSG closed, e2e suite landed** (P1-T4, P1-T5).
  The upstream Analog route-injection defect was filed as
  [analogjs/analog#2498](https://github.com/analogjs/analog/issues/2498),
  and the fallback fixed the app outright: routes moved to an explicit
  table over plain `src/app/views/*.ts` components, off the `.page.ts`
  convention entirely — which had regressed to a silently empty router
  in every mode, and swallowed even self-owned glob imports (empty
  modules, `loadComponent: undefined`, navigation "completing" with a
  dead outlet). Static SSG now emits full page content. The detail page
  gained the canonical shape (PascalCase H1 from a new generated
  `components-data.ts` registry — wired into `bin/generate-registries`
  and counted by `bin/test` — description, "Back to components" link),
  and a 491-file per-component Playwright suite was generated to mirror
  the SvelteKit app's.
- **Fresh verification sweep, unit suites** (P1-T6 partial, P1-T7).
  All headless suites re-run and green with grown counts: svelte 4,906
  cases / 983 dual-mirror files (the "80 national identifiers lack
  dual-mirror specs" note was stale — they exist and pass), react
  2,665, vue 2,655, nunjucks 2,844, angular 985, blazor 1,502; helper
  catalogs 1,847. html-headless spec files counted at 491 (browser run
  not re-executed). §11.4 restamped.
- **Angular e2e green end to end: 1,542 / 1,542** (P1-T4 completed).
  The first-ever axe run against the Angular app caught 7 real
  violations across three composed pages — the element-selector wrapper
  hosts break required `ol > li` DOM structure, and empty
  `date-range` / `review-date` carried `aria-label` on a generic
  element against their canonical `<span>` contract. The pages now use
  direct class-hook markup (the headless contract), the mobile overflow
  on `/page-layout` is fixed with a wrap-capable flex sidebar, and the
  library-level idiom defect is logged in spec §11.8 as a deliberate
  breaking change to plan. Suite runtime fell from 57 minutes (timing
  out against dead routes) to 2 minutes.
- **Repo presentation and security** (P1-T8–T10). All 23 GitHub repos:
  descriptions + 5 topics; secret scanning, push protection, private
  vulnerability reporting, and Dependabot security updates enabled
  (verified via API; two UI-only secret-scanning toggles remain and are
  recorded in SECURITY.md). Root README gained styled-vs-unstyled
  screenshots. A latent build break was fixed on the way: the SvelteKit
  example app **did not build** (duplicate `ThemeSelect` import in
  `settings-page`, residue of the July theme-select merge) — proof the
  app hadn't been production-built since; fixed.

## Headless packages get a real entry point — 2026-08-23

Preparing the first publish of the helper catalogs surfaced that the three
published headless packages were broken on npm. `lily-design-system-svelte-headless`,
`-react-headless` and `-vue-headless` each declared `"main": "index.js"`
and no such file had ever been built or shipped, so every
`import … from "lily-design-system-<framework>-headless"` failed at
resolution. 0.2.0 is unusable on the registry for that reason. Nothing
caught it because nothing in CI ever imported a package the way a
consumer does — the tests import component files by relative path.

Each package now generates a barrel over all 491 catalog components and
builds a real `dist/` — tsup for React, Vite library mode + vue-tsc for
Vue, svelte-package for Svelte — with `main`/`types`/`exports` pointing at
it and a `files` allowlist. The tarballs shrink accordingly: React 1995
files / 2.8 MB → 5 files / 572 KB, Vue 1980 / 2.6 MB → 496 / 660 KB,
Svelte 3968 / 6.8 MB → 987 / 1.36 MB. Each was verified by installing the
packed tarball into a scratch project and importing it as a consumer
would; the Svelte one through a real Vite build, since a Svelte library
ships `.svelte` source that bare Node cannot load.

Emitting declarations for the first time exercised type-checking that had
never run, and it found real defects. In React, nine: eight components
destructured `children` and/or `label` without declaring either, so both
resolved through the `[key: string]: unknown` index signature, and
`TreeList` held an `<ol>` ref typed as `HTMLElement`. Those were typing
gaps over correct runtime behaviour. Vue's were not. Three rating pickers
— `FiveStarRatingPicker`, `FiveFaceRatingPicker`, `NetPromoterScorePicker`
— bound `:checked` and `@change` to `value`, an identifier none of them
declares, so the control rendered unchecked whatever the model held and
choosing an option recorded nothing; two of them also rendered stray
`:star="star"` / `:score="score"` attribute text as visible labels, and
`TagInput` called an undeclared `onadd?.()` that threw a `ReferenceError`
on Enter. Their existing tests passed against all of it, because a native
radio checks itself on click regardless of what Vue bound to it. Tests
that assert the emitted `update:modelValue` and `add` events have been
added, each confirmed to fail before its fix.

Separately, `ProgressCircle`'s tests queried `getByRole("Progress")` — not
a valid ARIA role, so it never matched — while the component correctly
renders `role="progressbar"`. Those had been failing: 4 cases in Vue and 8
in Svelte, which mirrors the file under both `components/` and
`src/lib/components/`. All three suites are now green: React 2665, Vue
2655, Svelte 4906.

The 35 helper packages are unaffected by any of this and remain at 0.1.0.

## Pointer-selection close is now part of the contract — 2026-07-31

A report that a pointer selection might leave the listbox open —
`aria-expanded="true"` with the list still visible — prompted an audit of
all seven catalogs. It does not: clicking an option closes the listbox
in every catalog, verified in jsdom, in bUnit, and in a real Chromium
for the canonical Svelte helper. The defect was in the contract, not the
code. Only the keyboard clause promised the close; the pointer clause
said "selects and applies", and no catalog except HTML asserted that a
click closed anything. An untested asymmetry is one refactor from
becoming real, and the failure it would produce is nasty: a stale
`aria-expanded="true"` over a hidden list tells assistive technology the
popup is open while every later click misses the options.

### Changed

- The pointer clause in `theme-picker`, `locale-picker` and
  `text-size-picker` now reads "clicking an option selects it, applies
  it, and closes the listbox" in all seven catalogs, matching HTML's
  wording, which already had it right.
- Each catalog's pointer-selection test now asserts `aria-expanded` and
  the list's `hidden` alongside the applied value. Confirmed to bite:
  deleting the `closeList()` call from `choose()` fails the test in both
  Svelte and Vue.
- `AGENTS/helpers.md` states the pointer close in the listbox contract,
  so a future port cannot read the keyboard rule as the whole story.

Test counts are unchanged (svelte 211, react 267, vue 261, html 294,
nunjucks 321, angular 290, blazor 203) — existing tests were tightened
rather than new ones added.

## Idempotent apply in the preference pickers — 2026-07-31

`theme-picker`, `locale-picker` and `text-size-picker` re-ran their
apply step whenever their framework re-evaluated it, not only when the
value changed — re-writing the DOM, re-writing `localStorage`, and
re-firing the consumer's change callback each time. Applying is now a
no-op for a value already applied, in all four catalogs that reached
apply more often than the value changed. Diagnosed from a real-browser
reproduction; each catalog's own tests were confirmed to fail without
the guard.

### Fixed

- **Svelte (broken).** `applyX()` runs inside `$effect`, so a consumer
  whose `onChange` writes reactive state re-entered the effect until
  Svelte abandoned updating the component
  (`effect_update_depth_exceeded`). The component then froze: internal
  state kept toggling, the DOM stopped, and `aria-expanded` stayed
  `true` over a hidden list, so every later click missed the options. A
  consumer callback as ordinary as `count += 1` was enough.
- **HTML (broken).** `attributeChangedCallback` fires on every
  `setAttribute("value", …)`, unchanged value included, so a listener
  that mirrored the value back onto the element re-entered apply without
  limit. Disconnecting now clears the record, so a re-connected element
  applies again.
- **Nunjucks.** `setTheme` / `setLocale` / `setSize` on the returned
  controller *are* the apply function, so a consumer mirroring the value
  back from `onChange` recursed.
- **React.** Controlled mode applied on selection and again when the
  consumer wrote the value back: two `onChange` calls, two storage
  writes and two DOM writes per selection, and the same at mount. It
  terminated, but did twice the work and broke the documented "once per
  applied change" contract.

### Verified clean, unchanged

- **Angular** (`effect()` tracks per-signal and the compiler hoists
  literal array bindings), **Vue** (`watch(current, …)` already carried
  the change guard) and **Blazor** (apply is imperative, reachable only
  from `SetXAsync` and first render). `share-picker` and
  `date-time-picker` apply nothing to the document in any catalog, so
  neither ever had the defect.

All seven catalogs' suites pass: svelte 211, react 267, vue 261,
html 294, nunjucks 321, angular 290, blazor 203 — 1847 tests, the
1835 baseline plus twelve new regression tests, one per fixed package.

## Sibling-picker accessibility hardening, all seven catalogs — 2026-07-29

An accessibility audit of the four sibling pickers (`theme-picker`,
`locale-picker`, `text-size-picker`, `share-picker`) found five defects
and two worthwhile enhancements; all landed canonical-Svelte-first and
were ported to the six sibling catalogs the same day. Each package's
CHANGELOG carries the full record under "Unreleased".

### Changed

- **Tab out of an open picker no longer teleports keyboard focus to the
  top of the page.** The Tab handler hid the list while it (or a share
  item) had focus; the browser then moved focus to `<body>` and the
  default Tab restarted from the document's first tab stop. Focus now
  goes to the trigger button first — without cancelling the key — so
  the default Tab proceeds from the picker's own position. Exception,
  found honestly by the port: **Blazor's listbox pickers omit this**,
  because Blazor's async event handling runs the default Tab before the
  handler hides the list, so the bug cannot occur and the refocus would
  yank users backwards; Blazor's share-picker (real link items) does
  exhibit the bug and takes the fix.
- **Typeahead follows the APG single-character rule** in the three
  listbox pickers: one character advances to the next match, repeating
  it cycles (dark → dim → dracula on "d d d"), a buffer of differing
  characters refines from the active option.
- **Locale-picker default labels are endonyms** — each language named
  in itself, "Cymraeg" not "Welsh" — via a new exported
  `localeEndonym()` (`Intl.DisplayNames` asked in that language;
  `CultureInfo.NativeName` in Blazor; a client-side upgrade over a
  derive-marked fallback in Nunjucks, whose macros cannot reach ICU).
  The English table becomes a fallback. And an option's `lang` is now
  set **only** when its label is the derived endonym: previously every
  option carried `lang` while showing an English label, sending
  screen-reader speech engines to the wrong voice — the English word
  "Arabic" read out by an Arabic synthesizer.

### Added

- **`PageUp` / `PageDown`** move the listbox cursor by ten, clamped —
  an APG-optional key that earns its place in the 45-theme list.
- **`share-picker`'s list carries the picker's accessible name.**

### Fixed

- Opening an empty listbox no longer points `aria-activedescendant` at
  a nonexistent id (and the HTML and Blazor ports, whose `openList`
  refused to open on an empty list, now match canonical behaviour).
- Long-stale docs: the canonical and Blazor text-size packages still
  described the pre-0.2.0 native-`<select>` era; the canonical picker
  docs' Tab rows and the locale docs' "always-on `lang` is a known
  limitation" caveat described behaviour the fixes removed.

### Notes

- 1835 tests pass across the seven catalogs: svelte 208, react 264,
  vue 261, html 291, nunjucks 318, angular 290, blazor 203.
- Port-spec clause numbering follows each port's own §7 sequence where
  the canonical numbers were already taken; every hardening test cites
  its canonical clause.

## date-time-picker accessibility hardening, all seven catalogs — 2026-07-29

Seven changes to the `date-time-picker` helper, each fixing something a
screen-reader or keyboard user would actually hit, landed first in the
canonical Svelte package and then ported to the six sibling catalogs the
same day. Each package's own CHANGELOG carries the full record under
"Unreleased"; the canonical contract is spec §7.49–§7.55.

### Changed

- **Vetoed days render `aria-disabled="true"` + `data-disabled`, never
  the `disabled` attribute.** A `disabled` button refuses focus, so
  arrowing the roving cursor across a blocked week went *silent* for a
  screen reader while the visible focus stayed behind — and the "exactly
  one tabbable day" invariant broke whenever the cursor sat on a vetoed
  day. Days now stay focusable and announce as unavailable; activation is
  still refused in the handler. The 45 `themes/*.css` day-state rules
  moved from `:disabled` to `[data-disabled]` to match — consumer CSS
  needs the same migration.
- **Closing the dialog returns focus to the element that opened it** —
  the text field after `Alt`+`ArrowDown`, the trigger button after a
  click — per the APG dialog rule. Previously always the button.
- **Header month/year paging no longer steals focus into the grid.**
  Focus follows the carried cursor only when it was already inside the
  grid (where the focused cell is about to be unrendered); a user on
  "next month" stays on "next month" and can page repeatedly.
- **Clicking anything outside the dialog closes it — including the
  component's own text field.** The dialog claims `aria-modal="true"`;
  staying open while the user edits behind it told assistive technology
  one thing and did another. (In the HTML port this was a genuine hole:
  its old handler exempted the whole custom element.)

### Added

- **`labels.invalid`** (optional): a `role="status"` live region —
  present-but-empty while valid, so it actually announces — that fills
  when typed text is refused, wired via `aria-errormessage` and appended
  to `aria-describedby`. Previously `aria-invalid` flipped with no
  announcement at all.
- **`labels.instructions`** (optional): keyboard help rendered inside the
  dialog and referenced by its `aria-describedby`, spoken once on open —
  the affordance the APG date-picker example ships.
- **`Escape` in the text field discards a pending typed edit**, restoring
  the committed display and clearing the invalid state, mirroring the
  dialog's Escape contract.

### Fixed

- **Blazor: grid-paging focus silently targeted nothing** outside the
  opening month — the day-button `ElementReference` map was keyed by ISO
  date, but Blazor re-runs `@ref` captures only on element creation and
  the un-keyed grid reuses its 42 buttons. Now keyed by grid position.

### Notes

- 1717 tests pass across the seven catalogs: svelte 192, react 247,
  vue 248, html 274, nunjucks 297, angular 272, blazor 187 (+50 over
  2026-07-28, one test per new spec clause per catalog, plus one
  Nunjucks-only test for its init-time label path).
- Two documented Blazor divergences (spec §9 there): the opener is
  tracked by code path because Blazor cannot read
  `document.activeElement` without interop, and field Escape cannot
  conditionally stop propagation (`@onkeydown:stopPropagation` is
  static). One Angular divergence: focus into freshly-paged cells needs
  a synchronous `detectChanges()` first, because Angular renders after
  the microtask queue drains — Svelte's synchronous flush is what let
  the canonical `queueMicrotask` idiom work.

## date-time-picker, and `*-chooser` renamed back to `*-picker` — 2026-07-28

### Added

- **`date-time-picker`, the fifth helper**, in all seven catalogs (35
  helper packages now, up from 28). A headless date / time / datetime
  control: a typeable text field plus an icon button (📅 U+1F4C5 + U+FE0E)
  opening a WAI-ARIA APG **Date Picker Dialog**. Value contract is ISO —
  `YYYY-MM-DD`, `HH:MM`, `YYYY-MM-DDTHH:MM` — the same shape
  `<input type="date">` posts. Constraints via `min` / `max` / an arbitrary
  `isDateDisabled` predicate; consumer-labelled `shortcuts`; optional
  ISO-8601 week numbers; `minuteStep`; typed input that reads ISO,
  locale-ordered numerics and written month names.

  It exists because **Digital Health and Care Wales now publishes a design
  system** (the NHSW component library) containing a date picker, and Lily
  had no equivalent. Everything DHCW's does is implemented; twelve of its
  defects are not. The four that matter most:

  - **No hardcoded English.** DHCW bakes in `MONTHS`, `SHORT_MONTHS`,
    `"Today"`, `"Cancel"`, `"OK"`, `"Previous year"`. Here month and
    weekday names come from `Intl` and every other string is a prop. For a
    *Welsh* design system that is the difference between a bilingual
    service and an English one with a Welsh veneer.
  - **Monday is not assumed.** First day of week comes from
    `Intl.Locale.getWeekInfo`, overridable by prop.
  - **The focus trap exists.** DHCW declares `aria-modal="true"` and traps
    nothing — worse than not declaring it, because the user is told the
    rest of the page is inert while Tab walks into it.
  - **Civil dates, not local-midnight `Date`.** `new Date(y, m, d)` is an
    *instant* at local midnight and resolves to the previous day in zones
    whose DST transition falls at midnight. All arithmetic goes through
    UTC epoch days.

  Two documented divergences from the sibling helpers, both deliberate: it
  is a **form control**, so it has a text field alongside its trigger and
  the "one shape: icon button opening a popup" rule applies only to that
  trigger; and its ten user-facing strings arrive as **one `labels`
  object** rather than ten flat `*Label` props. Six of those keys are
  required with no English default.

- **The 45 `themes/*.css` style it**: root positioning, the trigger joining
  the shared icon-button rule, dialog, header, calendar grid, day states
  (`data-today` / `data-outside` / `data-selected` / `:disabled`), time
  selects, shortcuts and footer — all from theme tokens.

### Changed

- **Every helper renamed `*-chooser` → `*-picker`**, reversing the
  2026-07-21 rename. Full depth: directories, npm / NuGet package ids,
  source filenames, exported symbols (`ThemeChooser` → `ThemePicker`,
  `nextShareChooserId` → `nextSharePickerId`), CSS class hooks,
  `data-lily-theme-picker`, `--lily-picker-icon-scale` across the 45
  themes, and the glyph-escaping check in `bin/test`.

  All packages stay at **0.1.0**: nothing had been published under either
  name, so the reset costs nothing, and numbering a first release higher
  would imply releases that never existed.

- `--lily-picker-icon-scale` for the calendar glyph is **0.845 — the same
  factor as the globe**, and that is an identity rather than a
  coincidence: a colour-emoji font paints every one of its glyphs into one
  identical em square. Measured on the reference stack, globe, calendar,
  rocket and heart all give an ink box of 1.015 × 1.015 with an advance of
  1.000. Any future emoji helper icon takes the same factor without
  re-measuring. (The same measurement confirms U+FE0E is ignored on that
  platform — the bare and VS-15 forms are metrically identical. It stays
  in the source as a hint to the platforms that do honour it.)

### Fixed

- **`bin/test`'s glyph check did not know about the new constant.** It
  greps a hardcoded list of glyph-constant names, so `CALENDAR` and 📅
  would have escaped enforcement silently. Both added.

### Notes

- 1667 tests pass across the seven catalogs: svelte 185, react 240,
  vue 241, html 267, nunjucks 289, angular 265, blazor 180.
- **A rename hazard worth recording**: `perl -pi` over a file list
  *follows symlinks* and replaces them with regular files. The sweep
  silently destroyed 70 `README.md` → `index.md` symlinks; only
  `bin/test`'s symlink check caught it. This is the fourth instance of
  this repo's recurring failure shape — an operation that reports success
  while quietly doing the wrong thing.
- Stale `dist-nuget/*Chooser*.nupkg` artefacts were deleted. Left in
  place, `bin/publish-helpers` would have pushed them to nuget.org under
  package names that no longer exist, claiming those names irreversibly —
  the exact hazard that script's own comments warn about.

## Picker glyphs escaped in source — 2026-07-21

### Changed

- The four picker glyphs no longer appear as bare characters in the
  source that renders them. **Code contexts use an escape** —
  `"\u25D1"`, `"\u{1F310}\uFE0E"`, `"\u27A4"` — and **markup contexts
  use an HTML entity**: `&#9681;`, `&#127760;&#65038;`, `&#10148;`.
  A bare glyph is near-invisible in an editor, and U+FE0E has no visual
  form at all; one was nearly lost to a careless edit earlier in this
  work.
- ASCII `"A"` (U+0041) is deliberately left literal — it cannot be
  mangled, and escaping it would only make it harder to read.
- Two constants were already carrying a **bare U+FE0E** appended to an
  escaped globe (`"\U0001F310︎"` in Blazor, `"\u{1F310}︎"` in
  Nunjucks) — exactly the invisible-character hazard this closes.

### Added

- `bin/test` now enforces it, checking the glyph constants and the icon
  markup in every picker package. Verified by planting a regression of
  each kind and confirming both fail.
- Prose is deliberately **not** checked: a changelog explaining that the
  glyph moved from one character to another has to show them, and tests
  asserting rendered output legitimately contain the character.

### Note

- The first version of this check silently passed everything. `bin/test`
  runs under `set -euf`, and `-f` disables globbing, so its file globs
  never expanded — which is why every other check in that script uses
  `find`. Worth knowing before adding another one.

## share-picker glyph — 2026-07-21

### Changed

- The `share-picker` button glyph moves from **↪ U+21AA RIGHTWARDS
  ARROW WITH HOOK** to **➤ U+27A4 BLACK RIGHTWARDS ARROWHEAD**, and the
  exported constant renames with it: `RIGHTWARDS_ARROW_WITH_HOOK` →
  `BLACK_RIGHTWARDS_ARROWHEAD` (`RightwardsArrowWithHook` →
  `BlackRightwardsArrowhead` in Blazor). ➤ reads as _send_ rather than
  _go back_, and is likewise an in-font monochrome character rather than
  a pictograph.
- Optical scale retuned: ➤ inks 0.613 of its em box against ◑'s 0.777,
  so `--lily-picker-icon-scale` for the share icon goes 1.331 → 1.268
  across the 45 `themes/*.css`. Verified in a browser against the real
  components: all four glyphs now render within 0.52px of each other in
  identical 40×40 buttons.

### Notes

- Two assertions could not be caught by a text substitution and had to
  be found by running the suites: the HTML and Nunjucks catalogs assert
  the codepoint numerically (`0x21aa`), and the Nunjucks macro emits the
  glyph as an HTML entity (`&#8618;`). Both are now `0x27a4` /
  `&#10148;`. Worth remembering if the glyph ever changes again — a
  grep for the character alone will miss them.

## Helpers renamed to `*-picker` — 2026-07-21

### Changed (BREAKING — all helper packages)

- Every helper in all seven catalogs is renamed:

  | Was                                        | Now                                        |
  | ------------------------------------------ | ------------------------------------------ |
  | `lily-design-system-{fw}-theme-select`     | `lily-design-system-{fw}-theme-picker`     |
  | `lily-design-system-{fw}-locale-select`    | `lily-design-system-{fw}-locale-picker`    |
  | `lily-design-system-{fw}-text-size-select` | `lily-design-system-{fw}-text-size-picker` |
  | `lily-design-system-{fw}-share-button`     | `lily-design-system-{fw}-share-picker`     |

- Full depth: directories, npm / NuGet package ids, exported symbols
  (`ThemeSelect` → `ThemePicker`, `nextShareButtonId` →
  `nextSharePickerId`, …), CSS class hooks and every derivative,
  `data-lily-*-select` → `data-lily-*-picker`, Angular selectors, HTML
  custom-element tags, and the `--lily-select-icon-scale` custom
  property → `--lily-picker-icon-scale`.
- `themeName` / `localeName` / `sizeName` and the DOM events
  (`themechange`, `share`, `copy`, …) are unchanged — none said "select".
- **`share-picker` loses its naming exception.** Its trigger hook was
  `share-button-trigger` because `.share-button-button` read badly; the
  new name removes the problem, so it is plain `.share-picker-button`.

### NOT renamed

- The **catalog components** `theme-select` and `theme-select-option` —
  two of the 490 in `components.tsv` — keep their names, along with
  their `components/` docs, headless implementations, example demos and
  github.io routes. They are a different thing from the helpers and are
  cross-checked by `bin/test`.

### Changed (themes)

- The 45 `themes/*.css` rename the helper hooks and **delete the
  `:has(> .{helper}-button)` guard**. That guard existed only because the
  helper and the catalog `theme-select` component shared the
  `.theme-select` hook and had to be told apart; distinct names remove
  the collision outright. The catalog component keeps its
  `select.theme-select` form-field rule.

### Changed (versions)

- Every helper package resets to **0.1.0**. A renamed package has no
  history under its new name, so numbering a first release 0.4.0 would
  imply releases that never existed. Nothing had been published, so the
  reset costs nothing. Each CHANGELOG preserves its pre-rename history
  below a provenance heading.

### Fixed

- **`el?.scrollIntoView(...)` guarded the element but not the method.**
  jsdom implements no `scrollIntoView`, so the call threw inside the
  keydown handler of the canonical theme-picker and locale-picker —
  _after_ `activeIndex` was assigned, so 45 unhandled exceptions went by
  with the suite still green and that code path never running. Now
  `el?.scrollIntoView?.(...)`. Same shape as the earlier `CSS.escape`
  bug; the other six catalogs had each independently added the guard.
- Several catalog build scripts hardcoded package names and would have
  silently built nothing after the rename. The nunjucks, html, vue and
  angular scripts now discover packages and **fail loudly** when they
  find none, closing the "published a package with no code in it"
  failure mode for good.

### Verification

- 1231 tests pass with **unchanged counts** in every catalog (127
  svelte, 182 react, 181 vue, 205 angular, 193 html, 221 nunjucks, 122
  blazor). A rename must not move a test count; where one moved it was a
  test asserting the retired `share-button-trigger` exception, rewritten
  rather than deleted.

## Helpers — text-size-select 0.2.0, share-button 0.1.0 — 2026-07-21

### Changed (BREAKING — text-size-select)

- **`text-size-select` is no longer a native `<select>`.** It is now an
  icon button opening a WAI-ARIA APG listbox, matching `theme-select`
  and `locale-select` — it was the last native `<select>` among the
  helpers, so all three now share one shape. Button glyph is `"A"`
  (U+0041): the obvious candidate U+1F5DB has no real glyph in common
  font stacks and falls back to a crude bitmap shape, and it means
  _decrease_ rather than _size_.
- `sizeName` exported to mirror `themeName` / `localeName`. No
  first-visit detection prop — unlike `prefers-color-scheme` and
  `navigator.languages`, the platform exposes no preferred text size.
- Released at **0.2.0** in all seven catalogs.

### Added — `share-button` 0.1.0

- A new helper, and the first that owns an **action** rather than a user
  preference: it applies nothing to the document and persists nothing.
  `AGENTS/helpers.md`'s definition of a helper is widened accordingly.
- A single-glyph button (➤, U+27A4) opens the **native share sheet**
  where the browser provides one, and otherwise a **disclosure list** of
  consumer-supplied destinations plus **copy the page URL**.
- **No social-network endpoints ship with it.** Which networks belong in
  a product is an editorial and privacy decision, share URLs change, and
  networks die. Consumers pass `targets`, each with its own
  `href(url, title, text)`.
- **Destinations are real `<a>` elements, not `role="menuitem"`.** A
  menuitem role strips middle-click, open-in-new-tab and
  copy-link-address — affordances users reach for on exactly this kind
  of list — and the APG suggests a disclosure when items are links. Copy
  is a real `<button>`.
- The copy item renders only when `copyLabel` is supplied; a default
  would be a hardcoded English string. `copiedLabel` /
  `copyFailedLabel` are announced in a polite live region, since copying
  is otherwise silent.
- A dismissed (rejected) native sheet ends the interaction rather than
  falling through to the list, which would resurrect UI the user just
  dismissed.

### Fixed

- **`CSS.escape` threw under jsdom in all three `*-select` helpers.**
  jsdom has no `CSS` object at all, so the call raised inside the keydown
  handler — _after_ `activeIndex` had been assigned, so every suite
  stayed green while that code path never ran. Replaced with
  `document.getElementById`, which needs no escaping for these generated
  ids.
- **`bin/publish-helpers` globbed `lily-design-system-*-select`**, so a
  `share-button` package would have been silently skipped at release.
  The globs are now broad and lean on the existing package.json / dist /
  `*.csproj` guards.
- `text-size-select` had no `CHANGELOG.md` in the svelte, angular, or
  html catalogs; added, so the release record is complete across all
  seven.

### Changed (themes)

- The 45 `themes/*.css` style the `share-button` hooks and carry each
  glyph's optical correction. The four glyphs ink materially different
  fractions of their em box — ◑ 0.842, 🌐 0.996, `"A"` 0.673, ➤ 0.613 —
  so each has its own `--lily-select-icon-scale` (1, 0.845, 1.25,
  1.331). Measured against each icon's _computed_ `font-family` and
  verified in a browser: 0.02px spread across all four.

## Helpers 0.4.0 — 2026-07-20

### Changed (BREAKING — helpers)

- **`theme-select` and `locale-select` are no longer native `<select>`
  elements.** Each is now a single-glyph **icon button that opens a
  listbox** — ◑ (U+25D1) for theme-select, 🌐 (U+1F310 + U+FE0E) for
  locale-select. A single character is the smallest footprint a header
  control can have; it also removes the reason the short-lived 0.3.0
  placeholder-pinning existed, so the `placeholder` prop is **removed**
  from both.
- New DOM: `<div class="{helper}">` wrapping a hidden input (form
  participation, carries `name`), a `<button class="{helper}-button">`
  whose only content is an `aria-hidden` glyph span, and a
  `<ul class="{helper}-list" role="listbox" hidden>` of
  `<li class="{helper}-option" role="option" aria-selected>`. The
  consumer's `children` slot now overrides the **glyph**, not the
  options.
- Keyboard follows the WAI-ARIA APG **listbox** pattern, hand-built
  because the native semantics are gone: ArrowDown / ArrowUp / Enter /
  Space open (ArrowUp starts on the last option), focus moves to the
  list, the cursor is `aria-activedescendant` (mirrored to `data-active`
  for CSS), arrows clamp rather than wrap, Home / End jump, printable
  characters typeahead over labels, Enter / Space select and return
  focus to the button, Escape closes without changing the value, Tab
  closes and moves on.
- `text-size-select` is untouched and remains a native `<select>` at
  0.1.0.
- **`AGENTS/helpers.md` amended.** Its "Native `<select>` only" rule —
  written when the June 2026 migration removed the radio-group picker —
  now describes two deliberate shapes, and records the full keyboard
  contract. The radio-group markup remains forbidden.

### Changed (harmonisation)

- The two helpers are now symmetric, which they had quietly stopped
  being:
  - **Glyph presentation.** The globe gains U+FE0E VARIATION
    SELECTOR-15 so it renders monochrome rather than as a colour emoji,
    matching ◑. Verified in Chromium.
  - **Exported label resolver.** theme-select exports `themeName` to
    mirror locale-select's `localeName`; the internal `labelFor`
    delegates to it, removing the hand-duplicated title-casing rule that
    had spread into examples across every catalog. (Nunjucks cannot
    delegate — its macro title-cases in template syntax — so agreement
    is enforced by a test instead.)
  - **First-visit detection.** theme-select gains `detectFromSystem`
    and the exported `matchSystemTheme`, mirroring
    `detectFromNavigator` / `matchNavigatorLanguage`, at the same
    position in the resolution order:
    `value > storage > detection > defaultValue > fallback > first`.
  - **File shape.** locale-select gains the shared docs it lacked
    (props/attributes reference, styling, custom-rendering, recipes,
    troubleshooting), and its examples are renamed off the stale
    radio-group names (`01-radios`, `02-select`, `03-buttons` — none of
    which had rendered radios, a select, or buttons since June).

### Fixed

- **nunjucks theme-select resolution order.** It resolved
  `storage > value` while every other package resolved `value > storage`;
  Svelte is canonical, so it is flipped. A consumer passing a
  server-resolved `opts.value` from a cookie — precisely what the
  nunjucks catalog exists for — previously had it silently overridden by
  stale `localStorage`. BREAKING for consumers setting both `value` and
  `storageKey`.
- **The `lily-themes` example listed 41 theme slugs and was missing four
  themes** (`adobe-spectrum`, `mozilla-protocol`,
  `united-kingdom-government-digital-service`,
  `united-states-web-design-system`) in every catalog. The prose also
  called them "Lily / DaisyUI themes", wrong on both count and
  attribution — only 35 of the 45 are DaisyUI-derived.

### Changed (themes)

- The 45 `themes/*.css` stylesheets now style the button and popup
  (`{helper}-button`, `{helper}-icon`, `{helper}-list`, plus
  `[data-active]` for the keyboard cursor and `[aria-selected]` for the
  applied value, which are deliberately distinct). Scoped by
  `:has(> .{helper}-button)`, and the native-select rules narrowed to
  `select.theme-select`, so the catalog `theme-select` component — a
  real `<select>` sharing the class hook — keeps its form-field styling.

### Accessibility

- The 0.3.0 placeholder tradeoff is gone; three new ones are documented
  honestly in every package's `docs/accessibility.md` rather than
  glossed: an icon-only control's accessible name rests **entirely** on
  `aria-label`; a hand-rolled listbox has weaker assistive-tech support
  than a native `<select>`, and a native select remains the better
  choice for some audiences; and the glyph is a font-dependent character
  that may substitute or fail to render. The nunjucks packages
  additionally state that **without JavaScript the control cannot be
  operated at all**, which the native `<select>` could.

## Helpers 0.3.0 — 2026-07-20

### Changed (BREAKING — helpers)

- **`theme-select` and `locale-select` are now placeholder-pinned in all
  seven `*-helpers` catalogs.** The closed `<select>` always displays a
  short placeholder word ("Theme", "Locale") instead of the name of the
  active theme or locale, so the control is only ever as wide as that
  word rather than as wide as the longest option. Each renders a leading
  `<option class="{helper}-option {helper}-placeholder" value="">`
  carrying a new optional `placeholder` prop (defaults to the existing
  `label`, so nothing is hardcoded), and pins the element's own selection
  to it — snapping back after every change.
- DOM contract changes accordingly: option count is `choices.length + 1`,
  the first option's value is `""`, and `selectEl.value` no longer tracks
  the selection. The bindable `value` prop remains the single source of
  truth, and every downstream behaviour — managed `<link>` swapping,
  `data-theme`, `lang` / `dir`, persistence, navigator detection,
  `onChange`, initial-value resolution, SSR safety — is unchanged.
- Accessibility tradeoff, documented in each package's
  `docs/accessibility.md`: the active theme/locale is no longer announced
  as the combobox value. Consumers who need it surface it separately via
  visible text or a polite live region driven from `value` / `onChange`.
- `text-size-select` is untouched and keeps ordinary bound-select
  behaviour.

### Changed (themes)

- The 45 `themes/*.css` stylesheets size the two placeholder-pinned
  helpers to the placeholder word — `field-sizing: content` for Chromium
  with a `max-width: 12ch` fallback elsewhere. The rule is scoped with
  `:has(> .{helper}-select-placeholder)` so it targets the helper
  packages only; the catalog `theme-select` component shares the class
  hook but displays its real value and keeps its full-width form-field
  sizing.
- `.locale-select-option` now inherits the select's surface and text
  colours, matching `.theme-select-option`.

The helper packages still ship zero CSS.

### Added (helpers)

- The compensating status region is the default pattern in every helper's
  examples and quick-start: a visible `aria-live="polite"` element
  reporting the active theme/locale, with a `{helper}-status` class hook.
  Placeholder-pinning means the control no longer announces its value to
  a screen reader, and against the WCAG 2.2 AAA target a documented
  suggestion was not enough — the pattern adopters copy now has the
  compensation in it. Each `docs/accessibility.md` keeps an explicit
  "what this does and does not fix" note.

### Fixed (helpers)

- nunjucks: pre-hydration flash when `opts.value` was set. The initial
  value now travels as a `data-lily-*-select-value` attribute instead of
  a server-rendered `selected` on the real option, so the placeholder is
  the only selected option in the server HTML and nothing flashes before
  hydration. Resolution order unchanged.

### Released

- theme-select and locale-select at **0.3.0** in all seven catalogs
  (12 npm `package.json`, 2 NuGet `.csproj`); text-size-select stays at
  0.1.0. Publish with `bin/publish-helpers`.

## 0.6.0 — 2026-07-03

### Added

- **`bin/generate-registries`** — regenerates every example-app catalog
  registry (three `components.ts` files, `ComponentData.cs`, the two
  embedded HTML arrays, the github.io registry, the four
  `component-demos.ts` copies, and the root `index.md` listing) from
  `components.tsv` plus the canonical SvelteKit demo map, so hand-copied
  registries can no longer drift.
- **`bin/check-links`** — verifies every relative markdown link in
  tracked `*.md` files resolves (rsync-synced AGENTS copies excluded);
  exits non-zero on breakage.
- **CI** (`.github/workflows/ci.yml`) — runs `bin/test`,
  `bin/check-links`, a tracked-`node_modules`/`dist` guard, a
  registries-are-freshly-generated check, and the six JS-framework
  helpers test suites.
- **Upstream issue draft** for the Analog SSG route-injection bug
  (`lily-design-system-angular-examples/docs/analog-ssg-issue.md`), with
  the full engineering log relocated from the spec to
  `docs/analog-ssg-notes.md`.

### Changed

- **`bin/test` now fails.** Errors previously printed to stderr while
  the script exited 0; failures now set a flag and the script exits
  non-zero. New consistency checks: duplicate slugs / PascalCase names
  in `components.tsv`, `components/` directory ↔ catalog parity, exactly
  one CSS hook per slug in `css-style-sheet-template.css`, and
  entry-count parity for all twelve example-app registries.
- **Helpers released as 0.2.0** (`theme-select`, `locale-select` — the
  breaking radio-group → native-`<select>` migration, with CHANGELOG
  entries per package and per catalog); `text-size-select` stays 0.1.0
  (born select-based). 14 manifests bumped.
- **`spec/index.md` slimmed from 76 KB to under 40 KB** — the category
  table, naming tables, Reuters detail, demo-strategy table, and
  completed-work history now defer to topic docs and `CHANGELOG.md`;
  §11.4–§11.7 test counts are labelled as dated verification snapshots.

### Fixed

- The new `bin/test` checks immediately caught and led to fixing: a
  duplicate `.date-time-local-input` hook in the CSS template, and
  duplicate single-line `input` / `menu-item` entries in the three
  JS-framework registries.
- `bin/check-links` caught and led to fixing 89 genuinely broken
  markdown links: 75 wrong-depth `components/{slug}` links in Svelte
  component copies, wrong-depth `themes/` and `AGENTS/` links in helper
  docs, a `locales.tsv` link from the relocated locale-select spec, and
  a malformed Mozilla link in `comparisons/index.md`.
- `.claude/settings.local.json` untracked and ignored.
- Verified this release: `bin/test` and `bin/check-links` green; 372 JS
  helper tests, 1,497 Blazor headless bUnit tests, and 51 Blazor helpers
  tests pass.

## 0.5.0 — 2026-07-03

### Added

- **Helpers layer.** Seven `*-helpers` subprojects (Svelte canonical +
  React, Vue, Angular, HTML, Nunjucks, Blazor ports). Each catalog ships
  three native-`<select>` helpers — `theme-select`, `locale-select`,
  `text-size-select` — at v0.1.0 with npm/NuGet manifests, per-catalog
  `build.js` dist pipelines, and per-catalog CHANGELOGs. The helpers were
  first written as radio-group "pickers" (2026-06-05) and converted to
  native `<select>` controls (2026-06-17).
- **Reference themes.** A root `themes/` directory with 45 standalone
  theme stylesheets targeting the Lily™ class hooks: NHS England, NHS
  Scotland, and NHS Wales (patient + practitioner variants), GOV.UK GDS,
  USWDS, Adobe Spectrum, Mozilla Protocol, and general-purpose themes.
- **`bin/publish-helpers`** release script for the 21 helper packages.
- **Root `CHANGELOG.md`** (this file).
- **`AGENTS/helpers.md`** modular reference doc, loaded by `AGENTS.md`
  and synced to the implementation subprojects.

### Changed

- **Spec-driven development moves from `spec.md` files to `spec/`
  directories.** Every unit's specification now lives in a `spec/`
  directory entered via `spec/index.md`: the repo root (the former
  monolithic `spec.md` merged with the topic hub into `spec/index.md`,
  alongside the existing `spec/{topic}/index.md` deep-dives), all 21
  implementation subprojects, all 490 component directories, all 490
  `lilydesignsystem.github.io` route directories, and the 21 helper
  packages (two of which pioneered the layout). 1,022 files moved,
  relative links depth-adjusted, and every `spec.md` reference across
  the repo updated. `bin/test` now verifies `spec/index.md`, and the
  scaffolders create `spec/` directories.
- **Catalog: 492 → 490 components.** The June migration of `theme-picker`
  → `theme-select` had collided with the pre-existing `theme-select`
  (duplicate slug in `components.tsv`, duplicate CSS hooks, duplicated
  registry/demo entries, orphaned `ThemePicker*` implementation files
  whose contents defined a second `ThemeSelect`). Resolved by merging
  onto the native-`<select>` `theme-select` and dropping the radio-group
  picker and its `theme-select-button` companion. Stale files, barrel
  exports, demo-registry entries, e2e specs, and stylesheet rules removed
  across all 14 implementation subprojects and
  `lilydesignsystem.github.io`.
- **Scaffolders match the verification gate.** `bin/create-component-directory`
  and `bin/create-implementation-directory` scaffolded the retired
  `plan.md` / `tasks.md` pair, which `bin/test` rejects; they now scaffold
  the spec layout `bin/test` verifies (`spec/index.md`, per the refactor
  above).
- **`bin/sync` skips helpers catalogs**, which keep their own `AGENTS/`
  conventions rather than the canonical root set.
- Docs harmonised: helpers + themes in the spec architecture (§3),
  `bin/publish-helpers` in tooling (§9), `spec/helpers/` rewritten for the
  `<select>` contracts and the third helper, `spec/theme/` +
  `AGENTS/theme.md` document `themes/`, counts updated everywhere.

### Fixed

- **Example-app catalog registries backfilled to the full 490.** The
  SvelteKit, Next.js, Nuxt, and HTML+CSS+JS apps' components-index
  registries were missing the 80 national personal identifier entries
  (they listed 410); the `lilydesignsystem.github.io` registry was
  missing the five 0.4.0 additions (485). All now match `components.tsv`
  exactly.
- `lily-design-system-nunjucks-headless` no longer tracks its
  `node_modules/` in git (2,553 files untracked); root `.gitignore` gains
  `dist/` and `node_modules/`.
- Six example apps' `nhs.css` dropped a conflicting leftover
  `.theme-select { display: flex }` rule (renamed from the old
  `.theme-picker`); all 45 `themes/*.css` dropped stale `.theme-select` /
  `.theme-select-button` selectors from the picker selector lists;
  the Nunjucks Eleventy app dropped a broken
  `theme-select-button.css` import.
- **Helper docs de-"picker"ed.** ~290 files across the 7 helpers
  catalogs swept from the pre-migration "picker" / radio-group prose to
  the shipped native-`<select>` terminology. The svelte-helpers catalog
  `AGENTS/accessibility.md` and `AGENTS/testing.md` were rewritten from
  the obsolete fieldset+radiogroup contract to the `<select>` contract.
  Intentional usages kept: "OS-native picker" (the mobile select UI),
  consumer-subclass examples (`SwatchPicker extends ThemeSelect`), and
  backlog items proposing future radio-group sibling variants. Stale
  `multiple-pickers` example links fixed (the Svelte example file is
  renamed `multiple-selects.svelte` to match the other six catalogs);
  angular-helpers CHANGELOG package names corrected to the `-select`
  names. All 372 helper tests across the six JS-framework catalogs pass.

## 0.4.0 — 2026-05-30

- Catalog grows from 487 to 492 components: adds `question`, `answer`,
  `addressograph-box`, `barcode-image`, `draft`; rewrites `comment` as a
  generic discourse element; renames `qr-code` → `qr-code-image`.
  All changes propagated across the 14 implementation subprojects and
  `lilydesignsystem.github.io`.
- `AGENTS/components.md` trimmed from 55 KB to 7 KB by pointing at the
  canonical `components.tsv` instead of duplicating the catalog.

## 0.3.0 — 2026-05-30

- Seventh framework pair lands: Angular 20 headless library (verified
  974/974 vitest, ng-packagr APF build, Storybook 492/492) and Angular +
  Analog.js example app (SSG initially blocked upstream; build fixed
  2026-06-15 via Analog 1.22.5 + Vite 6).
- Canonical national-identifier reference files committed at root and
  propagated to all subprojects.

## 0.2.0 — 2026-05-24

- 80 national personal identifier components added across 30+ countries
  (catalog 407 → 492 over Phases 1–2).
- axe-core baseline reaches full pass on every example app; responsive
  viewport sweep ported to all 6 example apps.
- `spec/index.md` replaces the older split `plan.md` / `tasks.md`.

---

Lily™ and Lily Design System™ are trademarks.
