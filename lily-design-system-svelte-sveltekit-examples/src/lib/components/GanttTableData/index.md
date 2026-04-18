# GanttTableData

## Overview

A single cell within a GanttTableRow representing a time period in the
Gantt table grid. Renders as a <td> with role="gridcell". Supports an
active state to indicate the task spans this time period, communicated
via aria-selected for screen readers.

## What it does

A Gantt chart table interactive grid data cell for planning schedule visualization <td>.

## When to use

- Use when you need a Gantt chart table interactive grid data cell for planning schedule visualization <td>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTableData active>---</GanttTableData>
<GanttTableData />
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `active` | boolean, default false | Whether this cell represents an active time period for the task. |
| `children` | Snippet, optional | Cell content such as bar indicators or duration text. |
| `...restProps` | additional HTML attributes spread onto the <td> |  |

## Examples

```svelte
<!-- Active time period with bar content -->
<GanttTableData active>---</GanttTableData>

<!-- Inactive empty time period -->
<GanttTableData />

<!-- Active with milestone marker -->
<GanttTableData active>◆</GanttTableData>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableData from "$lib/components/GanttTableData/GanttTableData.svelte";
</script>

<GanttTableData active>---</GanttTableData>
<GanttTableData />
```

## Keyboard

- None built-in — keyboard navigation is handled at the GanttTable grid level.

## Accessibility

- role="gridcell" identifies the cell as part of a grid
- aria-selected set to true when active; omitted otherwise
- Roving tabindex: tabindex="0" when active, "-1" otherwise

## Internationalization

- Cell content comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
