# Task Bar Button — Specification

Single source of truth for spec-driven development of the Task Bar Button component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Task Bar Button component: one item in a task bar.

## HTML Tag and CSS Class

- HTML tag: <button>
- CSS class: .task-bar-button

## Dependencies

- Requires parent: task-bar

## Approach

1. Use semantic <button> element with class="task-bar-button"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <button> with class="task-bar-button"
- [ ] Keyboard: Tab: Focus the button
- [ ] Keyboard: Enter / Space: Activate the button (browser default)
- [ ] Keyboard: Button is skipped in tab order when `disabled` is true
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .task-bar-button to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (task-bar-button.html)
- [ ] Implement HTML headless test (task-bar-button.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
