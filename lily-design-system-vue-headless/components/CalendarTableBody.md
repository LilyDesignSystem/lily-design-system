# CalendarTableBody

The body section of a CalendarTable, rendered as a `<tbody>` element. Contains CalendarTableRow elements with day data cells.

## Props

- `children`: Snippet (required) -- CalendarTableRow elements with data cells
- `...restProps`: unknown -- additional attributes spread onto the `<tbody>`

## Usage

```svelte
<CalendarTableBody>
  <CalendarTableRow>
    <CalendarTableTD>1</CalendarTableTD>
    <CalendarTableTD>2</CalendarTableTD>
  </CalendarTableRow>
</CalendarTableBody>
```

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
