# Time Picker Input — Specification

Single source of truth for spec-driven development of the Time Picker Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Time Picker Input component: an input with a dropdown for picking a time.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .time-picker-input

## Approach

1. Use semantic <div> element with class="time-picker-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="time-picker-input"
- [ ] `aria-label={label}` -- provides an accessible name for the time input
- [ ] Keyboard: Tab: Move focus to/from the time input
- [ ] Keyboard: Up Arrow / Down Arrow: Increment/decrement the focused time segment (hours, minutes, AM/PM)
- [ ] Keyboard: Left Arrow / Right Arrow: Move between time segments within the input
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .time-picker-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (time-picker-input.html)
- [ ] Implement HTML headless test (time-picker-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
