# CalendarMonthTable

CalendarMonthTable is the calendar grid for one month: week rows x 7 day columns. It is a structural wrapper like `calendar-table`: a `<table role="grid">` with `data-view="month"`. The consumer supplies the head, body, rows and cells by reusing the `calendar-table-*` sub-element macros; there are no `calendar-month-table-*` sub-elements.

## Implementation Notes

- Root `<table>` with the base class `calendar-month-table` first, then `params.classes`
- `role="grid"`, `aria-label` from `params.label`, `data-view="month"`
- Optional `<caption>` from `params.caption` / `params.captionHtml`
- The consumer owns locale formatting (`Intl`) and cell content
- Svelte canonical: `CalendarYearTable.svelte` family. Nunjucks idiom: single `params` object, `caller()` / `params.html` for content, `params.attributes` for rest props

## Props

- `label`: string (required) -- accessible name for the period shown, e.g. "March 2025"
- `caption`: string (optional) -- visible caption
- `captionHtml`: string (optional) -- visible caption as raw HTML
- `id`, `classes`, `attributes`, `html` / caller content

## Usage

```njk
{% from "components/calendar-month-table/macro.njk" import calendarMonthTable %}
{% call calendarMonthTable({ label: "March 2025" }) %}
  ...calendarTableBody...
{% endcall %}
```

## Keyboard Interactions

None built in. The consumer implements grid keyboard navigation (arrow keys, Enter/Space).

## ARIA

`role="grid"`, `aria-label`.

## When to Use

- When showing one month: week rows x 7 day columns.
- When cells are interactive (selectable dates) and form an ARIA grid.

## When Not to Use

- For a plain data table, use `table` or `data-table`.
- For a different calendar view, use the matching `calendar-*-table`.

## Headless

No visual decisions: no CSS, no inline styles.

## Styles

Consumer CSS targets `.calendar-month-table` and `[data-view="month"]`.

## Testing

See `macro.test.js`: base class, role, aria-label, data-view, caption, caller/html content, attribute pass-through, no styles.

## Deviations

None from the Svelte contract.

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

---

Lily™ and Lily Design System™ are trademarks.
