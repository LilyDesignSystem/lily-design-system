# Toggle Button — Specification

Single source of truth for spec-driven development of the Toggle Button component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Toggle Button component: a button that toggles between pressed and unpressed states.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .toggle-button

## Approach

1. Use semantic <button> element with class="toggle-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="toggle-button"
- [ ] `role="switch"` -- identifies the element as a two-state toggle switch
- [ ] `aria-checked={pressed}` -- communicates whether the toggle is currently on (`true`) or off (`false`)
- [ ] `aria-label={label}` -- provides the accessible name for the toggle control
- [ ] Keyboard: Space: Toggles between on and off states (custom handler with `preventDefault`)
- [ ] Keyboard: Enter: Activates the button (native button behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .toggle-button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (toggle-button.html)
- [ ] Implement HTML headless test (toggle-button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
