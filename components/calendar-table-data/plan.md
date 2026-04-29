# Calendar Table Data — Implementation Plan

## Goal

Implement the Calendar Table Data component: a calendar table interactive grid data cell for managing dates, days, etc. <td>.

## HTML Tag and CSS Class

- HTML tag: <td>
- CSS class: .calendar-table-td

## Dependencies

- Requires parent: calendar-table

## Approach

1. Use semantic <td> element with class="calendar-table-td"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <td> with class="calendar-table-td"
- [ ] `role="gridcell"` -- identifies the cell as part of a grid
- [ ] `aria-selected` -- set to `true` when the cell is selected; omitted otherwise
- [ ] `aria-current="date"` -- set when the cell represents today's date; omitted otherwise
- [ ] Keyboard: Tab: Focus moves to the selected cell (`tabindex="0"`)
- [ ] Keyboard: Arrow keys: Typically handled by the parent CalendarTable grid navigation
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
