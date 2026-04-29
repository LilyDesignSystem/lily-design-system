# GanttTableBody

## Overview

The body section of a GanttTable, rendered as a <tbody> element.
Contains GanttTableTR elements with task data cells.

## What it does

A Gantt chart table interactive grid tbody for planning schedule visualization <tbody>.

## When to use

- Use when you need a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTableBody>
  <GanttTableTR>
    <GanttTableTD>Design</GanttTableTD>
    <GanttTableTD>Jan 1</GanttTableTD>
  </GanttTableTR>
</GanttTableBody>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | GanttTableTR elements with data cells. |
| `...restProps` | additional HTML attributes spread onto the <tbody> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableBody from "$lib/components/GanttTableBody/GanttTableBody.svelte";
</script>

<GanttTableBody>
  <GanttTableTR>
    <GanttTableTD>Design</GanttTableTD>
    <GanttTableTD>Jan 1</GanttTableTD>
  </GanttTableTR>
</GanttTableBody>
```

## Keyboard

- None built-in — keyboard navigation handled at the GanttTable grid level.

## Accessibility

- <tbody> provides structural body semantics for the table

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
