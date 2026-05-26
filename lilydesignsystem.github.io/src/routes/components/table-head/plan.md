# Table Head — Implementation Plan

## Goal

Implement the Table Head component: a table interactive grid thead <thead>.

## HTML Tag and CSS Class

- HTML tag: <thead>
- CSS class: .table-head

## Dependencies

- Requires parent: table

## Approach

1. Use semantic <thead> element with class="table-head"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <thead> with class="table-head"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
