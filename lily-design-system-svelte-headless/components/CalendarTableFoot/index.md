# CalendarTableFoot

The footer section of a `CalendarTable`. Renders a `<tfoot>` for summary or aggregate rows (e.g. week totals).

## What it is

A headless Svelte 5 structural wrapper. Category: calendar grid structural primitive, sibling of `CalendarTableHead` and `CalendarTableBody`; inside a `CalendarTable`.

## What it does

- Renders `<tfoot class="calendar-table-foot {className}">`.
- Spreads additional HTML attributes onto the `<tfoot>`.
- No behavior — purely structural.

## When to use it

- For summary rows at the bottom of a calendar (e.g. "Week total", "Month total").
- For footnotes about the calendar data.

## When not to use it

- Outside a `CalendarTable`.
- For month-navigation controls — use `Button` with your own layout.

## How to use it

Import `CalendarTableFoot` from `./CalendarTableFoot.svelte`. Place inside `CalendarTable` after `CalendarTableBody`.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-foot`.
- `children` — `Snippet`, required. `CalendarTableRow` elements with footer cells.
- `...restProps` — additional HTML attributes spread onto the `<tfoot>`.

## Usage

### Week total row

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from '../CalendarTableData/CalendarTableData.svelte';
</script>

<CalendarTable label="Week view">
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5] as d}
        <CalendarTableData>{d}</CalendarTableData>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
  <CalendarTableFoot>
    <CalendarTableRow>
      <CalendarTableData>Week Total: 5</CalendarTableData>
    </CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

### Summary footer

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from '../CalendarTableData/CalendarTableData.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableFoot>
    <CalendarTableRow>
      <CalendarTableData>31 days, 5 weekends</CalendarTableData>
    </CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

### With data hook

```svelte
<script lang="ts">
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from '../CalendarTableData/CalendarTableData.svelte';
</script>

<CalendarTableFoot data-section="summary">
  <CalendarTableRow>
    <CalendarTableData>Total: 31</CalendarTableData>
  </CalendarTableRow>
</CalendarTableFoot>
```

### Conditional foot

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from '../CalendarTableData/CalendarTableData.svelte';

  let showTotals = $state(true);
</script>

<CalendarTable label="Week">
  <CalendarTableBody>
    <CalendarTableRow><CalendarTableData>1</CalendarTableData></CalendarTableRow>
  </CalendarTableBody>
  {#if showTotals}
    <CalendarTableFoot>
      <CalendarTableRow><CalendarTableData>Total: 1</CalendarTableData></CalendarTableRow>
    </CalendarTableFoot>
  {/if}
</CalendarTable>
```

### Multiple footer rows

```svelte
<script lang="ts">
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from '../CalendarTableData/CalendarTableData.svelte';
</script>

<CalendarTableFoot>
  <CalendarTableRow><CalendarTableData>Weekdays: 21</CalendarTableData></CalendarTableRow>
  <CalendarTableRow><CalendarTableData>Weekends: 10</CalendarTableData></CalendarTableRow>
</CalendarTableFoot>
```

## Accessibility

- `<tfoot>` provides structural footer semantics; no ARIA override.
- Keyboard navigation is handled at the `CalendarTable` grid level.

## Related components

- `CalendarTable`, `CalendarTableHead`, `CalendarTableBody`, `CalendarTableRow`, `CalendarTableData`, `CalendarTableCol`.
- `DataTableFoot`, `GanttTableFoot`, `KanbanTableFoot`, `TableFoot`.
