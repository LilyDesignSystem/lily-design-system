# CalendarTableBody

## Overview

The body section of a CalendarTable, rendered as a <tbody> element.
Contains CalendarTableRow elements with day data cells.

## What it does

A calendar table interactive grid tbody for managing dates, days, etc. <tbody>.

## When to use

- Use when you need a calendar table interactive grid tbody for managing dates, days, etc. <tbody>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CalendarTableBody>
  <CalendarTableRow>
    <CalendarTableData>1</CalendarTableData>
    <CalendarTableData>2</CalendarTableData>
  </CalendarTableRow>
</CalendarTableBody>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | CalendarTableRow elements with data cells. |
| `...restProps` | additional HTML attributes spread onto the <tbody> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarTableBody from "$lib/components/CalendarTableBody/CalendarTableBody.svelte";
</script>

<CalendarTableBody>
  <CalendarTableRow>
    <CalendarTableData>1</CalendarTableData>
    <CalendarTableData>2</CalendarTableData>
  </CalendarTableRow>
</CalendarTableBody>
```

## Keyboard

- None built-in — keyboard navigation handled at the CalendarTable grid level.

## Accessibility

- <tbody> provides structural body semantics for the table

## References

- HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
