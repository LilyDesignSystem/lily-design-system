# CalendarMonthTable

A calendar grid for a grid of the days of one month: week rows by seven day columns.

Structural wrapper like `CalendarTable`: renders `<table role="grid" aria-label="@Label" data-view="month">`
with an optional `<caption>`. The consumer reuses the `CalendarTable*` sub-elements
(`CalendarTableHead`, `CalendarTableBody`, `CalendarTableRow`, `CalendarTableTH`, `CalendarTableTD`);
there are no `CalendarMonthTable*` sub-elements. The consumer owns locale formatting (`Intl`) and cell content,
and grid keyboard navigation.

## Parameters

- `Label` (required) accessible name of the period shown, e.g. "January 2025".
- `Caption` optional visible caption.
- `ChildContent` head/body/rows.
- `CssClass` appended after `calendar-month-table`.
- Unmatched attributes are splatted onto the `<table>`.

## Usage

```razor
<CalendarMonthTable Label="January 2025">
    <CalendarTableBody>...</CalendarTableBody>
</CalendarMonthTable>
```

Canonical documentation: `components/calendar-month-table/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.
