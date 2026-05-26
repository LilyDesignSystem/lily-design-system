# Segment Group — Specification

Single source of truth for spec-driven development of the Segment Group component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Segment Group component: a group of mutually exclusive segment options.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .segment-group

## Dependencies

- Requires children: segment-group-item

## Approach

1. Use semantic <div> element with class="segment-group"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="segment-group"
- [ ] `role="radiogroup"` -- identifies the container as a group of mutually exclusive radio-like options
- [ ] `aria-label={label}` -- provides an accessible name for the group so screen readers announce its purpose
- [ ] Keyboard: Tab: Moves focus into the segment group
- [ ] Keyboard: Arrow Left / Arrow Right: Consumer should implement arrow key navigation between segments (following the radiogroup pattern)
- [ ] Keyboard: Space / Enter: Consumer should implement activation of the focused segment
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .segment-group to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (segment-group.html)
- [ ] Implement HTML headless test (segment-group.test.js)
- [ ] Implement child component: segment-group-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
