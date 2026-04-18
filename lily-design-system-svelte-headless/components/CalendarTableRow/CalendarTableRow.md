# CalendarTableRow

A single row within a CalendarTable grid. Renders as a `<tr>`, containing CalendarTableData cells for each day in the week.

## Props

- `children`: Snippet (required) -- CalendarTableData cells for this row
- `...restProps`: unknown -- additional attributes spread onto the `<tr>`

## Usage

```svelte
<CalendarTable label="January 2025">
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableData>1</CalendarTableData>
      <CalendarTableData>2</CalendarTableData>
      <CalendarTableData>3</CalendarTableData>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## Accessibility

- `<tr>` has implicit `role="row"` within the grid (no explicit role needed)

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
