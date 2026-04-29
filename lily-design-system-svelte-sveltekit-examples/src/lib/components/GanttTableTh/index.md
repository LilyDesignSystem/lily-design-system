# GanttTableTh

## Overview

A column definition within a GanttTable, rendered as a <col> element.
Used inside a <colgroup> to define column properties such as span.
Useful for styling entire columns of the Gantt grid (e.g. weekends,
milestones, or specific time periods).

## What it does

A Gantt chart table interactive grid column for planning schedule visualization <th>.

## When to use

- Use when you need a Gantt chart table interactive grid column for planning schedule visualization <th>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<colgroup>
  <GanttTableTh />
  <GanttTableTh span={5} />
  <GanttTableTh />
</colgroup>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `span` | number, optional | Number of columns this <col> spans. |
| `...restProps` | additional HTML attributes spread onto the <col> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableTh from "$lib/components/GanttTableTh/GanttTableTh.svelte";
</script>

<colgroup>
  <GanttTableTh />
  <GanttTableTh span={5} />
  <GanttTableTh />
</colgroup>
```

## Keyboard

- None — <col> is not interactive.

## Accessibility

- <col> provides structural column semantics for the table

## References

- HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
