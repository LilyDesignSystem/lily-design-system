# Theme Select — Specification

Single source of truth for spec-driven development of the Theme Select component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Theme Select component: a select dropdown for choosing a theme.

## HTML Tag and CSS Class

- HTML tag: <select>
- CSS class: .theme-select

## Dependencies

- Requires children: theme-select-option

## Approach

1. Use semantic <select> element with class="theme-select"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <select> with class="theme-select"
- [ ] `aria-label={label}` -- provides an accessible name for the theme select since there is no visible `<label>` element
- [ ] Keyboard: Tab: Moves focus to and from the select element (native browser behavior)
- [ ] Keyboard: Space/Enter: Opens the dropdown list when focused (native browser behavior)
- [ ] Keyboard: Arrow Up/Down: Navigates through theme options (native browser behavior)
- [ ] Keyboard: Escape: Closes the dropdown list (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .theme-select to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (theme-select.html)
- [ ] Implement HTML headless test (theme-select.test.js)
- [ ] Implement child component: theme-select-option

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
