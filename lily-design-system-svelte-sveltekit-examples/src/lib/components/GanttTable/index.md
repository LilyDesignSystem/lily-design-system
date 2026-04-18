# GanttTable

## Overview

An interactive Gantt table that displays project tasks and their timelines
as a structured grid widget. Renders a <table> element with role="grid" and
an accessible label. Supports an optional visible caption. Commonly used in
project management tools and resource planning applications.

## What it does

A Gantt chart table interactive grid for planning schedule visualization <table>.

## When to use

- Use to display structured tabular data with headers and rows.

## When not to use

- Do not use when a simpler native HTML element would suffice.

## Usage

```svelte
<GanttTable label="Project timeline">
  <GanttTableHead>
    <GanttTableRow>
      <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    </GanttTableRow>
  </GanttTableHead>
  <GanttTableBody>
    <GanttTableRow>
      <th>Design</th>
      <GanttTableData active>---</GanttTableData>
      <GanttTableData />
      <GanttTableData />
    </GanttTableRow>
  </GanttTableBody>
</GanttTable>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `className` | string, optional | CSS class name. |
| `label` | string, required | Accessible name describing the Gantt table content. |
| `caption` | string, optional | Visible caption text displayed above the table. |
| `children` | Snippet, required | GanttTableHead, GanttTableBody, GanttTableFoot elements. |
| `...restProps` | additional HTML attributes spread onto the <table> |  |

## SvelteKit example

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import GanttTable from "$lib/components/GanttTable/GanttTable.svelte";
</script>

<GanttTable label="Project timeline">
  <GanttTableHead>
    <GanttTableRow>
      <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    </GanttTableRow>
  </GanttTableHead>
  <GanttTableBody>
    <GanttTableRow>
      <th>Design</th>
      <GanttTableData active>---</GanttTableData>
      <GanttTableData />
      <GanttTableData />
    </GanttTableRow>
  </GanttTableBody>
</GanttTable>
```

## Keyboard

- None built-in — consumer should implement grid keyboard navigation
- (arrow keys for cell movement, Enter/Space for selection).

## Accessibility

- role="grid" identifies the table as an interactive grid widget
- aria-label provides an accessible name describing the Gantt table
- <caption> provides a visible accessible name when the caption prop is set

## Internationalization

- The label and caption props provide all text; no hardcoded strings
- All content comes through the children snippet

## References

- WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/grid/
