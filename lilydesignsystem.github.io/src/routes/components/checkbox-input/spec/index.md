# Checkbox Input — Specification

Single source of truth for spec-driven development of the Checkbox Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Checkbox Input component: a checkbox input for toggling a boolean value <input type="checkbox">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .checkbox-input

## Approach

1. Use semantic <input> element with class="checkbox-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="checkbox-input"
- [ ] `aria-label={label}` -- provides an accessible name for the checkbox since there is no visible `<label>` element
- [ ] Keyboard: Space: Toggles the checkbox checked state (native browser behavior)
- [ ] Keyboard: Tab: Moves focus to and from the checkbox (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .checkbox-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (checkbox-input.html)
- [ ] Implement HTML headless test (checkbox-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
