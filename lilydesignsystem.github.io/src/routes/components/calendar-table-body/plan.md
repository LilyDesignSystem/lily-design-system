# Calendar Table Body — Implementation Plan

## Goal

Implement the Calendar Table Body component: a calendar table interactive grid tbody for managing dates, days, etc. <tbody>.

## HTML Tag and CSS Class

- HTML tag: <tbody>
- CSS class: .calendar-table-body

## Dependencies

- Requires parent: calendar-table

## Approach

1. Use semantic <tbody> element with class="calendar-table-body"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <tbody> with class="calendar-table-body"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
