# Net Promoter Score Picker — Specification

Single source of truth for spec-driven development of the Net Promoter Score Picker component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Net Promoter Score Picker component: a picker for selecting a 0-10 Net Promoter Score.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .net-promoter-score-picker

## Dependencies

- Requires children: net-promoter-score-picker-button

## Companion Component

- net-promoter-score-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="net-promoter-score-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="net-promoter-score-picker"
- [ ] `role="radiogroup"` on the fieldset
- [ ] `aria-label` on the fieldset from the label prop
- [ ] Each radio has `aria-label` with its numeric value
- [ ] Keyboard: Arrow keys navigate between radio buttons (native radio group behavior)
- [ ] Keyboard: Space selects the focused radio button
- [ ] Keyboard: Tab moves focus into/out of the radio group
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .net-promoter-score-picker to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (net-promoter-score-picker.html)
- [ ] Implement HTML headless test (net-promoter-score-picker.test.js)
- [ ] Implement child component: net-promoter-score-picker-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: net-promoter-score-view
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
