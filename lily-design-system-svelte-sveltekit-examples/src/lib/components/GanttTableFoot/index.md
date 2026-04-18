# GanttTableFoot

## Overview

The footer section of a GanttTable, rendered as a <tfoot> element.
Contains GanttTableRow elements with summary or aggregate data cells.

## What it does

A Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>.

## When to use

- Use when you need a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTableFoot>
  <GanttTableRow>
    <GanttTableData>Total: 12 tasks</GanttTableData>
  </GanttTableRow>
</GanttTableFoot>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | GanttTableRow elements with footer cells. |
| `...restProps` | additional HTML attributes spread onto the <tfoot> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableFoot from "$lib/components/GanttTableFoot/GanttTableFoot.svelte";
</script>

<GanttTableFoot>
  <GanttTableRow>
    <GanttTableData>Total: 12 tasks</GanttTableData>
  </GanttTableRow>
</GanttTableFoot>
```

## Keyboard

- None built-in — keyboard navigation handled at the GanttTable grid level.

## Accessibility

- <tfoot> provides structural footer semantics for the table

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
