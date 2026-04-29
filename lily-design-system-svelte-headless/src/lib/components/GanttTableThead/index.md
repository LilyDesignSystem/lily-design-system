# GanttTableThead

The header section of a `GanttTable`, rendered as a native `<thead>` element. It contains `GanttTableTr` elements with column headers for task names, dates, durations, or other Gantt-chart metadata.

## What it is

A Svelte 5 structural wrapper that renders `<thead class="gantt-table-thead ...">{children}</thead>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<thead class="gantt-table-thead ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<thead>`.

## When to use it

- At the top of a `GanttTable` to hold one or more header rows labelling the columns.
- When column header rows need to be visually or structurally distinct from body rows.

## When not to use it

- For body rows with task data. Use `GanttTableTbody`.
- For footer/summary rows. Use `GanttTableTfoot`.
- For non-Gantt table headers. Use `DataTableHead`, `CalendarTableHead`, `KanbanTableHead`, or `TableHead`.

## How to use it

Place inside a `GanttTable` before `GanttTableTbody`. Populate with a `GanttTableTr` containing native `<th>` cells.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-thead` class.
- `children` (Snippet, required) - `GanttTableTr` elements with header cells.
- `...restProps` - Additional HTML attributes spread onto the `<thead>`.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "./GanttTableThead.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
</script>

<GanttTable label="Plan">
    <GanttTableThead>
        <GanttTableTr>
            <th>Task</th><th>Start</th><th>End</th>
        </GanttTableTr>
    </GanttTableThead>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "./GanttTableThead.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Weekly">
    <GanttTableThead>
        <GanttTableTr>
            <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
        </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <th>Plan</th>
            <GanttTableTd active />
            <GanttTableTd />
            <GanttTableTd />
        </GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "./GanttTableThead.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
</script>

<GanttTable label="Custom head">
    <GanttTableThead class="sticky-head" data-testid="gantt-head">
        <GanttTableTr>
            <th scope="col">Task</th><th scope="col">Q1</th><th scope="col">Q2</th>
        </GanttTableTr>
    </GanttTableThead>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "./GanttTableThead.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    const weeks = ["W1", "W2", "W3", "W4", "W5"];
</script>

<GanttTable label="Dynamic head">
    <GanttTableThead>
        <GanttTableTr>
            <th>Task</th>
            {#each weeks as w}<th>{w}</th>{/each}
        </GanttTableTr>
    </GanttTableThead>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "./GanttTableThead.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
</script>

<GanttTable label="Two-level head">
    <GanttTableThead>
        <GanttTableTr>
            <th rowspan="2">Task</th>
            <th colspan="2">January</th>
            <th colspan="2">February</th>
        </GanttTableTr>
        <GanttTableTr>
            <th>W1</th><th>W2</th><th>W1</th><th>W2</th>
        </GanttTableTr>
    </GanttTableThead>
</GanttTable>
```

## Accessibility

- `<thead>` conveys structural header semantics to assistive tech.
- Use native `<th scope="col">` inside `GanttTableTr` to properly associate column headers with data cells.

## Related components

- `GanttTable` - parent grid.
- `GanttTableTbody` - body section.
- `GanttTableTfoot` - footer section.
- `GanttTableTr` - row wrapper.
- `GanttTableTd` - data cell primitive.
- `GanttTableTh` - column definition.
