# Five Star Rating Picker — Specification

Single source of truth for spec-driven development of the Five Star Rating Picker component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Five Star Rating Picker component: a picker for selecting a 1-5 star rating using radio buttons.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .five-star-rating-picker

## Dependencies

- Requires children: five-star-rating-picker-button

## Companion Component

- five-star-rating-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <div> element with class="five-star-rating-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="five-star-rating-picker"
- [ ] `role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- [ ] `aria-label="..."` -- provides an accessible name for the entire rating group
- [ ] Keyboard: Tab: focus the selected radio (or first if none selected)
- [ ] Keyboard: ArrowDown / ArrowRight: move to next radio button
- [ ] Keyboard: ArrowUp / ArrowLeft: move to previous radio button
- [ ] Keyboard: Space: select the focused radio button
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .five-star-rating-picker to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (five-star-rating-picker.html)
- [ ] Implement HTML headless test (five-star-rating-picker.test.js)
- [ ] Implement child component: five-star-rating-picker-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: five-star-rating-view
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
