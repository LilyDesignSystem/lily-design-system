# CalendarRangePicker

## Overview

A headless container for calendar-based date range selection. Renders a <div>
with role="application" to support rich keyboard interactions beyond standard
navigation. Used in booking systems, travel planners, analytics dashboards,
and reporting tools where users define start and end dates.

## What it does

A picker for selecting a date range on a calendar.

## When to use

- Use when the user should choose from a bounded set of visual options.

## When not to use

- Do not use when a simple `<Select>` or radio group would communicate options better.

## Usage

```svelte
<CalendarRangePicker label="Select dates">
  <!-- calendar grid -->
</CalendarRangePicker>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the picker purpose. |
| `children` | Snippet, required | Calendar grid content including date cells and navigation controls. |
| `...restProps` | additional HTML attributes spread onto the <div> |  |

## Examples

```svelte
<!-- Travel date range picker -->
<CalendarRangePicker label="Select travel dates">
  <CalendarTable label="January 2025">
    <!-- date cells with range highlighting -->
  </CalendarTable>
</CalendarRangePicker>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarRangePicker from "$lib/components/CalendarRangePicker/CalendarRangePicker.svelte";
</script>

<CalendarRangePicker label="Select dates">
  <!-- calendar grid -->
</CalendarRangePicker>
```

## Keyboard

- None built-in — the consumer should implement date cell navigation (arrow keys),
- selection (Enter/Space), and range extension (Shift+click) as appropriate.

## Accessibility

- role="application" indicates the widget manages its own keyboard interactions
- aria-label provides an accessible name for the calendar range picker

## Internationalization

- Label text comes through the label prop; no hardcoded strings
- All date content and navigation is provided by the consumer

## References

- WAI-ARIA Application Role: https://www.w3.org/TR/wai-aria-1.2/#application
- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
