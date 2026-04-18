# GanttTableCol

A column definition within a GanttTable, rendered as a `<col>` element. Used inside a `<colgroup>` to define column properties such as span. Useful for styling entire columns of the Gantt grid (e.g. weekends, milestones, or specific time periods).

## Props

- `span`: number (optional) -- number of columns this `<col>` spans
- `...restProps`: unknown -- additional attributes spread onto the `<col>`

## Usage

```svelte
<GanttTable label="Project timeline">
  <colgroup>
    <GanttTableCol />
    <GanttTableCol span={5} />
    <GanttTableCol />
  </colgroup>
  ...
</GanttTable>
```

## References

- HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
