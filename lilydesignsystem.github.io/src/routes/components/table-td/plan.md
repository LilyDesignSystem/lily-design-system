# Table Data — Implementation Plan

## Goal

Implement the Table Data component: a table interactive grid data cell <td>.

## HTML Tag and CSS Class

- HTML tag: <td>
- CSS class: .table-td

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <td> element with class="table-td"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <td> with class="table-td"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
