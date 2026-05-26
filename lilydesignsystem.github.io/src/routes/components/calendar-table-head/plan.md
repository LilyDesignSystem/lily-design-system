# Calendar Table Head — Implementation Plan

## Goal

Implement the Calendar Table Head component: a calendar table interactive grid thead for managing dates, days, etc. <thead>.

## HTML Tag and CSS Class

- HTML tag: <thead>
- CSS class: .calendar-table-head

## Dependencies

- Requires parent: calendar-table

## Approach

1. Use semantic <thead> element with class="calendar-table-head"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <thead> with class="calendar-table-head"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
