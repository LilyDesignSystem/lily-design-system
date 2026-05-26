# Table Row — Implementation Plan

## Goal

Implement the Table Row component: a table interactive grid row <tr>.

## HTML Tag and CSS Class

- HTML tag: <tr>
- CSS class: .table-row

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <tr> element with class="table-row"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tr> with class="table-row"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
