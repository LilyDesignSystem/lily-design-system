# CalendarTableTD

A column header cell within a CalendarTable, rendered as a `<th scope="col">` element. Intended to live inside a CalendarTableRow within CalendarTableHead, where it labels day-of-week or other calendar-grid columns.

## Props

- `colspan`: number (optional) -- number of columns this header cell spans
- `rowspan`: number (optional) -- number of rows this header cell spans
- `scope`: `"col" | "row" | "colgroup" | "rowgroup"` (default `"col"`)
- default slot -- header cell content
- `...restProps`: unknown -- additional attributes spread onto the `<th>`

## Usage

```vue
<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow>
      <CalendarTableTD>Sun</CalendarTableTD>
      <CalendarTableTD>Mon</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableHead>
  ...
</CalendarTable>
```

## References

- HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th
