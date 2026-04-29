# GanttTableThead

## Overview

The header section of a GanttTable, rendered as a <thead> element.
Contains GanttTableTr elements with column headers for task names,
dates, durations, or other Gantt chart metadata.

## What it does

A Gantt chart table interactive grid thead for planning schedule visualization <thead>.

## When to use

- Use when you need a Gantt chart table interactive grid thead for planning schedule visualization <thead>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTableThead>
  <GanttTableTr><th>Task</th><th>Start</th><th>End</th></GanttTableTr>
</GanttTableThead>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | GanttTableTr elements with header cells. |
| `...restProps` | additional HTML attributes spread onto the <thead> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableThead from "$lib/components/GanttTableThead/GanttTableThead.svelte";
</script>

<GanttTableThead>
  <GanttTableTr><th>Task</th><th>Start</th><th>End</th></GanttTableTr>
</GanttTableThead>
```

## Keyboard

- None built-in — keyboard navigation handled at the GanttTable grid level.

## Accessibility

- <thead> provides structural header semantics for the table

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
