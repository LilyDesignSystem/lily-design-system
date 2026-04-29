# CalendarTableTD

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
<CalendarTableTD>15</CalendarTableTD>
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
<CalendarTableTD selected today>15</CalendarTableTD>

<!-- Regular unselected day -->
<CalendarTableTD>22</CalendarTableTD>
```

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import CalendarTableTD from "$lib/components/CalendarTableTD/CalendarTableTD.svelte";
</script>

<CalendarTableTD>15</CalendarTableTD>
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

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
