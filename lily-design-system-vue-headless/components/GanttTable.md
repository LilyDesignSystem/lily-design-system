# GanttTable

An interactive Gantt table that displays project tasks and their timelines as a structured grid widget. Renders a `<table>` element with `role="grid"` and an accessible label. Supports an optional visible caption. Commonly used in project management tools and resource planning applications.

Compound component: use with GanttTableThead, GanttTableTbody, GanttTableTfoot, GanttTableTr, GanttTableTd, and GanttTableTh.

## Props

- `label`: string (required) -- accessible name describing the Gantt table content, applied via `aria-label`
- `caption`: string (optional) -- visible caption text displayed above the table
- `children`: Snippet (required) -- GanttTableThead, GanttTableTbody, GanttTableTfoot elements
- `...restProps`: unknown -- additional attributes spread onto the `<table>`

## Usage

```svelte
<GanttTable label="Project Alpha timeline">
  <GanttTableThead>
    <GanttTableTr>
      <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    </GanttTableTr>
  </GanttTableThead>
  <GanttTableTbody>
    <GanttTableTr>
      <th>Design</th>
      <GanttTableTd active>---</GanttTableTd>
      <GanttTableTd />
      <GanttTableTd />
    </GanttTableTr>
    <GanttTableTr>
      <th>Development</th>
      <GanttTableTd />
      <GanttTableTd active>---</GanttTableTd>
      <GanttTableTd active>---</GanttTableTd>
    </GanttTableTr>
  </GanttTableTbody>
</GanttTable>
```

## Accessibility

- `role="grid"` -- identifies the table as an interactive grid widget
- `aria-label={label}` -- provides an accessible name describing the Gantt table
- `<caption>` -- visible accessible name when the caption prop is set

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
