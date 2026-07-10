# Testing

> Lily Design System™ specification — topic doc. All topics: [spec index](../index.md).

**Summary.** Every headless library has a per-framework unit suite asserting DOM and ARIA output, every example app has Playwright e2e plus an axe-core accessibility baseline and a responsive viewport sweep, and six of seven headless libraries ship 490/490 Storybook stories.

## Scope

Covers test coverage across all fourteen subprojects: per-framework headless unit suites, Storybook story coverage, Playwright end-to-end suites on the example apps, the axe-core accessibility baseline, and the responsive viewport sweep. Counts below are quoted from `spec/index.md` (§11.4–§11.7) as of its last update and may evolve; treat `spec/index.md` and the live suites as authoritative.

## Principles and rules

- **Every component is covered in every subproject.** Each headless library's unit suite and each example app's e2e suite reach all 490 catalog components.
- **Tests assert semantics, not pixels.** Headless suites check the rendered DOM and ARIA attributes (label, role, `aria-expanded`, `aria-pressed`, `aria-valuenow`, etc.) — never colour or layout, which belong to the [examples](../examples/index.md) layer.
- **Accessibility is gated, not aspirational.** axe-core runs via Playwright against each example app's full route baseline; the rule set is WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA. WCAG 2.2 AAA remains the [accessibility](../accessibility/index.md) target.
- **Numbers are spec-sourced and evolve.** The counts in the tables below come from `spec/index.md`; verify against the live suites before relying on an exact figure.

## Per-framework headless unit suites

| Library            | Runner       | Count (spec/index.md §11.4)                          |
| ------------------ | ------------ | ---------------------------------------------- |
| svelte-headless    | vitest       | 4,016 cases (407 dual-mirror specs)            |
| react-headless     | vitest       | 2,205 cases                                    |
| vue-headless       | vitest       | 2,187 cases                                    |
| angular-headless   | vitest       | 974 cases across 490 / 490 spec files          |
| blazor-headless    | bUnit        | 1,245 cases                                    |
| nunjucks-headless  | vitest       | 2,393 cases                                    |
| html-headless      | WebdriverIO  | 407 spec files                                 |

## Storybook coverage

Six of seven headless libraries ship Storybook; Blazor deliberately does not (no idiomatic `@storybook/blazor`; bUnit + `dotnet watch` covers exploration). Each story uses the `title: "Headless/{Pascal}"` + single `Default` story shape.

| Library            | Storybook     | Stories     |
| ------------------ | ------------- | ----------- |
| html-headless      | yes (vite)    | 490 / 490   |
| svelte-headless    | yes (vite)    | 490 / 490   |
| react-headless     | yes (vite)    | 490 / 490   |
| vue-headless       | yes (vite)    | 490 / 490   |
| nunjucks-headless  | yes (vite)    | 490 / 490   |
| angular-headless   | yes (webpack) | 490 / 490   |
| blazor-headless    | no            | not planned |

## Playwright e2e on example apps

| App                          | Specs (spec/index.md §11.4) |
| ---------------------------- | --------------------- |
| svelte-sveltekit-examples    | 1,221                 |
| react-next-examples          | 1,221                 |
| vue-nuxt-examples            | 1,221                 |
| blazor-web-examples          | 1,221                 |
| html-css-js-examples         | 814                   |
| nunjucks-eleventy-examples   | 612                   |

## axe-core accessibility baseline

axe-core / Playwright integration runs across all six example apps. Rule set: WCAG 2.0 A+AA, 2.1 A+AA, 2.2 AA (spec/index.md §11.5).

| App                          | Clean | Status       |
| ---------------------------- | ----- | ------------ |
| svelte-sveltekit-examples    | 29/29 | full pass    |
| react-next-examples          | 29/29 | full pass    |
| vue-nuxt-examples            | 29/29 | full pass    |
| blazor-web-examples          | 29/29 | full pass    |
| html-css-js-examples         | 29/29 | full pass    |
| nunjucks-eleventy-examples   | 17/17 | full pass    |

## Responsive viewport sweep

A responsive smoke check (spec/index.md §11.6) runs ~10 representative routes per app across four viewport sizes, asserting: skip-link present, `<main>` and H1 visible, no horizontal page overflow.

| Viewport | Size        |
| -------- | ----------- |
| mobile   | 375 × 667   |
| tablet   | 768 × 1024  |
| desktop  | 1280 × 800  |
| 4K       | 2560 × 1440 |

The sweep is ported to all six example apps with route paths adjusted per app (e.g. nunjucks-eleventy uses trailing-slash `/components/{slug}/` and skips composed-page routes, which it does not build).

## Acceptance criteria
- [ ] Each headless library's unit suite covers all 490 components with its framework runner (vitest / bUnit / WebdriverIO).
- [ ] Headless tests assert DOM + ARIA output, not visual styling.
- [ ] Six headless libraries ship 490/490 Storybook stories; Blazor is intentionally excluded.
- [ ] Each example app has a Playwright e2e suite covering the catalog.
- [ ] axe-core runs against every example app and hits its full route baseline clean (29/29, or 17/17 for nunjucks-eleventy).
- [ ] The responsive viewport sweep runs on all six example apps across the four viewport sizes.
- [ ] `bin/test` passes for required-file coverage across repo, components, and subprojects.

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
