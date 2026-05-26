# Avatar Text — Specification

Single source of truth for spec-driven development of the Avatar Text component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Avatar Text component: an avatar indicator inner text such as a user name.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .avatar-text

## Approach

1. Use semantic <span> element with class="avatar-text"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="avatar-text"
- [ ] Typically marked `aria-hidden="true"` when inside an Avatar, since the parent's `aria-label` already provides the accessible name
- [ ] Keyboard: None -- this is a decorative/informational element, not interactive
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .avatar-text to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (avatar-text.html)
- [ ] Implement HTML headless test (avatar-text.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
