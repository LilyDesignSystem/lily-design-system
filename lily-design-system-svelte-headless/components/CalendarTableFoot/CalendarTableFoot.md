# CalendarTableFoot

The footer section of a CalendarTable, rendered as a `<tfoot>` element. Contains CalendarTableRow elements with summary or aggregate data cells.

## Props

- `children`: Snippet (required) -- CalendarTableRow elements with footer cells
- `...restProps`: unknown -- additional attributes spread onto the `<tfoot>`

## Usage

```svelte
<CalendarTableFoot>
  <CalendarTableRow>
    <CalendarTableData>Week Total: 5</CalendarTableData>
  </CalendarTableRow>
</CalendarTableFoot>
```

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
