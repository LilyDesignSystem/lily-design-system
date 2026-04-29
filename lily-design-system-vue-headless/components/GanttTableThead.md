# GanttTableHead

The header section of a GanttTable, rendered as a `<thead>` element. Contains GanttTableTR elements with column headers for task names, dates, durations, or other Gantt chart metadata.

## Props

- `children`: Snippet (required) -- GanttTableTR elements with header cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>`

## Usage

```svelte
<GanttTableHead>
  <GanttTableTR><th>Task</th><th>Start</th><th>End</th></GanttTableTR>
</GanttTableHead>
```

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
