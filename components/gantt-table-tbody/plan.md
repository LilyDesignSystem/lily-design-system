# Gantt Table Body — Implementation Plan

## Goal

Implement the Gantt Table Body component: a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>.

## HTML Tag and CSS Class

- HTML tag: <tbody>
- CSS class: .gantt-table-body

## Dependencies

- Requires parent: gantt-table

## Approach

1. Use semantic <tbody> element with class="gantt-table-body"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tbody> with class="gantt-table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
