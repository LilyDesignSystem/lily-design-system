# CalendarDayTable

A calendar grid for a grid of the time slots of one day: one row per slot.

Structural wrapper like `CalendarTable`: renders `<table role="grid" aria-label="@Label" data-view="day">`
with an optional `<caption>`. The consumer reuses the `CalendarTable*` sub-elements
(`CalendarTableHead`, `CalendarTableBody`, `CalendarTableRow`, `CalendarTableTH`, `CalendarTableTD`);
there are no `CalendarDayTable*` sub-elements. The consumer owns locale formatting (`Intl`) and cell content,
and grid keyboard navigation.

## Parameters

- `Label` (required) accessible name of the period shown, e.g. "Monday 6 January 2025".
- `Caption` optional visible caption.
- `ChildContent` head/body/rows.
- `CssClass` appended after `calendar-day-table`.
- Unmatched attributes are splatted onto the `<table>`.

## Usage

```razor
<CalendarDayTable Label="Monday 6 January 2025">
    <CalendarTableBody>...</CalendarTableBody>
</CalendarDayTable>
```

Canonical documentation: `components/calendar-day-table/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.
