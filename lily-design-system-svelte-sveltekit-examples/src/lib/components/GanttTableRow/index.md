# GanttTableRow

## Overview

A single row within a GanttTable grid. Renders as a <tr> containing
GanttTableData cells for each time period and task header cells.
Used inside GanttTableHead, GanttTableBody, or GanttTableFoot.

## What it does

A Gantt chart table interactive grid row for planning schedule visualization <tr>.

## When to use

- Use when you need a Gantt chart table interactive grid row for planning schedule visualization <tr>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTableRow>
  <th>Design</th>
  <GanttTableData active>---</GanttTableData>
  <GanttTableData />
</GanttTableRow>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | GanttTableData cells and header cells for this row. |
| `...restProps` | additional HTML attributes spread onto the <tr> |  |

## Examples

```svelte
<!-- Task row with active time periods -->
<GanttTableRow>
  <th>Development</th>
  <GanttTableData />
  <GanttTableData active>---</GanttTableData>
  <GanttTableData active>---</GanttTableData>
</GanttTableRow>

<!-- Header row with time period labels -->
<GanttTableRow>
  <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
</GanttTableRow>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableRow from "$lib/components/GanttTableRow/GanttTableRow.svelte";
</script>

<GanttTableRow>
  <th>Design</th>
  <GanttTableData active>---</GanttTableData>
  <GanttTableData />
</GanttTableRow>
```

## Keyboard

- None built-in — keyboard navigation is handled at the GanttTable grid level.

## Accessibility

- <tr> has implicit role="row" within the grid (no explicit role needed)

## Internationalization

- All cell content comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
