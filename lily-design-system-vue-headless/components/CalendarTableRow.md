# CalendarTableRow

A single row within a CalendarTable grid. Renders as a `<tr>`, containing CalendarTableTD cells for each day in the week.

## Props

- `children`: Snippet (required) -- CalendarTableTD cells for this row
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<CalendarTable label="January 2025">
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableTD>1</CalendarTableTD>
      <CalendarTableTD>2</CalendarTableTD>
      <CalendarTableTD>3</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## Accessibility

- `<tr>` has implicit `role="row"` within the grid (no explicit role needed)

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
