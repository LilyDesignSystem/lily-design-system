# Select With Extras — Specification

Single source of truth for spec-driven development of the Select With Extras component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Select With Extras component: a select dropdown with additional features like search or groups.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .select-with-extras

## Approach

1. Use semantic <div> element with class="select-with-extras"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="select-with-extras"
- [ ] `aria-label={label}` -- provides an accessible name for the select element so screen readers announce its purpose
- [ ] Keyboard: Tab: Moves focus to the native select element
- [ ] Keyboard: Arrow Up / Arrow Down: Navigates between options (native select behavior)
- [ ] Keyboard: Space / Enter: Opens the select dropdown on some platforms (native select behavior)
- [ ] Keyboard: Escape: Closes the dropdown if open (native select behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .select-with-extras to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (select-with-extras.html)
- [ ] Implement HTML headless test (select-with-extras.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
