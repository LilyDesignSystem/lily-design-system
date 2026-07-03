# SliderButton — Specification

Single source of truth for spec-driven development of the SliderButton component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the SliderButton component: a button with a slider that the user needs to slide to confirm.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .slider-button

## Approach

1. Use semantic <button> element with class="slider-button"
2. Add internal slider track with drag interaction
3. Add ARIA attributes for accessibility
4. Implement keyboard navigation
5. Add vanilla JavaScript for interactive behavior
6. Implement in HTML headless (plain HTML + vanilla JS)
7. Implement in Svelte headless (Svelte 5 + runes)
8. Implement in React, Vue, Blazor headless
9. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="slider-button"
- [ ] `aria-label` -- describes the confirmation action
- [ ] `aria-valuenow` -- current slider position percentage
- [ ] Keyboard: Tab, Arrow Right/Left, Enter
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .slider-button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (slider-button.html)
- [ ] Implement HTML headless test (slider-button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
