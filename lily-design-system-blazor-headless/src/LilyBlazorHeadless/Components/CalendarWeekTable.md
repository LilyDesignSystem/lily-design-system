# CalendarWeekTable

A calendar grid for a grid of the seven days of one week as day columns.

Structural wrapper like `CalendarTable`: renders `<table role="grid" aria-label="@Label" data-view="week">`
with an optional `<caption>`. The consumer reuses the `CalendarTable*` sub-elements
(`CalendarTableHead`, `CalendarTableBody`, `CalendarTableRow`, `CalendarTableTH`, `CalendarTableTD`);
there are no `CalendarWeekTable*` sub-elements. The consumer owns locale formatting (`Intl`) and cell content,
and grid keyboard navigation.

## Parameters

- `Label` (required) accessible name of the period shown, e.g. "Week of 6 January 2025".
- `Caption` optional visible caption.
- `ChildContent` head/body/rows.
- `CssClass` appended after `calendar-week-table`.
- Unmatched attributes are splatted onto the `<table>`.

## Usage

```razor
<CalendarWeekTable Label="Week of 6 January 2025">
    <CalendarTableBody>...</CalendarTableBody>
</CalendarWeekTable>
```

Canonical documentation: `components/calendar-week-table/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.
