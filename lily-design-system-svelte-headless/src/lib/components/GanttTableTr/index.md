# GanttTableTr

A single row within a `GanttTable` grid. Renders a native `<tr>` element containing `GanttTableTd` cells for each time period, along with optional `<th>` header cells.

## What it is

A Svelte 5 structural wrapper that renders `<tr class="gantt-table-tr ...">{children}</tr>`. It carries no internal state, no explicit ARIA role (the `<tr>` has an implicit `row` role inside a grid), and no styling.

## What it does

- Renders `<tr class="gantt-table-tr ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tr>`.

## When to use it

- Inside `GanttTableThead` for header rows containing `<th>` column labels.
- Inside `GanttTableTbody` for task rows that mix `<th>` task labels with `GanttTableTd` time-period cells.
- Inside `GanttTableTfoot` for summary rows.

## When not to use it

- For rows in non-Gantt tables. Use `DataTableRow`, `CalendarTableRow`, `KanbanTableRow`, or `TableRow`.
- Outside a `GanttTable` family - a bare `<tr>` is invalid HTML.

## How to use it

Place inside `GanttTableThead`, `GanttTableTbody`, or `GanttTableTfoot`. Add cells as children.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-tr` class.
- `children` (Snippet, required) - Cells (`GanttTableTd` and/or native `<th>`).
- `...restProps` - Additional HTML attributes spread onto the `<tr>`.

## Usage

```svelte
<script lang="ts">
    import GanttTableTr from "./GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTableTr>
    <th>Design</th>
    <GanttTableTd active>---</GanttTableTd>
    <GanttTableTd />
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "./GanttTableTr.svelte";
</script>

<GanttTableTr>
    <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "./GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
    const task = { name: "Build", periods: [false, true, true, false] };
</script>

<GanttTableTr>
    <th>{task.name}</th>
    {#each task.periods as p}
        <GanttTableTd active={p}>{p ? "---" : ""}</GanttTableTd>
    {/each}
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "./GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTableTr class="critical-path" data-testid="row-critical">
    <th>Launch</th>
    <GanttTableTd />
    <GanttTableTd active>◆</GanttTableTd>
</GanttTableTr>
```

```svelte
<script lang="ts">
    import GanttTableTr from "./GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
    const rows = [
        { name: "Scope", active: [true] },
        { name: "Build", active: [false] },
    ];
</script>

{#each rows as r}
    <GanttTableTr>
        <th>{r.name}</th>
        {#each r.active as a}
            <GanttTableTd active={a} />
        {/each}
    </GanttTableTr>
{/each}
```

## Accessibility

- `<tr>` has an implicit role of `row` when inside a grid; no explicit role is added.
- Column headers should use native `<th scope="col">` within header rows.
- Row header cells (the leftmost task label) should use `<th scope="row">`.

## Related components

- `GanttTable` - parent grid.
- `GanttTableThead` / `GanttTableTbody` / `GanttTableTfoot` - structural sections.
- `GanttTableTd` - time-period data cell with active/selected state.
- `GanttTableTh` - column definition element.
- `DataTableRow`, `CalendarTableRow`, `KanbanTableRow`, `TableRow` - row variants in other table families.
