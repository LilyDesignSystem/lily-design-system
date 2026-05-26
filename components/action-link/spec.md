# Action Link — Specification

Single source of truth for spec-driven development of the Action Link component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Action Link component: a hyperlink styled as an action trigger.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .action-link

## Approach

1. Use semantic <a> element with class="action-link"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="action-link"
- [ ] `aria-label` -- optional override for screen reader text when the visible link text does not fully convey the action
- [ ] Keyboard: Tab: Focus the link (native browser behavior)
- [ ] Keyboard: Enter: Activate the link (native browser behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .action-link to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (action-link.html)
- [ ] Implement HTML headless test (action-link.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
