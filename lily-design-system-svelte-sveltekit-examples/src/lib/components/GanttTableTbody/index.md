# GanttTableTbody

## Overview

The body section of a GanttTable, rendered as a <tbody> element.
Contains GanttTableTr elements with task data cells.

## What it does

A Gantt chart table interactive grid tbody for planning schedule visualization <tbody>.

## When to use

- Use when you need a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTableTbody>
  <GanttTableTr>
    <GanttTableTd>Design</GanttTableTd>
    <GanttTableTd>Jan 1</GanttTableTd>
  </GanttTableTr>
</GanttTableTbody>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | GanttTableTr elements with data cells. |
| `...restProps` | additional HTML attributes spread onto the <tbody> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTableTbody from "$lib/components/GanttTableTbody/GanttTableTbody.svelte";
</script>

<GanttTableTbody>
  <GanttTableTr>
    <GanttTableTd>Design</GanttTableTd>
    <GanttTableTd>Jan 1</GanttTableTd>
  </GanttTableTr>
</GanttTableTbody>
```

## Keyboard

- None built-in — keyboard navigation handled at the GanttTable grid level.

## Accessibility

- <tbody> provides structural body semantics for the table

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
