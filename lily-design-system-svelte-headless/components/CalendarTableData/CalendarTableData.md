# CalendarTableData

A single day cell within a CalendarTable grid. Renders as a `<td>` with `role="gridcell"`, supporting selected and today states. Uses a roving tabindex pattern where the selected cell receives focus.

## Props

- `selected`: boolean (default: false) -- whether this day cell is selected
- `today`: boolean (default: false) -- whether this day cell represents today's date
- `children`: Snippet (required) -- day content, typically the day number
- `...restProps`: unknown -- additional attributes spread onto the `<td>`

## Usage

```svelte
<CalendarTableData selected today>15</CalendarTableData>
<CalendarTableData>22</CalendarTableData>
```

## Accessibility

- `role="gridcell"` -- identifies the cell as part of a grid
- `aria-selected` -- set to `true` when selected; omitted otherwise
- `aria-current="date"` -- set when the cell represents today; omitted otherwise
- Roving tabindex: `tabindex="0"` when selected, `"-1"` otherwise

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
