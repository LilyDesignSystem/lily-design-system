# GanttTableTh

A column header cell within a `GanttTable`. Renders a `<th scope="col">` element, intended to live inside a `GanttTableTr` within `GanttTableThead`, where it labels a time-period column.

## What it is

A Svelte 5 component that renders `<th class="gantt-table-th ..." scope="col">` with optional `colspan` and `rowspan` attributes. Renders header text via `children`.

## What it does

- Renders `<th>` with `scope="col"` by default.
- Applies `colspan` / `rowspan` only when truthy.
- Accepts an alternative `scope` (e.g. `"colgroup"`).
- Renders header text via `children`.
- Spreads additional HTML attributes onto the `<th>`.

## When to use it

- For time-period column headers (days, weeks, months, milestones).
- For grouped header cells (e.g. a quarter spanning three months) via `colspan`.

## When not to use it

- For task data cells — use `GanttTableTd`.
- For row headers — use a `<th scope="row">` directly inside `GanttTableTr`.
- For column-wide styling hooks via `<colgroup>` / `<col>` — write those directly inside `GanttTable`.

## How to use it

Place `GanttTableTh` elements inside a `GanttTableTr` within `GanttTableThead`, one per time-period column.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-th` class.
- `colspan` (number, optional) - Number of columns this header spans.
- `rowspan` (number, optional) - Number of rows this header spans.
- `scope` (`"col" | "row" | "colgroup" | "rowgroup"`, default `"col"`).
- `children` (Snippet, optional) - Header cell content.
- `...restProps` - Additional HTML attributes spread onto the `<th>`.

## Usage

### Weekly columns

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "../GanttTableThead/GanttTableThead.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTh from "./GanttTableTh.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Project schedule">
    <GanttTableThead>
        <GanttTableTr>
            <GanttTableTh>Task</GanttTableTh>
            <GanttTableTh>W1</GanttTableTh>
            <GanttTableTh>W2</GanttTableTh>
            <GanttTableTh>W3</GanttTableTh>
            <GanttTableTh>W4</GanttTableTh>
        </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <th scope="row">Design</th>
            <GanttTableTd />
            <GanttTableTd />
            <GanttTableTd />
            <GanttTableTd />
        </GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

### Grouped quarter and month headers

```svelte
<GanttTableThead>
    <GanttTableTr>
        <GanttTableTh rowspan={2}>Task</GanttTableTh>
        <GanttTableTh colspan={3} scope="colgroup">Q1</GanttTableTh>
        <GanttTableTh colspan={3} scope="colgroup">Q2</GanttTableTh>
    </GanttTableTr>
    <GanttTableTr>
        <GanttTableTh>Jan</GanttTableTh>
        <GanttTableTh>Feb</GanttTableTh>
        <GanttTableTh>Mar</GanttTableTh>
        <GanttTableTh>Apr</GanttTableTh>
        <GanttTableTh>May</GanttTableTh>
        <GanttTableTh>Jun</GanttTableTh>
    </GanttTableTr>
</GanttTableThead>
```

### Dynamic column headers

```svelte
<script lang="ts">
    const weeks = [1, 2, 3, 4];
</script>

<GanttTableThead>
    <GanttTableTr>
        <GanttTableTh>Task</GanttTableTh>
        {#each weeks as w}<GanttTableTh>W{w}</GanttTableTh>{/each}
    </GanttTableTr>
</GanttTableThead>
```

## Accessibility

- `<th scope="col">` associates the header with its column for assistive tech.
- Use `scope="colgroup"` together with `colspan` for grouped column headers.

## Related components

- `GanttTable` - parent grid.
- `GanttTableThead` / `GanttTableTbody` / `GanttTableTfoot` - sections.
- `GanttTableTr` - row wrapper.
- `GanttTableTd` - data cell primitive.
- `DataTableCol`, `CalendarTableCol`, `KanbanTableCol`, `TableCol` - sibling header-cell components in other tables.
