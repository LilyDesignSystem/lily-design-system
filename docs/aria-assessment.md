# WAI-ARIA assessment of the full catalog — Lily Design System™

_Measured across all 609 components, with the tables generated from the tests ([P25](../tasks.md)). Per-component data: [aria-assessment.tsv](aria-assessment.tsv). Work
that follows from it: [tasks.md](../tasks.md) Phase 25._

**Verdict: Lily is not WAI-ARIA compliant, and no component can yet be shown to be.** No screen reader has been used on any component, and most have incomplete keyboard or ARIA test evidence, per the tables below, which `bin/generate-core` keeps current. WAI-ARIA has no certification; this is a
self-assessment of evidence, not an audit.

## Result

Each component is in the first band it falls into, so the bands add up to 609.

<!-- BEGIN generated: bin/generate-core -->
| Band                              | Components | What it means                                                                      |
| --------------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| 1. axe failure                    | 0          | Listed in `e2e/axe-sweep.allow.json`: a WCAG A or AA rule fails on its Nunjucks page |
| 2. Key evidence incomplete        | 119        | Its contract names keys, and fewer than eight libraries have a test that sends one |
| 3. ARIA evidence incomplete       | 311        | Its contract names ARIA, and fewer than eight libraries assert it                  |
| 4. Automated evidence complete    | 179        | Nothing above. This is a floor, not a pass                                         |

| Measure                                                   | Result     |
| --------------------------------------------------------- | ---------- |
| Key contracts with a key test in all eight libraries      | 38 of 157  |
| Custom-key widgets (arrows, Home, End, Escape), all eight | 31 of 88   |
| ARIA contracts asserted in all eight libraries            | 141 of 525 |
| End-to-end evidence in Chromium, Firefox and WebKit       | 45 of 609  |
| No keyboard or ARIA contract at all                       | 73 of 609  |
<!-- END generated: bin/generate-core -->

The custom-key row matters most: those are the widgets where script, not the browser, provides the behaviour.

## Method

- **Test evidence:** `bin/generate-core --assess <file>`, the same file-level check as Lily Core criteria (a) and (b). A contract counts only when
  `## Keyboard` names a key or `## ARIA` names `aria-` or a role, which is stricter about what counts as a contract than `bin/generate-core` itself.
- **axe:** axe-core with the WCAG 2.0 to 2.2 A and AA tags and best-practice, in Chromium, on each component's demo section in the built Nunjucks app.

## What this does not show

- **Evidence is not behaviour.** A test file that sends a key and asserts an attribute counts, even if it tests something else. A passing band is a floor.
- **axe saw one catalog, in one state.** It ran on Nunjucks only, on the default theme, with widgets closed. It cannot judge keyboard use or announcements,
  and automated tools find only part of WCAG. Nothing here says the other seven catalogs are clean; findings marked "contract" were checked by reading
  the named catalogs, not by running axe on them.
- **Colour contrast is unconfirmed.** Ten pages reported it, but this run did not wait for theme transitions, which is a known false positive. See P25-T9.
- **Stale demos can hide problems.** Some demo pages show an empty component, so axe had little to judge.

## axe findings

**Contract** means the markup a consumer gets is wrong, so the fix is to the component and its contract. **Demo** means the example page is wrong.
**Check** means it has not been traced.

| Rule                                            | Components | Cause    | Finding                                                                                                                                                                           |
| ----------------------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aria-required-attr`                            | 2          | Contract | `cascader` and `tree-select`: `role="combobox"` without a required attribute. Read in Svelte too                                                                                  |
| `aria-allowed-attr`                             | 1          | Contract | `slider-button`: `aria-valuenow` on `role="button"`                                                                                                                               |
| `aria-dialog-name`                              | 1          | Contract | `contextual-help`: the panel is a `role="dialog"` with no name, and only the trigger is named. Read in Svelte too                                                                 |
| `aria-input-field-name`                         | 2          | Check    | `mentions-input`, `transfer-list`: a `role="listbox"` with no name                                                                                                                |
| `listitem`, `aria-allowed-role`                 | 2          | Contract | `chat-list`, `chat-nav`: Nunjucks puts `role="log"` on the `<ol>`, which removes the list. Svelte has no role there, so this is also a port difference                            |
| `aria-valid-attr-value`                         | 3          | Check    | `menu-bar`, `menu-bar-button`: `aria-controls` names a menu that is not on the page. `scroll-bar`: its value                                                                      |
| `button-name`, `label`                          | 5          | Check    | `date-time-now-input`, `autosuggest`, `editable-form`, `input-group`, `text-area-input-with-character-counter`                                                                    |
| `target-size`                                   | 1          | Check    | `tree-nav`: links smaller than 24 by 24 CSS pixels in the default theme                                                                                                           |
| `aria-required-children`                        | 1          | Demo     | `command`: its listbox is empty on the page                                                                                                                                       |
| `list`, `listitem`, `definition-list`           | 5          | Demo     | `document-list`, `section-list`, `description-list` and items: placeholder text directly in the list. `timeline-list-item` has no list around it                                  |
| `aria-required-parent`, `aria-valid-attr-value` | 1          | Demo     | `tab-panel`: a loose `role="tab"` outside a tablist, on the page                                                                                                                  |
| `landmark-*`, `empty-heading`                   | 3          | Demo     | `grail-layout` nests a second `<main>` in the page's; `newsletter-signup` shares a landmark name; `headline` shows an empty heading                                               |
| `heading-order`                                 | 15         | Check    | Best practice, not WCAG. Mostly the demo's heading levels                                                                                                                         |
| `color-contrast`                                | 10         | Check    | `alert`, `coachmark`, `download-button`, `government-banner`, `government-identifier`, `panel`, `split-button`, `sticky-promo-banner`, `tag`, `watermark`. Unconfirmed, see above |

## Widgets with the least key evidence

Of the 86 custom-key widgets, these have a key test in at most one library.

- **None:** `carousel`, `navigation-menu`.
- **One:** `calendar-table-td`, `coachmark`, `context-menu-item`, `date-range`, `date-time-local-input`, `date-time-now-input`, `menu-bar-button`, `menu-group`, `menu-item`,
  `multi-select-with-extras`, `overlay-container`, `popconfirm-dialog`, `popover`, `range-input`, `red-amber-green-picker`, `red-orange-yellow-green-blue-picker`, `scroll-area`,
  `search-input`, `segment-group-item`, `select-with-extras`, `sticky-promo-banner`, `theme-select`, `theme-select-option`, `time-picker-input`, `tool-bar-button`, `tooltip`, `week-input`.

## Reproduce

`bin/generate-core` writes the tables above and `aria-assessment.tsv` from the tests, and `--check` (in `bin/test`) fails when they are stale. Band 1 comes from
`lily-design-system-nunjucks-eleventy-examples/e2e/axe-sweep.allow.json`; that spec runs axe on all 609 pages, with popups forced open, and contrast in the default and dark themes.

---

Lily™ and Lily Design System™ are trademarks.

## What axe cannot see

axe tests what a demo renders, so a clean page does not clear a component. Rendering every Nunjucks macro with a `label` (2026-11-06)
found 30 components whose root is a `<div>` or `<span>` with `aria-label` and no role, the defect `aria-prohibited-attr` reports. Their
demos pass no label, so axe never saw it: `address-input`, `addressograph-box`, `affix`, `ai-label`, `announcement-banner`, `answer`, `badge`, `banner-box`, `character`, `clamp-text`, `comment`, `container-with-fixed-width`, `container-with-fluid-width`, `description-list-item`, `draft`, `flair`, `flex-stack`, `grid`, `inset-text`, `masonry`, `medical-banner-box`, `medical-banner-box-for-advice`, `phase-banner`, `postal-code-view`, `question`, `scroll-area`, `share-page`, `split-view`, `status-tag`, `success-panel`. After fixes in every catalog, 19 rendered components remain: Angular 14, Web Components 5, Nunjucks 3, React 2, Vue 2, Svelte none. 3 Angular components still do not render in the sweep. Blazor and HTML are not rendered: their roots were read from source. Each rendered catalog now has a `generic-name` test with an allow-list that may only shrink, so a new case fails. Tracked as [P25-T14](../tasks.md).
