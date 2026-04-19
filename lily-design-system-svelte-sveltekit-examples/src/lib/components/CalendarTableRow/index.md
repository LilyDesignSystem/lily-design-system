# CalendarTableRow

## Overview

A single row within a CalendarTable grid. Renders as a <tr>,
containing CalendarTableData cells for each day in the week.
Used inside CalendarTableHead, CalendarTableBody, or CalendarTableFoot.

## What it does

A calendar table interactive grid row for managing dates, days, etc. <tr>.

## When to use

- Use when you need a calendar table interactive grid row for managing dates, days, etc. <tr>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CalendarTableRow>
  <CalendarTableData>1</CalendarTableData>
  <CalendarTableData>2</CalendarTableData>
</CalendarTableRow>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `children` | Snippet, required | CalendarTableData cells for each day in the row. |
| `...restProps` | additional HTML attributes spread onto the <tr> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarTableRow from "$lib/components/CalendarTableRow/CalendarTableRow.svelte";
</script>

<CalendarTableRow>
  <CalendarTableData>1</CalendarTableData>
  <CalendarTableData>2</CalendarTableData>
</CalendarTableRow>
```

## Keyboard

- None built-in — keyboard navigation is handled at the CalendarTable grid level.

## Accessibility

- <tr> has implicit role="row" within the grid (no explicit role needed)

## Internationalization

- All cell content comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
