# GanttTableTr

## Overview

A single row within a GanttTable grid. Renders as a <tr> containing
GanttTableTd cells for each time period and task header cells.
Used inside GanttTableThead, GanttTableTbody, or GanttTableTfoot.

## What it does

A Gantt chart table interactive grid row for planning schedule visualization <tr>.

## When to use

- Use when you need a Gantt chart table interactive grid row for planning schedule visualization <tr>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTableTr>
  <th>Design</th>
  <GanttTableTd active>---</GanttTableTd>
  <GanttTableTd />
</GanttTableTr>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | GanttTableTd cells and header cells for this row. |
| `...restProps` | additional HTML attributes spread onto the <tr> |  |

## Examples

```svelte
<!-- Task row with active time periods -->
<GanttTableTr>
  <th>Development</th>
  <GanttTableTd />
  <GanttTableTd active>---</GanttTableTd>
  <GanttTableTd active>---</GanttTableTd>
</GanttTableTr>

<!-- Header row with time period labels -->
<GanttTableTr>
  <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
</GanttTableTr>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableTr from "$lib/components/GanttTableTr/GanttTableTr.svelte";
</script>

<GanttTableTr>
  <th>Design</th>
  <GanttTableTd active>---</GanttTableTd>
  <GanttTableTd />
</GanttTableTr>
```

## Keyboard

- None built-in — keyboard navigation is handled at the GanttTable grid level.

## Accessibility

- <tr> has implicit role="row" within the grid (no explicit role needed)

## Internationalization

- All cell content comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
