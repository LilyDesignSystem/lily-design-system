# Table Foot — Implementation Plan

## Goal

Implement the Table Foot component: a table interactive grid tfoot <tfoot>.

## HTML Tag and CSS Class

- HTML tag: <tfoot>
- CSS class: .table-foot

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <tfoot> element with class="table-foot"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tfoot> with class="table-foot"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
