# Date Input — Specification

Single source of truth for spec-driven development of the Date Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Date Input component: an input for entering a date value <input type="date">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .date-input

## Approach

1. Use semantic <input> element with class="date-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="date-input"
- [ ] `aria-label={label}` -- provides an accessible name for the date input since there is no visible `<label>` element
- [ ] Keyboard: Tab: Moves focus to and from the date input (native browser behavior)
- [ ] Keyboard: Arrow keys: Navigate within the date picker fields (native browser behavior)
- [ ] Keyboard: Enter: Opens or confirms the date picker (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .date-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (date-input.html)
- [ ] Implement HTML headless test (date-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
