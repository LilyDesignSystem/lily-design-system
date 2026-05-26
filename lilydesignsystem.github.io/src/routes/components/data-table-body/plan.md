# Data Table Body — Implementation Plan

## Goal

Implement the Data Table Body component: a data table interactive grid tbody for displaying and sorting tabular data <tbody>.

## HTML Tag and CSS Class

- HTML tag: <tbody>
- CSS class: .data-table-body

## Dependencies

- Requires parent: data-table

## Approach

1. Use semantic <tbody> element with class="data-table-body"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tbody> with class="data-table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
