# CalendarTableHead

## Overview

The header section of a CalendarTable, rendered as a <thead> element.
Contains CalendarTableRow elements with day-of-week column headers.

## What it does

A calendar table interactive grid thead for managing dates, days, etc. <thead>.

## When to use

- Use when you need a calendar table interactive grid thead for managing dates, days, etc. <thead>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CalendarTableHead>
  <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th></CalendarTableRow>
</CalendarTableHead>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | CalendarTableRow elements with header cells. |
| `...restProps` | additional HTML attributes spread onto the <thead> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarTableHead from "$lib/components/CalendarTableHead/CalendarTableHead.svelte";
</script>

<CalendarTableHead>
  <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th></CalendarTableRow>
</CalendarTableHead>
```

## Keyboard

- None built-in — keyboard navigation handled at the CalendarTable grid level.

## Accessibility

- <thead> provides structural header semantics for the table

## References

- HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead
