# Color Picker — Specification

Single source of truth for spec-driven development of the Color Picker component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Color Picker component: a two-dimensional board for picking colors by hue and saturation.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .color-picker

## Dependencies

- Requires children: color-picker-button

## Approach

1. Use semantic <div> element with class="color-picker"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="color-picker"
- [ ] `role="slider"` -- identifies the element as a slider control
- [ ] `aria-label="..."` -- provides an accessible name for the slider
- [ ] `aria-valuenow` -- current X value (0-100)
- [ ] `aria-valuemin="0"` -- minimum slider value
- [ ] `aria-valuemax="100"` -- maximum slider value
- [ ] `aria-disabled="true"` -- set when the control is disabled
- [ ] Keyboard: ArrowRight: increase X by 1 (Shift: by 10)
- [ ] Keyboard: ArrowLeft: decrease X by 1 (Shift: by 10)
- [ ] Keyboard: ArrowUp: decrease Y by 1 (Shift: by 10)
- [ ] Keyboard: ArrowDown: increase Y by 1 (Shift: by 10)
- [ ] Keyboard: Home: set X to 0
- [ ] Keyboard: End: set X to 100
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .color-picker to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (color-picker.html)
- [ ] Implement HTML headless test (color-picker.test.js)
- [ ] Implement child component: color-picker-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
