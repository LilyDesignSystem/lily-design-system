# CalendarTableData

## Overview

A single day cell within a CalendarTable grid. Renders as a <td> with
role="gridcell", supporting selected and today states for visual and
accessible indication. Uses a roving tabindex pattern where the selected
cell receives focus. Designed for use inside a CalendarTableRow.

## What it does

A calendar table interactive grid data cell for managing dates, days, etc. <td>.

## When to use

- Use when you need a calendar table interactive grid data cell for managing dates, days, etc. <td>.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<CalendarTableData>15</CalendarTableData>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `selected` | boolean, default false | Whether this day cell is selected. |
| `today` | boolean, default false | Whether this day cell represents today's date. |
| `children` | Snippet, required | Day content, typically the day number. |
| `...restProps` | additional HTML attributes spread onto the <td> |  |

## Examples

```svelte
<!-- Selected day that is also today -->
<CalendarTableData selected today>15</CalendarTableData>

<!-- Regular unselected day -->
<CalendarTableData>22</CalendarTableData>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarTableData from "$lib/components/CalendarTableData/CalendarTableData.svelte";
</script>

<CalendarTableData>15</CalendarTableData>
```

## Keyboard

- Tab: Focus moves to the selected cell (tabindex="0")
- Arrow keys: Typically handled by the parent CalendarTable grid navigation

## Accessibility

- role="gridcell" identifies the cell as part of a grid
- aria-selected set to true when selected; omitted otherwise
- aria-current="date" set when the cell represents today; omitted otherwise
- Roving tabindex: tabindex="0" when selected, "-1" otherwise

## Internationalization

- Day content comes through children snippet; no hardcoded strings

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
