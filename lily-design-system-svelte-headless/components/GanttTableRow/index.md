# GanttTableRow

A single row within a `GanttTable` grid. Renders a native `<tr>` element containing `GanttTableData` cells for each time period, along with optional `<th>` header cells.

## What it is

A Svelte 5 structural wrapper that renders `<tr class="gantt-table-row ...">{children}</tr>`. It carries no internal state, no explicit ARIA role (the `<tr>` has an implicit `row` role inside a grid), and no styling.

## What it does

- Renders `<tr class="gantt-table-row ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tr>`.

## When to use it

- Inside `GanttTableHead` for header rows containing `<th>` column labels.
- Inside `GanttTableBody` for task rows that mix `<th>` task labels with `GanttTableData` time-period cells.
- Inside `GanttTableFoot` for summary rows.

## When not to use it

- For rows in non-Gantt tables. Use `DataTableRow`, `CalendarTableRow`, `KanbanTableRow`, or `TableRow`.
- Outside a `GanttTable` family - a bare `<tr>` is invalid HTML.

## How to use it

Place inside `GanttTableHead`, `GanttTableBody`, or `GanttTableFoot`. Add cells as children.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-row` class.
- `children` (Snippet, required) - Cells (`GanttTableData` and/or native `<th>`).
- `...restProps` - Additional HTML attributes spread onto the `<tr>`.

## Usage

```svelte
<script lang="ts">
    import GanttTableRow from "./GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTableRow>
    <th>Design</th>
    <GanttTableData active>---</GanttTableData>
    <GanttTableData />
</GanttTableRow>
```

```svelte
<script lang="ts">
    import GanttTableRow from "./GanttTableRow.svelte";
</script>

<GanttTableRow>
    <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
</GanttTableRow>
```

```svelte
<script lang="ts">
    import GanttTableRow from "./GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
    const task = { name: "Build", periods: [false, true, true, false] };
</script>

<GanttTableRow>
    <th>{task.name}</th>
    {#each task.periods as p}
        <GanttTableData active={p}>{p ? "---" : ""}</GanttTableData>
    {/each}
</GanttTableRow>
```

```svelte
<script lang="ts">
    import GanttTableRow from "./GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTableRow class="critical-path" data-testid="row-critical">
    <th>Launch</th>
    <GanttTableData />
    <GanttTableData active>◆</GanttTableData>
</GanttTableRow>
```

```svelte
<script lang="ts">
    import GanttTableRow from "./GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
    const rows = [
        { name: "Scope", active: [true] },
        { name: "Build", active: [false] },
    ];
</script>

{#each rows as r}
    <GanttTableRow>
        <th>{r.name}</th>
        {#each r.active as a}
            <GanttTableData active={a} />
        {/each}
    </GanttTableRow>
{/each}
```

## Accessibility

- `<tr>` has an implicit role of `row` when inside a grid; no explicit role is added.
- Column headers should use native `<th scope="col">` within header rows.
- Row header cells (the leftmost task label) should use `<th scope="row">`.

## Related components

- `GanttTable` - parent grid.
- `GanttTableHead` / `GanttTableBody` / `GanttTableFoot` - structural sections.
- `GanttTableData` - time-period data cell with active/selected state.
- `GanttTableCol` - column definition element.
- `DataTableRow`, `CalendarTableRow`, `KanbanTableRow`, `TableRow` - row variants in other table families.
