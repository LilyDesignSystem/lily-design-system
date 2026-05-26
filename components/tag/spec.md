# Tag — Specification

Single source of truth for spec-driven development of the Tag component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tag component: a keyword label for categorizing content.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .tag

## Approach

1. Use semantic <span> element with class="tag"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="tag"
- [ ] `role="status"` -- identifies this as a live region for screen reader announcements of content changes
- [ ] `aria-label` -- provides an accessible name from the `label` prop, giving expanded context beyond the visible tag text
- [ ] Keyboard: None -- tags are informational, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tag to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tag.html)
- [ ] Implement HTML headless test (tag.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
