# Slide-Out Drawer — Specification

Single source of truth for spec-driven development of the Slide-Out Drawer component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Slide-Out Drawer component: a drawer that slides out from the side of the page.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .slide-out-drawer

## Approach

1. Use semantic <div> element with class="slide-out-drawer"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="slide-out-drawer"
- [ ] `role="dialog"` for modal dialog semantics
- [ ] `aria-label` from the label prop provides the accessible name
- [ ] `aria-modal="true"` indicates modal behavior (content behind the drawer is inert)
- [ ] Keyboard: Escape closes the drawer
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .slide-out-drawer to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (slide-out-drawer.html)
- [ ] Implement HTML headless test (slide-out-drawer.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
