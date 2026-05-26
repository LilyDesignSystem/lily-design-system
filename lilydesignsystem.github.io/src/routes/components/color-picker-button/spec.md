# Color Picker Button — Specification

Single source of truth for spec-driven development of the Color Picker Button component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Color Picker Button component: a button showing a color swatch in a color picker.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .color-picker-button

## Dependencies

- Requires parent: color-picker

## Approach

1. Use semantic <button> element with class="color-picker-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="color-picker-button"
- [ ] `aria-label={label}` -- provides an accessible name for the swatch since it has no visible text content
- [ ] `aria-pressed={selected}` -- indicates whether the swatch is currently selected in a toggle context
- [ ] Keyboard: **Tab**: Moves focus to the swatch button
- [ ] Keyboard: **Enter / Space**: Activates the button (native button behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .color-picker-button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (color-picker-button.html)
- [ ] Implement HTML headless test (color-picker-button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
