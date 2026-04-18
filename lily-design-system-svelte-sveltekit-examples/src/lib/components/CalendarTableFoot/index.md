# CalendarTableFoot

## Overview

The footer section of a CalendarTable, rendered as a <tfoot> element.
Contains CalendarTableRow elements with summary or aggregate data cells.

## What it does

A calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>.

## When to use

- Use when you need a calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CalendarTableFoot>
  <CalendarTableRow>
    <CalendarTableData>Week Total: 5</CalendarTableData>
  </CalendarTableRow>
</CalendarTableFoot>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | CalendarTableRow elements with footer cells. |
| `...restProps` | additional HTML attributes spread onto the <tfoot> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarTableFoot from "$lib/components/CalendarTableFoot/CalendarTableFoot.svelte";
</script>

<CalendarTableFoot>
  <CalendarTableRow>
    <CalendarTableData>Week Total: 5</CalendarTableData>
  </CalendarTableRow>
</CalendarTableFoot>
```

## Keyboard

- None built-in — keyboard navigation handled at the CalendarTable grid level.

## Accessibility

- <tfoot> provides structural footer semantics for the table

## References

- HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot
