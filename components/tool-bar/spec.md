# Tool Bar — Specification

Single source of truth for spec-driven development of the Tool Bar component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tool Bar component: a horizontal bar of tool actions.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tool-bar

## Dependencies

- Requires children: tool-bar-button

## Approach

1. Use semantic <div> element with class="tool-bar"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tool-bar"
- [ ] `role="toolbar"` -- identifies the container as a toolbar widget
- [ ] `aria-label` -- provides the accessible name for the toolbar
- [ ] Keyboard: ArrowRight: Move focus to next item (wraps to first)
- [ ] Keyboard: ArrowLeft: Move focus to previous item (wraps to last)
- [ ] Keyboard: Home: Move focus to first item
- [ ] Keyboard: End: Move focus to last item
- [ ] Keyboard: Tab: Enter/exit the toolbar
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tool-bar to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tool-bar.html)
- [ ] Implement HTML headless test (tool-bar.test.js)
- [ ] Implement child component: tool-bar-button

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
