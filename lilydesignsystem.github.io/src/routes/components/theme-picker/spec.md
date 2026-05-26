# Theme Picker — Specification

Single source of truth for spec-driven development of the Theme Picker component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Theme Picker component: a picker for selecting a visual theme.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .theme-picker

## Approach

1. Use semantic <div> element with class="theme-picker"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="theme-picker"
- [ ] `role="radiogroup"` -- identifies the fieldset as a group of related radio buttons
- [ ] `aria-label={label}` -- provides an accessible name describing the purpose of the theme selection
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .theme-picker to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (theme-picker.html)
- [ ] Implement HTML headless test (theme-picker.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
