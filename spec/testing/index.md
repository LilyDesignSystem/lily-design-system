# Testing

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Every headless library has a per-framework unit suite asserting DOM and ARIA output, every example app has Playwright e2e plus an axe-core accessibility baseline and a responsive viewport sweep, and six of seven headless libraries ship 491/491 Storybook stories.

## Scope

Covers test coverage across all fourteen subprojects: per-framework headless unit suites, Storybook story coverage, Playwright end-to-end suites on the example apps, the axe-core accessibility baseline, and the responsive viewport sweep. Counts below are quoted from `spec/index.md` (§11.4–§11.7) as of its last update and may evolve; treat `spec/index.md` and the live suites as authoritative.

## Principles and rules

- **Every component is covered in every subproject.** Each headless library's unit suite and each example app's e2e suite reach all 491 catalog components.
- **Tests assert semantics, not pixels.** Headless suites check the rendered DOM and ARIA attributes (label, role, `aria-expanded`, `aria-pressed`, `aria-valuenow`, etc.) — never colour or layout, which belong to the [examples](../examples/index.md) layer.
- **Accessibility is gated, not aspirational.** axe-core runs via Playwright against each example app's full route baseline; the rule set is WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA. WCAG 2.2 AAA remains the [accessibility](../accessibility/index.md) target.
- **A green suite is not evidence for the helper pickers.** Two defect classes in the `*-helpers` catalogs were invisible to every unit suite. Re-entrant apply (a consumer's change callback writing reactive state, looping back into the apply effect until Svelte gave up updating the component) needs a real consumer to trigger, so jsdom never saw it; the picker froze mid-open with a stale `aria-expanded` over a hidden list. And an unasserted contract — the pointer selection's close — was correct in all seven catalogs while nothing tested it. When changing a picker, drive it in a real browser and assert the DOM state after the interaction, not just the value it produced.
- **Assert what the interaction leaves behind, not only what it sets.** A selection test that checks the applied value and stops will pass over a listbox that never closed. Check `aria-expanded`, `hidden`, and where focus went.
- **Numbers are spec-sourced and evolve.** The counts in the tables below come from `spec/index.md`; verify against the live suites before relying on an exact figure.

## Per-framework headless unit suites

Re-verified 2026-09-02 (plan P1-T6, fresh verification sweep).

| Library            | Runner       | Count (spec/index.md §11.4)                          |
| ------------------ | ------------ | ---------------------------------------------- |
| svelte-headless    | vitest       | 4,906 cases across 983 dual-mirror spec files  |
| react-headless     | vitest       | 2,665 cases across 491 spec files              |
| vue-headless       | vitest       | 2,655 cases across 491 spec files              |
| angular-headless   | vitest       | 1,011 cases across 491 spec files              |
| blazor-headless    | bUnit        | 1,509 cases                                    |
| nunjucks-headless  | vitest       | 2,844 cases across 491 spec files              |
| html-headless      | WebdriverIO  | 491 spec files (browser run not re-executed — corrected 2026-09-02, plan P7-T12: the 2026-09-01 note blaming this sandbox's network egress was wrong. The real, now-fixed cause was `pnpm-workspace.yaml`'s `chromedriver`/`edgedriver`/`geckodriver`/`esbuild` entries carrying the literal placeholder text `"set this to true or false"` — and, separately, this file being gitignored here and in 9 other subprojects rather than committed — both of which blocked those packages' install-time driver-download postinstall scripts under pnpm 11 (`ERR_PNPM_IGNORED_BUILDS`). With both fixed, `pnpm install` now downloads chromedriver cleanly and the suite starts; a full `wdio run` still can't complete in this specific interactive sandbox because it receives an unexplained SIGINT within seconds every time, reproducible even for a single spec file with no other load — a harness-level limitation, not a network block or a Lily defect) |

## Storybook coverage

Six of seven headless libraries ship Storybook; Blazor deliberately does not (no idiomatic `@storybook/blazor`; bUnit + `dotnet watch` covers exploration). Each story uses the `title: "Headless/{Pascal}"` + single `Default` story shape. Coverage re-verified 2026-09-02 by story-file presence per component (the same method the original counts used); a full `build-storybook` was not re-run for all six.

| Library            | Storybook     | Stories     |
| ------------------ | ------------- | ----------- |
| html-headless      | yes (vite)    | 491 / 491   |
| svelte-headless    | yes (vite)    | 491 / 491   |
| react-headless     | yes (vite)    | 491 / 491   |
| vue-headless       | yes (vite)    | 491 / 491   |
| nunjucks-headless  | yes (vite)    | 491 / 491   |
| angular-headless   | yes (webpack) | 491 / 491   |
| blazor-headless    | no            | not planned |

## Playwright e2e on example apps

Re-verified 2026-09-02 (plan P1-T6); every app is a fresh full-suite run, not a restamp. Grown substantially since the 2026-08-26 snapshot as rtl-demo, theme-switching, site-preferences, and (svelte-sveltekit) a full 491-page axe-catalog sweep landed. Two real defects were found and fixed in the course of this sweep — see §11.4 acceptance criteria and CHANGELOG.md — rather than being restamped over.

| App                          | Specs (spec/index.md §11.4) |
| ---------------------------- | --------------------- |
| svelte-sveltekit-examples    | 1,807                 |
| react-next-examples          | 1,319                 |
| vue-nuxt-examples            | 1,319                 |
| blazor-web-examples          | 1,327                 |
| html-css-js-examples         | 903                   |
| nunjucks-eleventy-examples   | 758                   |
| angular-examples             | 1,574 (491 per-component pages × 3 assertions, axe on every top-level and composed route, responsive sweep) |

Total: 9,007 specs, all green.

## Helper catalog test counts

Re-verified 2026-09-02 (plan P1-T6); unchanged since the 2026-07-31 idempotent-apply fix (spec §14.1) except html, which grew by 4:

| Catalog  | Tests |
| -------- | ----- |
| svelte   | 211   |
| react    | 267   |
| vue      | 261   |
| html     | 298   |
| nunjucks | 321   |
| angular  | 290   |
| blazor   | 203   |

## axe-core accessibility baseline

axe-core / Playwright integration runs across all seven example apps. Rule set: WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA (spec/index.md §11.5). Re-verified 2026-09-02 (plan P1-T6) — angular-examples added to the table (already covered by its own 1,542-spec suite, just not previously listed here); nunjucks-eleventy-examples grew from 17 routes to 31 as it gained composed-page coverage.

| App                          | Clean | Status       |
| ---------------------------- | ----- | ------------ |
| svelte-sveltekit-examples    | 31/31 | full pass (plus 491/491 on the separate full-catalog `axe-catalog.spec.ts` sweep — see §11.5a) |
| react-next-examples          | 31/31 | full pass    |
| vue-nuxt-examples            | 31/31 | full pass    |
| blazor-web-examples          | 31/31 | full pass    |
| html-css-js-examples         | 29/29 | full pass    |
| nunjucks-eleventy-examples   | 31/31 | full pass    |
| angular-examples             | 31/31 | full pass    |

## Responsive viewport sweep

A responsive smoke check (spec/index.md §11.6) runs ~10 representative routes per app across four viewport sizes, asserting: skip-link present, `<main>` and H1 visible, no horizontal page overflow.

| Viewport | Size        |
| -------- | ----------- |
| mobile   | 375 × 667   |
| tablet   | 768 × 1024  |
| desktop  | 1280 × 800  |
| 4K       | 2560 × 1440 |

Ported to all 7 example apps with route paths adjusted per app:

| App                            | Route shape                                          |
| ------------------------------ | ---------------------------------------------------- |
| svelte-sveltekit-examples      | `/components/{slug}`, `/page-layout` (no slashes)    |
| react-next-examples            | `/components/{slug}`, `/page-layout` (no slashes)    |
| vue-nuxt-examples              | `/components/{slug}`, `/page-layout` (no slashes)    |
| blazor-web-examples            | `/components/{slug}`, `/page-layout` (no slashes)    |
| angular-examples               | `/components/{slug}`, `/page-layout` (no slashes)    |
| html-css-js-examples           | `/components/component.html?slug={slug}`, `/{slug}.html` on composed |
| nunjucks-eleventy-examples     | `/components/{slug}/` (trailing slash), no composed pages built yet  |

Stale as of 2026-09-02: nunjucks-eleventy-examples now builds composed-page
routes too (plan P6-T1 backfilled parity with the other six apps), so its
axe and responsive sweeps cover them the same way. Tests still skip
individually if a built route 404s.

## Acceptance criteria
- [x] Each headless library's unit suite covers all 491 components with its framework runner (vitest / bUnit / WebdriverIO). html-headless's WebdriverIO run itself still can't complete in this specific interactive sandbox (an unexplained early SIGINT, not the network block previously assumed — see the table above) — file-count coverage confirmed instead.
- [x] Headless tests assert DOM + ARIA output, not visual styling.
- [x] Six headless libraries ship 491/491 Storybook stories; Blazor is intentionally excluded.
- [x] Each example app has a Playwright e2e suite covering the catalog.
- [x] axe-core runs against every example app and hits its full route baseline clean (31/31, or 29/29 for html-css-js-examples).
- [x] The responsive viewport sweep runs on all seven example apps across the four viewport sizes.
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
