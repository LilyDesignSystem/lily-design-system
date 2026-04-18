# GanttTableData

A Gantt table data cell is a single cell within a GanttTableRow representing a time period in the Gantt table grid. It renders as a `<td>` with `role="gridcell"`. Supports an active state to indicate the task spans this time period, communicated via `aria-selected` for screen readers.

## Implementation Notes

- Renders a `<td>` element with `role="gridcell"` for grid semantics
- Active state indicated via `aria-selected="true"` and `tabindex="0"`
- Inactive cells have `tabindex="-1"` for roving tabindex pattern
- Children are optional -- empty cells represent inactive time periods
- Must be used inside a GanttTableRow

## Props

- `active`: boolean (default: `false`) -- whether this cell represents an active time period for the task
- `children`: Snippet (optional) -- cell content such as bar indicators or duration text
- `...restProps`: unknown -- additional attributes spread onto the `<td>`

## Usage

```svelte
<!-- Active time period with bar content -->
<GanttTableData active>---</GanttTableData>

<!-- Inactive empty time period -->
<GanttTableData />

<!-- Active with milestone marker -->
<GanttTableData active>◆</GanttTableData>
```

## ARIA

- `role="gridcell"` -- identifies the cell as part of a grid
- `aria-selected` -- set to `true` when active; omitted otherwise
- `tabindex` -- `0` when active, `-1` otherwise (roving tabindex pattern)

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
