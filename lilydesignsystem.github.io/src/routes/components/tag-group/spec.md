# Tag Group — Specification

Single source of truth for spec-driven development of the Tag Group component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tag Group component: a group of tag elements.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tag-group

## Dependencies

- Requires children: tag

## Approach

1. Use semantic <div> element with class="tag-group"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tag-group"
- [ ] `role="group"` -- identifies the container as a semantic grouping of related elements
- [ ] `aria-label={label}` -- provides an accessible name describing the purpose of the tag collection
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tag-group to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tag-group.html)
- [ ] Implement HTML headless test (tag-group.test.js)
- [ ] Implement child component: tag

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
