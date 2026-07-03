# DateTime Local Input — Specification

Single source of truth for spec-driven development of the DateTime Local Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the DateTime Local Input component: an input for entering a date and time without time zone <input type="datetime-local">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .date-time-local-input

## Approach

1. Use semantic <input> element with class="date-time-local-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="date-time-local-input"
- [ ] `aria-label={label}` -- provides an accessible name for the datetime input since there is no visible `<label>` element
- [ ] Keyboard: Tab: Moves focus to and from the datetime input (native browser behavior)
- [ ] Keyboard: Arrow keys: Navigate within the datetime picker fields (native browser behavior)
- [ ] Keyboard: Enter: Opens or confirms the datetime picker (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .date-time-local-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (date-time-local-input.html)
- [ ] Implement HTML headless test (date-time-local-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
