# Task Bar — Specification

Single source of truth for spec-driven development of the Task Bar component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Task Bar component: a horizontal bar of task shortcuts or actions.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .task-bar

## Dependencies

- Requires children: task-bar-button

## Approach

1. Use semantic <div> element with class="task-bar"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="task-bar"
- [ ] `role="toolbar"` -- identifies the container as a toolbar widget, grouping related controls
- [ ] `aria-label` -- provides the accessible name for the toolbar, set from the `label` prop
- [ ] Keyboard: Tab: Focus moves to the first focusable item within the toolbar (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .task-bar to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (task-bar.html)
- [ ] Implement HTML headless test (task-bar.test.js)
- [ ] Implement child component: task-bar-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
