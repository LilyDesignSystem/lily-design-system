# Angle Slider Range Input — Specification

Single source of truth for spec-driven development of the Angle Slider Range Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Angle Slider Range Input component: a range input for selecting an angle in degrees.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .angle-slider-range-input

## Approach

1. Use semantic <input> element with class="angle-slider-range-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="angle-slider-range-input"
- [ ] `role="slider"` (implicit from input[type="range"])
- [ ] `aria-label` from label prop
- [ ] `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- [ ] `aria-valuetext` for human-readable angle (e.g., "90°")
- [ ] Keyboard: Arrow Right/Up: Increase value by step
- [ ] Keyboard: Arrow Left/Down: Decrease value by step
- [ ] Keyboard: Home: Set to minimum
- [ ] Keyboard: End: Set to maximum
- [ ] Keyboard: (All handled natively by input[type="range"])
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .angle-slider-range-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (angle-slider-range-input.html)
- [ ] Implement HTML headless test (angle-slider-range-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
