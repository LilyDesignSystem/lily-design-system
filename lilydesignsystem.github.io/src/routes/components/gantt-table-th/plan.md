# Gantt Table Col — Implementation Plan

## Goal

Implement the Gantt Table Col component: a Gantt chart table interactive grid column for planning schedule visualization <th>.

## HTML Tag and CSS Class

- HTML tag: <th>
- CSS class: .gantt-table-th

## Dependencies

- Requires parent: gantt-table

## Approach

1. Use semantic <th> element with class="gantt-table-th"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <th> with class="gantt-table-th"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
