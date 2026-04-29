# CalendarTableData

A single day cell in a `CalendarTable`. Renders a `<td>` with `role="gridcell"`, supporting selected and today states via ARIA and a roving-tabindex pattern (`tabindex="0"` when selected, `-1` otherwise).

## What it is

A headless Svelte 5 leaf cell. Category: calendar grid cell primitive, inside a `CalendarTableRow`.

## What it does

- Renders `<td class="calendar-table-data {className}" role="gridcell" aria-selected={selected || undefined} aria-current={today ? "date" : undefined} tabindex={selected ? 0 : -1}>`.
- `aria-selected="true"` only when `selected` is true.
- `aria-current="date"` only when `today` is true.
- Roving tabindex puts focus on the selected cell; other cells are skipped (`-1`).
- Spreads additional HTML attributes onto the `<td>`.

## When to use it

- Inside a `CalendarTableRow` to represent each day.
- In date pickers, range pickers, and schedule views.

## When not to use it

- Outside a `CalendarTable` — use `DataTableData`, `GanttTableTd`, `KanbanTableData`, or `TableData`.
- As a header cell — use a plain `<th>` inside `CalendarTableHead`.

## How to use it

Import `CalendarTableData` from `./CalendarTableData.svelte`. Pass children for the day content. Set `selected` and `today` as needed.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-data`.
- `selected` — boolean, default `false`. Whether the cell is selected.
- `today` — boolean, default `false`. Whether the cell represents today.
- `children` — `Snippet`, required. Cell content, typically the day number.
- `...restProps` — additional HTML attributes spread onto the `<td>`.

## Usage

### Regular day cell

```svelte
<script lang="ts">
  import CalendarTableData from './CalendarTableData.svelte';
</script>

<CalendarTableData>22</CalendarTableData>
```

### Selected and today

```svelte
<script lang="ts">
  import CalendarTableData from './CalendarTableData.svelte';
</script>

<CalendarTableData selected today>15</CalendarTableData>
```

### In a row

```svelte
<script lang="ts">
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from './CalendarTableData.svelte';

  let selected = $state(15);
</script>

<CalendarTableRow>
  {#each [14, 15, 16] as d}
    <CalendarTableData selected={d === selected} onclick={() => (selected = d)}>
      {d}
    </CalendarTableData>
  {/each}
</CalendarTableRow>
```

### Full calendar composition

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableData from './CalendarTableData.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5, 6, 7] as d}
        <CalendarTableData today={d === 3}>{d}</CalendarTableData>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### With click handler and data attribute

```svelte
<script lang="ts">
  import CalendarTableData from './CalendarTableData.svelte';

  function pick(d: number) {
    console.log('picked', d);
  }
</script>

<CalendarTableData data-date="2025-01-15" onclick={() => pick(15)}>15</CalendarTableData>
```

## Accessibility

- `role="gridcell"` marks each cell as part of the grid widget.
- `aria-selected` reflects selection state.
- `aria-current="date"` marks today's cell.
- Roving tabindex: only the selected cell is Tab-reachable; arrow keys must be handled by the parent grid.
- Keyboard: consumers should implement arrow-key navigation, Enter/Space selection at the `CalendarTable` level.

## Related components

- `CalendarTableRow` — required parent.
- `CalendarTable` — outer grid.
- `CalendarTableHead`, `CalendarTableBody`, `CalendarTableFoot`, `CalendarTableCol` — siblings.
- `DataTableData`, `GanttTableTd`, `KanbanTableData`, `TableData` — sibling table variants.
