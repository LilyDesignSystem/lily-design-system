# GanttTableThead

The header section of a GanttTable, rendered as a `<thead>` element. Contains GanttTableTr elements with column headers for task names, dates, durations, or other Gantt chart metadata.

## Props

- `children`: Snippet (required) -- GanttTableTr elements with header cells
- `...restProps`: unknown -- additional attributes spread onto the `<thead>`

## Usage

```svelte
<GanttTableThead>
  <GanttTableTr><th>Task</th><th>Start</th><th>End</th></GanttTableTr>
</GanttTableThead>
```

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
