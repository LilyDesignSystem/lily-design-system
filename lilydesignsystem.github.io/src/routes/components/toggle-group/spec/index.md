# Toggle Group — Specification

Single source of truth for spec-driven development of the Toggle Group component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Toggle Group component: a group of toggle buttons for selecting options.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .toggle-group

## Dependencies

- Requires children: toggle-button

## Approach

1. Use semantic <div> element with class="toggle-group"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="toggle-group"
- [ ] `role="group"` -- identifies the container as a semantic grouping of related toggle buttons
- [ ] `aria-label={label}` -- provides an accessible name describing the purpose of the toggle collection
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .toggle-group to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (toggle-group.html)
- [ ] Implement HTML headless test (toggle-group.test.js)
- [ ] Implement child component: toggle-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
