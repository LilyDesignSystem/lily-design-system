# Timeline List — Specification

Single source of truth for spec-driven development of the Timeline List component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Timeline List component: an ordered list of chronological events or milestones.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .timeline-list

## Dependencies

- Requires children: timeline-list-item

## Approach

1. Use semantic <ol> element with class="timeline-list"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="timeline-list"
- [ ] `aria-label` provides accessible name for the list
- [ ] Keyboard: None directly -- standard list navigation by screen readers
- [ ] Keyboard: Tab moves focus between any interactive elements (links, buttons) within timeline items
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .timeline-list to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (timeline-list.html)
- [ ] Implement HTML headless test (timeline-list.test.js)
- [ ] Implement child component: timeline-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
