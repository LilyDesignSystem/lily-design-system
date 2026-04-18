# CalendarTableHead

The header section of a CalendarTable, rendered as a `<thead>` element. Contains CalendarTableRow elements with day-of-week column headers.

## Props

- `children`: Snippet (required) -- CalendarTableRow elements with header cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>`

## Usage

```svelte
<CalendarTableHead>
  <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></CalendarTableRow>
</CalendarTableHead>
```

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
