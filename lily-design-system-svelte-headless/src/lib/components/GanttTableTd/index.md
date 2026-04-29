# GanttTableTd

A single cell within a `GanttTableTr` representing a time period in the Gantt grid. Renders a `<td>` with `role="gridcell"` and supports an `active` state communicated via `aria-selected` and a roving `tabindex`.

## What it is

A Svelte 5 component that renders `<td class="gantt-table-td ..." role="gridcell">` with the optional `children` snippet as content.

## What it does

- Renders `<td class="gantt-table-td ..." role="gridcell">`.
- When `active` is true: sets `aria-selected="true"` and `tabindex="0"`.
- When `active` is false/undefined: omits `aria-selected` and sets `tabindex="-1"`.
- Renders the `children` snippet if provided; otherwise the cell is empty (representing an inactive time period).
- Spreads additional HTML attributes onto the `<td>`.

## When to use it

- To represent a single time-period cell for a task in a Gantt chart.
- Empty cells for inactive periods, and filled cells with bars or markers for active periods.

## When not to use it

- For non-grid tabular data cells. Use `DataTableData` or `TableData`.
- For calendar dates or kanban statuses. Use `CalendarTableData` or `KanbanTableData`.
- For column headers. Use native `<th>` inside a `GanttTableTr`.

## How to use it

Inside a `GanttTableTr`, place one `GanttTableTd` per time-period column. Set `active` on cells where the task is scheduled.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-td` class.
- `active` (boolean, default `false`) - Whether this cell represents an active time period. Controls `aria-selected` and `tabindex`.
- `children` (Snippet, optional) - Cell content, e.g. bar markers or duration text.
- `...restProps` - Additional HTML attributes spread onto the `<td>`.

## Usage

```svelte
<script lang="ts">
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "./GanttTableTd.svelte";
</script>

<GanttTableTr>
    <th>Task A</th>
    <GanttTableTd active>---</GanttTableTd>
    <GanttTableTd />
    <GanttTableTd />
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "./GanttTableTd.svelte";
</script>

<GanttTableTr>
    <th>Launch</th>
    <GanttTableTd />
    <GanttTableTd active>◆</GanttTableTd>
    <GanttTableTd />
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "./GanttTableTd.svelte";
    const period = [false, true, true, false];
</script>

<GanttTableTr>
    <th>Build</th>
    {#each period as a}
        <GanttTableTd active={a}>{a ? "---" : ""}</GanttTableTd>
    {/each}
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "./GanttTableTd.svelte";
</script>

<GanttTableTr>
    <th>QA</th>
    <GanttTableTd
        active
        class="critical"
        data-testid="cell-qa-w1"
        onclick={() => console.log("clicked")}
    >
        ●
    </GanttTableTd>
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "./GanttTableTd.svelte";
    let focused = $state<number | null>(null);
</script>

<GanttTableTr>
    <th>Review</th>
    {#each [0, 1, 2] as i}
        <GanttTableTd
            active={focused === i}
            onfocus={() => (focused = i)}
        >
            {focused === i ? "▮" : ""}
        </GanttTableTd>
    {/each}
</GanttTableTr>
```

## Accessibility

- `role="gridcell"` identifies the cell as part of the grid.
- `aria-selected="true"` + `tabindex="0"` on active cells enables roving-tabindex keyboard traversal.
- Inactive cells use `tabindex="-1"` so they are not in the Tab sequence, but consumers can focus them programmatically during Arrow-key navigation.
- The grid-level Arrow-key handlers must be implemented by the consumer.

## Related components

- `GanttTable` - parent grid.
- `GanttTableTr` - row wrapper (`<tr>`).
- `GanttTableThead` / `GanttTableTbody` / `GanttTableTfoot` - sections.
- `GanttTableTh` - column definition (`<col>`).
- `DataTableData`, `CalendarTableData`, `KanbanTableData`, `TableData` - data-cell variants in other table families.
