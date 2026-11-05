# Testing

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Every headless library has a per-framework unit suite asserting DOM and ARIA output, every example app has Playwright e2e plus an axe-core accessibility baseline and a responsive viewport sweep, and six of seven full-catalog headless libraries ship 609/609 Storybook stories (the Web Components catalog ships 574/574, its full achievable scope). Example apps run their e2e subset in Chromium, Firefox and WebKit since 2026-10-29.

## Scope

Covers test coverage across the nine headless libraries and eight example apps (the Alpine.js library and app included where stated): per-framework headless unit suites, Storybook story coverage, Playwright end-to-end suites on the example apps, the axe-core accessibility baseline, and the responsive viewport sweep. Counts below are quoted from `spec/index.md` (§11.4–§11.7) as of its last update and may evolve; treat `spec/index.md` and the live suites as authoritative.

## Principles and rules

- **Every component is covered in every subproject.** Each headless library's unit suite and each example app's e2e suite reach all 609 catalog components (548 in Web Components); `bin/check-coverage` gates implementation, test and story presence.
- **Tests assert semantics, not pixels.** Headless suites check the rendered DOM and ARIA attributes (label, role, `aria-expanded`, `aria-pressed`, `aria-valuenow`, etc.) — never colour or layout, which belong to the [examples](../examples/index.md) layer.
- **Accessibility is gated, not aspirational.** axe-core runs via Playwright against each example app's full route baseline; the rule set is WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA. WCAG 2.2 AAA remains the [accessibility](../accessibility/index.md) target.
- **A green suite is not evidence for the helper pickers.** Two defect classes in the `*-helpers` catalogs were invisible to every unit suite. Re-entrant apply (a consumer's change callback writing reactive state, looping back into the apply effect until Svelte gave up updating the component) needs a real consumer to trigger, so jsdom never saw it; the picker froze mid-open with a stale `aria-expanded` over a hidden list. And an unasserted contract — the pointer selection's close — was correct in all seven catalogs while nothing tested it. When changing a picker, drive it in a real browser and assert the DOM state after the interaction, not just the value it produced.
- **Assert what the interaction leaves behind, not only what it sets.** A selection test that checks the applied value and stops will pass over a listbox that never closed. Check `aria-expanded`, `hidden`, and where focus went.
- **Numbers are spec-sourced and evolve.** The counts in the tables below come from `spec/index.md`; verify against the live suites before relying on an exact figure.

## Per-framework headless unit suites

Re-run 2026-10-25 (all suites green; 581 components), except `html-headless` (WebdriverIO, last run 2026-10-06). The previous baselines: 2026-10-06 (571 components) and 2026-09-02 (plan P1-T6, 491 spec files per library).

Later suite totals reported with the 2026-10-29/30 work (not a fresh full re-run of every library; source in brackets):
Svelte 3,306 (P18-T11), React 3,513, Vue 4,034, Angular 2,413, Web Components 3,933 and Blazor 2,269 (P14-T4),
Nunjucks 3,569 (P18-T13), Alpine.js 1,389 (P18-T11, P18-T13). The table below is the 2026-10-25 baseline.

`lily-design-system-angular-headless` also runs `prerender/prerender.spec.ts` in `pnpm test`: a real server render of all 609 components, closed and open, in plain Node, because jsdom defines the `document` a prerender does not have (tasks.md P23-T17).

| Library                 | Runner      | Count (spec/index.md §11.4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| svelte-headless         | vitest      | 3,209 cases across 585 spec files (609 components plus two extra `Dialog` specs; one tree, no longer a dual mirror)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| react-headless          | vitest      | 3,407 cases across 583 spec files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| vue-headless            | vitest      | 3,354 cases across 583 spec files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| angular-headless        | vitest      | 1,726 cases across 583 spec files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| blazor-headless         | bUnit       | 2,191 cases                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| nunjucks-headless       | vitest      | 3,547 cases across 584 spec files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| web-components-headless | vitest      | 3,293 cases across 549 spec files (548 components + `index.test.ts`, which pins the registered-element count and drives the built `dist/`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| html-headless           | WebdriverIO | 574 spec files (571 components + the shared `listbox-controller` spec), all passing in real headless Chrome 154 on 2026-10-06 (2026-10-25: 583 spec files in Chrome 155, 581 passed on the full run, then the two failures, `middle-truncation` and `wheel-picker`, were test bugs, fixed and passing: a `waitUntil` that was always true, and a `click()` on the list that selected the option under the pointer) with a matching chromedriver (`wdio.conf.js` must not fall back to a download in a sandbox: point `wdio:chromedriverOptions.binary` at a cached driver). Earlier note, kept for the record: browser run not re-executed — corrected 2026-09-02, plan P7-T12: the 2026-09-01 note blaming this sandbox's network egress was wrong. The real, now-fixed cause was `pnpm-workspace.yaml`'s `chromedriver`/`edgedriver`/`geckodriver`/`esbuild` entries carrying the literal placeholder text `"set this to true or false"` — and, separately, this file being gitignored here and in 9 other subprojects rather than committed — both of which blocked those packages' install-time driver-download postinstall scripts under pnpm 11 (`ERR_PNPM_IGNORED_BUILDS`). With both fixed, `pnpm install` now downloads chromedriver cleanly and the suite starts; a full `wdio run` still can't complete in this specific interactive sandbox because it receives an unexplained SIGINT within seconds every time, reproducible even for a single spec file with no other load — a harness-level limitation, not a network block or a Lily defect) |

Beyond the per-library suites: `bin/check-class-names` (every implementation carries its slug as the first
token of a class list — run by `bin/test` and CI), and the **docs site's** Playwright suite
(`lilydesignsystem.github.io/tests/`, 3,309 passing, 0 failing on 2026-10-25, 581 component spec files — measure with `--reporter=json` and read `stats`; a `| tail` hides the failure count and the exit status).

## Storybook coverage

Six of seven full-catalog headless libraries ship Storybook (the Web Components catalog does too, 574/574, its full achievable scope); Blazor deliberately does not (no idiomatic `@storybook/blazor`; bUnit + `dotnet watch` covers exploration). Each story uses the `title: "Headless/{Pascal}"` + single `Default` story shape. Coverage re-verified 2026-10-30 by story-file presence per component (`bin/check-coverage`: 0 of 609 missing in each of the six); a full `build-storybook` was not re-run.

| Library           | Storybook     | Stories     |
| ----------------- | ------------- | ----------- |
| html-headless     | yes (vite)    | 609 / 609   |
| svelte-headless   | yes (vite)    | 609 / 609   |
| react-headless    | yes (vite)    | 609 / 609   |
| vue-headless      | yes (vite)    | 609 / 609   |
| nunjucks-headless | yes (vite)    | 609 / 609   |
| angular-headless  | yes (webpack) | 609 / 609   |
| blazor-headless   | no            | not planned |

## Playwright e2e on example apps

Re-run in full 2026-10-25 for all seven apps. Earlier: 2026-09-02 (plan P1-T6), every app a fresh full-suite run, not a restamp. Grown substantially since the 2026-08-26 snapshot as rtl-demo, theme-switching, site-preferences, and (svelte-sveltekit) a full 491-page axe-catalog sweep landed. Two real defects were found and fixed in the course of this sweep — see §11.4 acceptance criteria and CHANGELOG.md — rather than being restamped over.

| App                        | Specs (spec/index.md §11.4)                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| svelte-sveltekit-examples  | 1,992 (2026-10-25: 1,984 on the full run, plus 8 fixed afterwards and passing: five `reduced-motion.spec.ts` tests that looked for the docs site's `.component-example-rendered` wrapper instead of `main .card`, and three `calendar-table` baselines of the 90-shot `visual-regression.spec.ts` (plan P7-T5) re-recorded after the auto-sized table columns shifted about 10 px) |
| react-next-examples        | 1,319 (2026-10-25: 1,318 on the full run; the RTL radio-group test failed once and passed 3 of 3 alone: flaky, not changed)                                                                                                                                                                                                                                                        |
| vue-nuxt-examples          | 1,319 (2026-10-25, all passing)                                                                                                                                                                                                                                                                                                                                                    |
| blazor-web-examples        | 1,327 (2026-10-25: 1,326 on the full run; the search-intersection test had a race and now waits for the filtered list; 5/5 on four reruns)                                                                                                                                                                                                                                         |
| html-css-js-examples       | 903 (2026-10-25, all passing)                                                                                                                                                                                                                                                                                                                                                      |
| nunjucks-eleventy-examples | 1,313 (2026-10-25, after `pnpm build`: the suite serves the git-ignored `_site`, and a stale one 404ed the ten newest components) (1,293 on 2026-10-11: `e2e/component-pages.spec.ts` visits every page in `components.tsv`; built and run by CI's `eleventy-example` job)                                                                                                         |
| angular-examples           | 1,574 (2026-10-25, all passing) (491 per-component pages × 3 assertions, axe on every top-level and composed route, responsive sweep)                                                                                                                                                                                                                                              |

Total: 9,747 specs (1,992 SvelteKit plus 7,755 in the other six; 9,542 before the Eleventy and catalog growth, 9,007 on 2026-09-02).

## Helper catalog test counts (historical, 2026-09-03)

The per-framework helper catalogs were dissolved into one subproject per package on 2026-10-10; each package now runs its
own suite (CI job `helper-packages`). The table is kept as the record of 2026-09-03. Re-verified 2026-09-03 as the `motion-picker` helper landed in all seven catalogs (plan P7-T7); prior to that, unchanged since the 2026-07-31 idempotent-apply fix (spec §14.1) except html, which had grown by 4:

| Catalog  | Tests (before motion-picker) | Tests (with motion-picker) |
| -------- | ---------------------------- | -------------------------- |
| svelte   | 211                          | 242                        |
| react    | 267                          | 310                        |
| vue      | 261                          | 309                        |
| html     | 298                          | 346                        |
| nunjucks | 321                          | 381                        |
| angular  | 290                          | 345                        |
| blazor   | 203                          | 234                        |

## Label-pack tests (2026-10-18)

The 64 label packs are tested three ways, all against the real files in `shared/label-packs/`. `bin/check-label-packs` (in `bin/test`)
checks key and placeholder parity with English and that the Svelte and TypeScript-port helpers still have every key a pack holds.
`shared/label-pack.test.ts` and `shared/label-pack-nunjucks.test.ts` build every label from every pack (run with
`pnpm exec vitest run --root ../shared` from any package that has vitest). Each Nunjucks package has a `*.label-pack.test.ts` that renders
its real macro with every pack and finds no placeholder left in a visible label; each Blazor package has a `*LabelPackTests.cs` that builds
its labels record from every pack. See [label-packs](../label-packs/index.md).

## axe-core accessibility baseline

axe-core / Playwright integration runs across all seven example apps. Rule set: WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA (spec/index.md §11.5). Re-verified 2026-10-25 for the six apps whose full suites ran (they include the axe specs), 2026-09-02 for SvelteKit's 31/31 route baseline (plan P1-T6) — angular-examples added to the table (already covered by its own 1,542-spec suite, just not previously listed here); nunjucks-eleventy-examples grew from 17 routes to 31 as it gained composed-page coverage.

| App                        | Clean | Status                                                                                                                                                                                                                                                                                    |
| -------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| svelte-sveltekit-examples  | 31/31 | full pass (plus 581/581 on the separate full-catalog `axe-catalog.spec.ts` sweep, re-run 2026-10-25 after fixing three demos: `go-to-next-section` / `go-to-previous-section` (`aria-label` now equals the visible text) and `overlay-container` (dark text on the scrim) — — see §11.5a) |
| react-next-examples        | 31/31 | full pass                                                                                                                                                                                                                                                                                 |
| vue-nuxt-examples          | 31/31 | full pass                                                                                                                                                                                                                                                                                 |
| blazor-web-examples        | 31/31 | full pass                                                                                                                                                                                                                                                                                 |
| html-css-js-examples       | 29/29 | full pass                                                                                                                                                                                                                                                                                 |
| nunjucks-eleventy-examples | 31/31 | full pass                                                                                                                                                                                                                                                                                 |
| angular-examples           | 31/31 | full pass                                                                                                                                                                                                                                                                                 |

## Responsive viewport sweep

A responsive smoke check (spec/index.md §11.6) runs ~10 representative routes per app across four viewport sizes (plus the 320px and 400%-zoom cases below), asserting: skip-link present, `<main>` and H1 visible, no horizontal page overflow.

| Viewport | Size        |
| -------- | ----------- |
| mobile   | 375 × 667   |
| tablet   | 768 × 1024  |
| desktop  | 1280 × 800  |
| 4K       | 2560 × 1440 |

P15-T8 added further cases to the same `e2e/responsive.spec.ts` in all 7 apps (WCAG 1.4.10 and 1.4.4; rules in [responsive](../responsive/index.md)):

| Case                | Viewport                         | Asserts                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reflow 320          | 320 × 256                        | Every sweep route: skip-link, visible `<main>` and H1, no document-level horizontal scroll.                                                                                                                                                                                                                                                                                                                       |
| 400% zoom emulation | 320 × 256, `deviceScaleFactor` 4 | As reflow 320. Playwright cannot set browser zoom, so this is 1280/4 CSS px at 4x density; it does not detect clipped or overlapping text (only page scroll and H1).                                                                                                                                                                                                                                              |
| text expansion cy   | 320 × 568                        | Every sweep route with `lang="cy"` and every text node in `main`, header and footer lengthened 30% (pseudo-locale, DHCW lessons item 6): no document-level horizontal scroll and no clipped label (an `overflow: hidden`/`clip` element whose `scrollWidth` exceeds `clientWidth` by more than 1px, excluding `text-overflow: ellipsis` and `.middle-truncation*`). Clipping inside scroll containers is allowed. |
| 60-character string | 320 × 568                        | A 60-character unbroken string injected (`page.evaluate`, no demo-page change) into a `summary-list` and a `data-table` in `<main>`: no document-level horizontal scroll (P15-T6).                                                                                                                                                                                                                                |
| grail-layout order  | 320, 768 and 1280 × 800          | On `/components/grail-layout`: DOM order is header, left aside, main, right aside, footer, and no region is visually before its predecessor (below it, or right of it in the same row) (P15-T7). Skipped where no `.grail-layout` renders.                                                                                                                                                                        |

Ported to all 7 example apps with route paths adjusted per app:

| App                        | Route shape                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| svelte-sveltekit-examples  | `/components/{slug}`, `/page-layout` (no slashes)                    |
| react-next-examples        | `/components/{slug}`, `/page-layout` (no slashes)                    |
| vue-nuxt-examples          | `/components/{slug}`, `/page-layout` (no slashes)                    |
| blazor-web-examples        | `/components/{slug}`, `/page-layout` (no slashes)                    |
| angular-examples           | `/components/{slug}`, `/page-layout` (no slashes)                    |
| html-css-js-examples       | `/components/component.html?slug={slug}`, `/{slug}.html` on composed |
| nunjucks-eleventy-examples | `/components/{slug}/` (trailing slash), no composed pages built yet  |

Stale as of 2026-09-02: nunjucks-eleventy-examples now builds composed-page
routes too (plan P6-T1 backfilled parity with the other six apps), so its
axe and responsive sweeps cover them the same way. Tests still skip
individually if a built route 404s.

## Cross-engine e2e: Chromium, Firefox and WebKit (2026-10-29)

Plan P18-T1 to T3. Every example app's `playwright.config.ts` now has `firefox` (Desktop Firefox) and `webkit` (Desktop
Safari) projects beside `chromium`. Chromium still runs every spec. Firefox and WebKit run a `crossEngineSpecs` subset:
`responsive.spec.ts`, `focus-obscured.spec.ts` and `accessibility.spec.ts` in every app, plus `axe-catalog.spec.ts` (all
582 component pages; under two minutes per engine, so not left Chromium-only) and `overflow-navigation.spec.ts` in the
SvelteKit app, and `overflow-navigation.spec.ts` in the Blazor app. Playwright 1.64.1 in every app.

Results of the subset, last run per app, Playwright `json` reporter (passed / failed / skipped):

| App                        | Chromium    | Firefox     | WebKit      |
| -------------------------- | ----------- | ----------- | ----------- |
| html-css-js-examples       | 105 / 0 / 0 | 105 / 0 / 0 | 105 / 0 / 0 |
| svelte-sveltekit-examples  | 127 / 0 / 0 | 127 / 0 / 0 | 127 / 0 / 0 |
| svelte axe-catalog         | 582 / 1 / 0 | 582 / 1 / 0 | 582 / 1 / 0 |
| react-next-examples        | 121 / 0 / 0 | 121 / 0 / 0 | 121 / 0 / 0 |
| vue-nuxt-examples          | 121 / 0 / 0 | 121 / 0 / 0 | 121 / 0 / 0 |
| angular-examples           | 121 / 0 / 0 | 121 / 0 / 0 | 121 / 0 / 0 |
| blazor-web-examples        | 127 / 0 / 0 | 127 / 0 / 0 | 127 / 0 / 0 |
| nunjucks-eleventy-examples | 205 / 0 / 0 | 205 / 0 / 0 | 205 / 0 / 0 |

No test is skipped by engine. The SvelteKit and Blazor rows include the six overflow-navigation tests. Chromium's full
suites were also rerun for the apps whose routes changed: html-css-js 939 passed, nunjucks-eleventy 1,395 passed.

**The one failure** (fixed afterwards: the canonical `component-demos.ts` entry now names the switch with
`aria-label="Dark mode"` and puts no text inside it, as its contract says, P18-T1; the axe catalog row above was not re-run
for this note) was `/components/switch-button` in the axe catalog, in all three engines, so it is not an engine
difference: the canonical demo (`component-demos.ts`) then put the text "Dark mode" inside the switch, and the theme drew
it in `--color-primary-content` (white) on the `--lily-surface-sunken` track (1.38:1). The html-css-js `/settings-page` had the same markup and is fixed (below).

**What the three engines found, all fixed in the apps' own routes, CSS or specs:**

- **WebKit, focus-obscured (all apps):** WebKit keeps the macOS default, where Tab skips links and Option+Tab reaches them.
  The spec now presses Alt+Tab in WebKit; the assertion is unchanged.
- **Firefox, axe `target-size` on the SvelteKit `/tabbed-interface`:** the one-letter B, I and U toggles were 15 to 22 CSS px
  wide. Chromium and WebKit passed them on the spacing exception; Firefox's tighter spacing did not. The route now gives
  them a 24 by 24 px minimum (WCAG 2.5.8), in every engine.
- **Firefox, intermittent axe `color-contrast` (React `/book-an-appointment`, `/task-management`):** axe sampled a button
  mid-way through the themes' 120 ms colour transition (`#cecece` on `#026ab8`). Every app's `accessibility.spec.ts` now
  waits for running animations to finish (up to 5 seconds) before axe runs.
- **All engines, axe, html-css-js and nunjucks-eleventy:** `label-content-name-mismatch` (WCAG 2.5.3) on the `/tabbed-interface`
  "Unread" tab, whose visible text is "Unread 3" (now `aria-label="Unread 3"`), and on the Nunjucks header logo link, whose
  `aria-label` did not contain its visible text "Lily Nunjucks example" (the label is removed, so the visible text is the
  name); `color-contrast` on the html-css-js `/settings-page` switch with text inside it (the text is now a label beside
  the switch, as in the SvelteKit page). These failed in Chromium too, so the 2026-10-25 baseline was not current.
- **Chromium, html-css-js focus-obscured:** the `networkidle` wait timed out once under load (load average above 100).
  That app does not hydrate, so the spec now relies on the load event `goto` waits for.

**Overflow navigation (P18-T2, P18-T3).** `/demos/overflow-navigation` in the SvelteKit app renders the real
`NavigationMenu` with `overflow` and `moreLabel="More"`; `/demos/overflow-navigation` in the Blazor Web app renders the
Blazor component with `Overflow`, whose `NavigationMenu.razor.js` loads through JS interop after the first interactive
render. Both have eight links (Home, Appointments, Prescriptions, Test results, Messages, Health record, Settings, Help)
and the same `e2e/overflow-navigation.spec.ts`, which passes in Chromium, Firefox and WebKit in both apps. Measured, the
same in all three engines and both apps, with the default theme:

| Viewport | List width | Links in the row | In "More"               |
| -------- | ---------- | ---------------- | ----------------------- |
| 1200 px  | 960 px     | 8 (no More item) | none                    |
| 420 px   | 372 px     | 3                | the last five, in order |
| 320 px   | 272 px     | 2                | the last six, in order  |

The link widths are 51, 116, 110, 96, 87, 114, 69 and 39 px with an 8 px gap; the More item is 61 px. The earlier claim of
6, 4 and 3 links at these widths (DHCW lessons, item 2) used another link set, which is not recorded, so it is not
reproduced; the counts depend on the links and the theme. The spec also asserts: the links left in the row are on one
line; Enter opens the More list (`aria-expanded="true"`); Escape on a moved link closes it and focuses the button; the
opened list is `position: static` and the paragraph below moves down by at least the list's height and starts below it;
and with JavaScript disabled at 320 px, no document-level horizontal scroll, the More item hidden and all eight links
visible. In Blazor the wait for the More button's `aria-controls`, which only the JS module sets, shows that the interop
ran.

**Not verified:** a click outside closing the list (unit-tested per library, not in a browser); Firefox and WebKit for
the specs outside the subset (component pages, book-an-appointment, RTL, theme switching, visual regression); real
Safari or Firefox releases (Playwright's builds, macOS only); Windows and Linux. Local note: on this machine Playwright's
Firefox could not start ("Could not find profile folder") because macOS blocked the shell from
`~/Library/Application Support/Firefox`; the runs used a wrapper outside the repo that starts the same Firefox build
with `-app` and its own profile name. CI on Linux does not need it.

## Pattern testers

(2026-11-03, P23-T1.) One interaction contract, run against every catalog, in place of hand-ported keyboard tests. The steps are data in
[`shared/pattern-contracts.json`](../../shared/pattern-contracts.json), so two drivers run the same contract: `shared/pattern-tester.ts` over
the DOM and `shared/PatternTester.cs` over bUnit. Test files import them straight from `shared/`: tests do not ship, so nothing is copied.

```ts
await runPattern("picker-listbox", { root, hook: "theme-picker" });
```

| Contract            | Runs against                                                         | Catalogs | Runs |
| ------------------- | -------------------------------------------------------------------- | -------- | ---- |
| `picker-listbox`    | `theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker` | 8        | 32   |
| `picker-disclosure` | `share-picker`, `link-picker`                                        | 8        | 16   |
| `tabs`              | `tab-bar`                                                            | 8        | 8    |
| `menu`              | `menu`                                                               | 8        | 8    |
| `menubar`           | `menu-bar`                                                           | 8        | 8    |
| `tree`              | `tree-list`                                                          | 8        | 8    |
| `menu-submenu`      | `menu`                                                               | 8        | 8    |
| `menubar-submenu`   | `menu-bar`                                                           | 8        | 8    |
| `combobox`          | `combobox`                                                           | 8        | 8    |
| `command`           | `command`                                                            | 8        | 8    |
| `toolbar`           | `action-bar`, `task-bar`                                             | 8        | 16   |
| `action-group`      | `action-group`                                                       | 8        | 8    |
| `radio-group`       | `segment-group`                                                      | 8        | 8    |
| `splitter`          | `splitter`, `split-view`                                             | 8        | 16   |
| `tree-popup`        | `cascader`, `tree-select`; not Alpine, whose `treeCore` has its own tests | 8   | 16   |
| `mentions`          | `mentions-input`                                                     | 8        | 8    |
| `cropper`           | `image-cropper`                                                      | 8        | 8    |
| `dialog`            | `dialog`, `drawer`, `file-dialog`, `sheet`, `slide-out-drawer`       | 7        | 35   |
| `grid`              | the `data-grid` helper                                               | 8        | 8    |
| `grid-actions`      | the `data-grid` helper; Alpine, which has no editor, with `noEditing` | 8        | 8    |
| `autosuggest`       | `autosuggest`                                                        | 8        | 8    |
| `tree-expand`       | `tree-list-item`, or `tree-list` where the tree owns the keys        | 8        | 8    |

- A file named `*.pattern.test.*`, `*.pattern.spec.ts` or `*PatternTests.cs` holds the run.
- The `tabs`, `menu`, `menubar` and `tree` contracts carry their own fixture: the tester puts it into an empty root, so each
  catalog proves the container's keys on the same items. The item components (`tab-bar-button`, `menu-item`) keep their own
  tests. `tree` covers moving between visible items. `tree-expand` covers ArrowRight and ArrowLeft, on the item in Svelte, React, Vue and
  Angular and on the tree in HTML, Web Components, Alpine and Blazor. It found that Web Components and Blazor had neither key, though
  the contract promised them. Both now do. In Blazor, `TreeList.razor.js` owns the keys and sends `toggle` to `TreeListItem`, which gained
  `Expanded`; the module and the item are tested apart, and `e2e/keyboard.spec.ts` runs them together.
- HTML runs in a real browser through `shared/pattern-browser.cjs`; Blazor's focus contracts run from `tests/js/`, against its
  `.razor.js` modules, because bUnit has no focus. Alpine also runs all four, though Core does not count it.
- `shared/menu-keys.ts` is the one menu module: type-ahead, activation, one tab stop and submenus. Svelte, React, Vue, Angular and Web Components import it; `bin/sync-shared-modules` strips its types for Nunjucks, Alpine and Blazor (`Menu.razor.js`, which `MenuBar` now loads too) and inlines it in the HTML snippets. A tree takes `treeItemKey` from it, while Alpine keeps its own type-ahead, which matches a typed word. The contract cannot press a native button, so an item that is one passes `clicked` by being one.
- **Nunjucks's macros are markup only**, so its keys are optional client modules the consumer loads: `combobox/combobox.js`, `autosuggest/autosuggest.js`, `tree-list/tree.js`, and `tab-bar/tab-bar.js`, `menu/menu.js` and `menu-bar/menu-bar.js` over `components/roving.js`. Every contract runs there but `dialog`.
- `time-zone-picker` is not covered: every label starts "UTC", so the fixture rule for typeahead cannot hold.
- bUnit has no browser focus, so the C# driver skips `focus` expectations; the DOM driver runs them in the other seven catalogs.
- `bin/generate-core` counts a `runPattern` or `PatternTester.Run` call as both a key event and an ARIA assertion for criterion (a).
- Proved to fail: removing `aria-selected` from `theme-picker` in each of the eight ports fails its run; breaking `End` in `tab-bar` fails in all eight ports that have one (Alpine in place of Nunjucks).
- **A contract is not a conformance claim.** `lily-design-system-pattern-testers/index.md` lists what each one covers and leaves out.
- `combobox` is the APG pattern with list autocomplete and manual selection, in all eight catalogs and Alpine: `shared/combobox-keys.ts` in Svelte, React, Vue, Angular and Web Components, `shared/combobox-client.js` in Nunjucks and Blazor, inlined in the HTML snippet, and `lilyCombobox` in Alpine. The tester installs three options into an empty list. Bare-DOM duplicates were accepted over a build step, since this contract holds them to one behaviour. Blazor's module runs the keys from `tests/js/`, and the C# driver stops at the first Alt step and proves the wiring and Escape; `ComboboxTests` proves the parameters, and `e2e/keyboard.spec.ts` the wiring.
  `autosuggest` covers the same keys, for suggestions passed as data. `dialog` opens through each catalog's own way of opening it;
  where the engine has no `showModal` (jsdom) the driver stubs it the way a browser behaves, and the Tab trap and inert page stay the
  browser's part. `grid` runs against the `data-grid` helper because no headless component has a cell cursor: `grid` and `data-table`
  are passive. Row 0 is the header row. `grid-actions` drives sorting, editing and selection by key; it found HTML, Web Components and Nunjucks dropping focus to the page on Enter or Space, since rebuilding the table lost the cell. Alpine also runs
  all three (`dialog` on `dialog` only). Nunjucks runs `grid` and `combobox`, but has no client behaviour for `dialog`.
- **Escape belongs to the innermost widget.** The `combobox` contract found that Svelte, React, Vue and Angular called `preventDefault`
  on Escape while the list was closed, and that Alpine did not call it while open. The `dialog` contract found that every overlay closed
  on an Escape something inside it had already handled, so an open combobox inside a dialog closed both. Both are fixed: a widget
  prevents the default only when it acted, and an overlay ignores a prevented Escape. Chromium confirms a prevented keydown stops a
  native `<dialog>` closing. It also found `file-dialog` without `aria-modal` in five catalogs.
- **Blazor and Escape.** A .NET handler cannot read `defaultPrevented`, so `Drawer.razor.js`, which every modal overlay opens through, stops a prevented Escape at the `<dialog>`, before Blazor's document-level delegation. The C# handler then never sees it. A prevented Escape raises no native `cancel`. `tests/js/drawer-escape.test.mjs` proves the guard, and `e2e/keyboard.spec.ts` proves it in Chromium, with a combobox in a dialog; removing the guard fails that case. The C# driver still skips `pressHandled`, `prevented`, focus and `showModal`, and proves the ARIA, that Escape and `cancel` close, and where the grid's one tab stop goes.
- **Blazor's two halves together.** bUnit runs no JS and `tests/js` runs no C#, so `/demos/keyboard` and `e2e/keyboard.spec.ts` run `Combobox`, `TreeList` and the Escape guard end to end with real keys.
- Proved to fail: removing the guard fails `dialog` in six ports and `combobox` in five; breaking `ArrowDown` in `grid-navigation.ts`
  fails `grid` in eight; breaking a key fails `tree-expand` in seven and `autosuggest` in five; breaking the wrap or Alt+ArrowDown fails `combobox` in eight, and Alpine's closed ArrowUp, which the contract cannot see because Alpine filters to the chosen text, fails its own test. Blazor's C# copy of that module, and
  `autosuggest` in HTML, Alpine and Blazor, were not mutated.
- **For adopters:** `lily-design-system-pattern-testers`, `@lilydesignsystem/pattern-testers` 0.1.0, built but not yet published. `bin/sync-shared-modules` copies the three files into it, and `bin/publish-helpers` and `bin/verify-published` include it. The bUnit driver is not in it.

## Development warnings

(2026-11-03, P23-T2.) `shared/dev-warning.ts`, copied by `bin/sync-shared-modules`, gives `warnMissingName` and `warnDeprecated`. A message is
for the developer, so it is English and exempt from the no-hardcoded-strings rule. It prints once.

- **When it prints:** only where a bundler replaces `process.env.NODE_ENV` with something other than `production`. With no bundler, the read
  throws and the module is silent.
- **Off switch:** `globalThis.lilyWarnings = false`.
- **Production cost:** silent, but about 275 minified bytes stay in a bundle, because the guard runs inside a function so that it
  cannot throw. Each component that warns adds its call, about 50 more minified bytes (esbuild, a 24-letter name).
- **Coverage:** every interactive component with a required `label` in Svelte, React, Vue and Angular, 168 in all, less the
  ones below. `dev-warning.sweep` tests three shapes in each framework: a missing name warns, and a `label` or an
  `aria-labelledby` does not (Angular proves the `label` half and the missing case). `bin/check-dev-warnings` (in `bin/test`)
  fails on a component that does not call it.
- **Exceptions:** none. `bin/check-dev-warnings.allow.json` is empty: on 2026-11-04 the maintainer decided `label` is required, as each
  component's `AGENTS.md` says, in the seven Svelte, five React and five Vue ports whose types said optional. Svelte's `go-to-top` now renders it as
  `aria-label`, as the other ports do.
- Web Components already throws on a missing label. Blazor has `[EditorRequired]`.
- **HTML, Nunjucks and Alpine** have no component code to hook, so `shared/page-check.js` looks at the rendered page instead:
  `checkPage()` warns about each interactive element with no accessible name, and `findUnnamed()` returns them. It is opt-in, so it costs
  nothing unless a page loads it, and it honours `lilyWarnings = false`. A placeholder does not count as a name. `bin/sync-shared-modules`
  copies it to `components/page-check.js` in HTML and Nunjucks and `page-check.js` in Alpine. `e2e/page-check.spec.ts` runs it over the
  HTML app's 17 composed pages and 609 component pages; it found 11 demos with no name, all fixed. The other P23-T7 rules are still to do.

## Content Security Policy

(2026-11-03, P23-T3.) The HTML example app runs under this policy in `e2e/csp.spec.ts`, which fails on any `securitypolicyviolation`:

```text
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'
```

It covers all 16 composed pages, the catalog and every component page, and opens the page-header pickers. A control test proves the policy is applied.

- **Result.** The picker helpers needed no change. All 13 first-run violations were the demo app's own inline scripts and style attributes,
  now moved to `assets/js/pages/` and `app-shell.css`.
- **Component pages.** The catalog page and all 609 `/components` pages run under it too. Their scripts and data moved to
  `assets/js/pages/`, which the generators now write. Nineteen demos hold `style=`: the page renames that attribute inside real tags and
  applies it through the CSSOM, and a test proves both the applied style and the unchanged code sample. No demo has an inline event handler.
- **The no-flash snippet.** Serve it as a file, as `assets/js/theme-boot.js` does, or add its hash to `script-src`.
- **Known limitation: `style=`.** Ten components are sized by a prop, and the catalogs differ. The table and what an adopter does about it are
  in [docs/content-security-policy.md](../../docs/content-security-policy.md). Chromium confirms `style-src-attr 'unsafe-inline'` restores the
  attribute while a `<style>` element stays blocked. Maintainer decision, 2026-11-04: keep the attribute. Moving to the CSSOM would lose the layout until a script
  runs, and static markup has no script. The catalogs are unchanged.

## Acceptance criteria

- [x] Each headless library's unit suite covers all 609 components (548 in Web Components) with its framework runner (vitest / bUnit / WebdriverIO). html-headless's WebdriverIO run itself still can't complete in this specific interactive sandbox (an unexplained early SIGINT, not the network block previously assumed — see the table above) — file-count coverage confirmed instead.
- [x] Headless tests assert DOM + ARIA output, not visual styling.
- [x] Six headless libraries ship 609/609 Storybook stories and Web Components 574/574; Blazor is intentionally excluded.
- [x] Each example app has a Playwright e2e suite covering the catalog.
- [x] axe-core runs against every example app and hits its full route baseline clean (31/31, or 29/29 for html-css-js-examples).
- [x] The responsive viewport sweep runs on all seven example apps across the four viewport sizes, and in Chromium, Firefox and WebKit (P18-T1).
- [ ] Every component with a keyboard contract has a test that sends its keys: 260 gaps listed in `bin/check-coverage.keys-allow.json` (P12-T5a).
- [ ] The Alpine.js headless library is in `bin/check-coverage` and `bin/check-class-names`.
- [x] `bin/test` passes for required-file coverage across repo, components, and subprojects.
- [x] Helper-picker interaction contracts are asserted end-to-end, not implied: every pointer selection test checks `aria-expanded` and the list's `hidden`, and the apply path is asserted to fire its change callback once per applied change.

## Related topics

- [accessibility](../accessibility/index.md) — the WCAG 2.2 AAA target and ARIA patterns these suites assert.
- [examples](../examples/index.md) — the apps Playwright, axe-core, and the responsive sweep run against.
- [tooling](../tooling/index.md) — `bin/test` required-file verification and Storybook generation.
- [headless](../headless/index.md) — the markup/ARIA contract the unit suites verify.

## Sources

- [spec/index.md](../index.md) — §11.4 (test suites), §11.5 (axe-core), §11.6 (responsive sweep), §11.7 (Storybook)
- [bin/test](../../bin/test) — required-file verification
- [AGENTS/accessibility.md](../../AGENTS/accessibility.md) — accessibility testing guidance

---

Lily™ and Lily Design System™ are trademarks.
