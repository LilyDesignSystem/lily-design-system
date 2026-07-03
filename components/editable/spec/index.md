# Editable — Specification

Single source of truth for spec-driven development of the Editable component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Editable component: an inline-editable text element that toggles between view and edit modes.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .editable

## Approach

1. Use semantic <div> element with class="editable"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="editable"
- [ ] `aria-label={label}` -- provides an accessible name in both display and edit modes
- [ ] `role="button"` -- on the display span, indicates it is an activatable element
- [ ] `aria-disabled={disabled}` -- on the display span when disabled, communicates the disabled state
- [ ] Keyboard: Enter: Activate edit mode
- [ ] Keyboard: Space: Activate edit mode
- [ ] Keyboard: Enter: Confirm the edit and return to display mode
- [ ] Keyboard: Escape: Cancel the edit and return to display mode
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .editable to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (editable.html)
- [ ] Implement HTML headless test (editable.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
