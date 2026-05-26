# Badge — Specification

Single source of truth for spec-driven development of the Badge component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Badge component: a small label for counts, statuses, or categories.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .badge

## Approach

1. Use semantic <span> element with class="badge"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="badge"
- [ ] `role="status"` -- creates an ARIA live region for dynamic content announcements
- [ ] `aria-label` -- optional expanded context for screen readers beyond the visible text
- [ ] Keyboard: None -- badges are informational, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .badge to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (badge.html)
- [ ] Implement HTML headless test (badge.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
