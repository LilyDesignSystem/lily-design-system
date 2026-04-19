# CalendarTable

## Overview

An interactive calendar table that presents dates in a structured grid
layout using a <table> element with role="grid". Supports an optional
visible caption. Commonly used in scheduling apps, event planners, and
date pickers.

## What it does

A calendar table interactive grid for managing dates, days, etc. <table>.

## When to use

- Use to display structured tabular data with headers and rows.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow><CalendarTableData>1</CalendarTableData></CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the calendar period (e.g. "January 2025"). |
| `caption` | string, optional | Visible caption text displayed above the table. |
| `children` | Snippet, required | CalendarTableHead, CalendarTableBody, CalendarTableFoot elements. |
| `...restProps` | additional HTML attributes spread onto the <table> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarTable from "$lib/components/CalendarTable/CalendarTable.svelte";
</script>

<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow><CalendarTableData>1</CalendarTableData></CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## Keyboard

- None built-in — consumer should implement grid keyboard navigation
- (arrow keys for cell movement, Enter/Space for selection).

## Accessibility

- role="grid" identifies the table as an interactive grid widget
- aria-label provides an accessible name describing the calendar period
- <caption> provides a visible accessible name when the caption prop is set

## Internationalization

- The label and caption props provide all text; no hardcoded strings
- Day-of-week and date content is provided by the consumer

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
