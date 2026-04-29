# Data Table Col — Implementation Plan

## Goal

Implement the Data Table Col component: a data table interactive grid column for displaying and sorting tabular data <th>.

## HTML Tag and CSS Class

- HTML tag: <th>
- CSS class: .data-table-th

## Dependencies

- Requires parent: data-table

## Approach

1. Use semantic <th> element with class="data-table-th"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <th> with class="data-table-th"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
