# CalendarTableTD

## Overview

A column definition within a CalendarTable, rendered as a <col> element.
Used inside a <colgroup> to define column properties such as span.
Useful for styling entire columns of the calendar grid (e.g. weekends).

## What it does

A calendar table interactive grid column for managing dates, days, etc. <th>.

## When to use

- Use when you need a calendar table interactive grid column for managing dates, days, etc. <th>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<colgroup>
  <CalendarTableTD />
  <CalendarTableTD span={5} />
  <CalendarTableTD />
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
  import CalendarTableTD from "$lib/components/CalendarTableTD/CalendarTableTD.svelte";
</script>

<colgroup>
  <CalendarTableTD />
  <CalendarTableTD span={5} />
  <CalendarTableTD />
</colgroup>
```

## Keyboard

- None — <col> is not interactive.

## Accessibility

- <col> provides structural column semantics for the table

## References

- HTML col element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col
