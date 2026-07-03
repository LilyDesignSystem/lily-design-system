# Segment Group Item — Specification

Single source of truth for spec-driven development of the Segment Group Item component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Segment Group Item component: one selectable segment in a segment group.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .segment-group-item

## Dependencies

- Requires parent: segment-group

## Approach

1. Use semantic <div> element with class="segment-group-item"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="segment-group-item"
- [ ] `role="radio"` -- identifies this button as a radio-like option within a radiogroup
- [ ] `aria-checked` -- indicates whether this segment is selected (`true`) or not (`false`)
- [ ] Keyboard: Tab: Focus moves to the checked segment (or first segment if none checked)
- [ ] Keyboard: Arrow Left / Arrow Right: Consumer should implement arrow key navigation on the parent SegmentGroup
- [ ] Keyboard: Space / Enter: Activates the focused segment (native button behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .segment-group-item to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (segment-group-item.html)
- [ ] Implement HTML headless test (segment-group-item.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
