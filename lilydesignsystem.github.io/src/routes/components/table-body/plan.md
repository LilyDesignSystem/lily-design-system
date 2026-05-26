# Table Body — Implementation Plan

## Goal

Implement the Table Body component: a table interactive grid tbody <tbody>.

## HTML Tag and CSS Class

- HTML tag: <tbody>
- CSS class: .table-body

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <tbody> element with class="table-body"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tbody> with class="table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
