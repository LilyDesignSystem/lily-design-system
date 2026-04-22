# GanttTableHead

The header section of a `GanttTable`, rendered as a native `<thead>` element. It contains `GanttTableRow` elements with column headers for task names, dates, durations, or other Gantt-chart metadata.

## What it is

A Svelte 5 structural wrapper that renders `<thead class="gantt-table-head ...">{children}</thead>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<thead class="gantt-table-head ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<thead>`.

## When to use it

- At the top of a `GanttTable` to hold one or more header rows labelling the columns.
- When column header rows need to be visually or structurally distinct from body rows.

## When not to use it

- For body rows with task data. Use `GanttTableBody`.
- For footer/summary rows. Use `GanttTableFoot`.
- For non-Gantt table headers. Use `DataTableHead`, `CalendarTableHead`, `KanbanTableHead`, or `TableHead`.

## How to use it

Place inside a `GanttTable` before `GanttTableBody`. Populate with a `GanttTableRow` containing native `<th>` cells.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-head` class.
- `children` (Snippet, required) - `GanttTableRow` elements with header cells.
- `...restProps` - Additional HTML attributes spread onto the `<thead>`.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "./GanttTableHead.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
</script>

<GanttTable label="Plan">
    <GanttTableHead>
        <GanttTableRow>
            <th>Task</th><th>Start</th><th>End</th>
        </GanttTableRow>
    </GanttTableHead>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "./GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Weekly">
    <GanttTableHead>
        <GanttTableRow>
            <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
        </GanttTableRow>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableRow>
            <th>Plan</th>
            <GanttTableData active />
            <GanttTableData />
            <GanttTableData />
        </GanttTableRow>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "./GanttTableHead.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
</script>

<GanttTable label="Custom head">
    <GanttTableHead class="sticky-head" data-testid="gantt-head">
        <GanttTableRow>
            <th scope="col">Task</th><th scope="col">Q1</th><th scope="col">Q2</th>
        </GanttTableRow>
    </GanttTableHead>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "./GanttTableHead.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    const weeks = ["W1", "W2", "W3", "W4", "W5"];
</script>

<GanttTable label="Dynamic head">
    <GanttTableHead>
        <GanttTableRow>
            <th>Task</th>
            {#each weeks as w}<th>{w}</th>{/each}
        </GanttTableRow>
    </GanttTableHead>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "./GanttTableHead.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
</script>

<GanttTable label="Two-level head">
    <GanttTableHead>
        <GanttTableRow>
            <th rowspan="2">Task</th>
            <th colspan="2">January</th>
            <th colspan="2">February</th>
        </GanttTableRow>
        <GanttTableRow>
            <th>W1</th><th>W2</th><th>W1</th><th>W2</th>
        </GanttTableRow>
    </GanttTableHead>
</GanttTable>
```

## Accessibility

- `<thead>` conveys structural header semantics to assistive tech.
- Use native `<th scope="col">` inside `GanttTableRow` to properly associate column headers with data cells.

## Related components

- `GanttTable` - parent grid.
- `GanttTableBody` - body section.
- `GanttTableFoot` - footer section.
- `GanttTableRow` - row wrapper.
- `GanttTableData` - data cell primitive.
- `GanttTableCol` - column definition.
