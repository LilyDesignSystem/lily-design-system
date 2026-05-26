# Five Face Rating Picker Button — Specification

Single source of truth for spec-driven development of the Five Face Rating Picker Button component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Five Face Rating Picker Button component: a picker button for selecting a 1-5 satisfaction rating using face labels.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .five-face-rating-picker-button

## Dependencies

- Requires parent: five-face-rating-picker

## Approach

1. Use semantic <button> element with class="five-face-rating-picker-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="five-face-rating-picker-button"
- [ ] `aria-pressed` -- indicates whether this button is the currently selected rating (`true` when selected, `false` otherwise)
- [ ] `aria-label` -- provides the accessible name for the button (e.g., "Very good")
- [ ] Keyboard: Tab: Focus the button
- [ ] Keyboard: Enter / Space: Activate the button to select this rating
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .five-face-rating-picker-button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (five-face-rating-picker-button.html)
- [ ] Implement HTML headless test (five-face-rating-picker-button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
