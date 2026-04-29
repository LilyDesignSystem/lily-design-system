# Table Col — Implementation Plan

## Goal

Implement the Table Col component: a table interactive grid column <th>.

## HTML Tag and CSS Class

- HTML tag: <th>
- CSS class: .table-th

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <th> element with class="table-th"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <th> with class="table-th"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
