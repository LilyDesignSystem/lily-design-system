# CalendarYearTable

A calendar grid for a grid of the twelve months of one year (typically 3 x 4 or 4 x 3 month cells).

Structural wrapper like `CalendarTable`: renders `<table role="grid" aria-label="@Label" data-view="year">`
with an optional `<caption>`. The consumer reuses the `CalendarTable*` sub-elements
(`CalendarTableHead`, `CalendarTableBody`, `CalendarTableRow`, `CalendarTableTH`, `CalendarTableTD`);
there are no `CalendarYearTable*` sub-elements. The consumer owns locale formatting (`Intl`) and cell content,
and grid keyboard navigation.

## Parameters

- `Label` (required) accessible name of the period shown, e.g. "2025".
- `Caption` optional visible caption.
- `ChildContent` head/body/rows.
- `CssClass` appended after `calendar-year-table`.
- Unmatched attributes are splatted onto the `<table>`.

## Usage

```razor
<CalendarYearTable Label="2025">
    <CalendarTableBody>...</CalendarTableBody>
</CalendarYearTable>
```

Canonical documentation: `components/calendar-year-table/index.md`. No deviations from the Svelte canonical.

---

Lily(TM) and Lily Design System(TM) are trademarks.
