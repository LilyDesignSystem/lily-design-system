# GanttTableCol

A column header cell within a `GanttTable`. Renders a `<th scope="col">` element, intended to live inside a `GanttTableRow` within `GanttTableHead`, where it labels a time-period column.

## What it is

A Svelte 5 component that renders `<th class="gantt-table-col ..." scope="col">` with optional `colspan` and `rowspan` attributes. Renders header text via `children`.

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

- For task data cells — use `GanttTableData`.
- For row headers — use a `<th scope="row">` directly inside `GanttTableRow`.
- For column-wide styling hooks via `<colgroup>` / `<col>` — write those directly inside `GanttTable`.

## How to use it

Place `GanttTableCol` elements inside a `GanttTableRow` within `GanttTableHead`, one per time-period column.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-col` class.
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
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableCol from "./GanttTableCol.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Project schedule">
    <GanttTableHead>
        <GanttTableRow>
            <GanttTableCol>Task</GanttTableCol>
            <GanttTableCol>W1</GanttTableCol>
            <GanttTableCol>W2</GanttTableCol>
            <GanttTableCol>W3</GanttTableCol>
            <GanttTableCol>W4</GanttTableCol>
        </GanttTableRow>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableRow>
            <th scope="row">Design</th>
            <GanttTableData />
            <GanttTableData />
            <GanttTableData />
            <GanttTableData />
        </GanttTableRow>
    </GanttTableBody>
</GanttTable>
```

### Grouped quarter and month headers

```svelte
<GanttTableHead>
    <GanttTableRow>
        <GanttTableCol rowspan={2}>Task</GanttTableCol>
        <GanttTableCol colspan={3} scope="colgroup">Q1</GanttTableCol>
        <GanttTableCol colspan={3} scope="colgroup">Q2</GanttTableCol>
    </GanttTableRow>
    <GanttTableRow>
        <GanttTableCol>Jan</GanttTableCol>
        <GanttTableCol>Feb</GanttTableCol>
        <GanttTableCol>Mar</GanttTableCol>
        <GanttTableCol>Apr</GanttTableCol>
        <GanttTableCol>May</GanttTableCol>
        <GanttTableCol>Jun</GanttTableCol>
    </GanttTableRow>
</GanttTableHead>
```

### Dynamic column headers

```svelte
<script lang="ts">
    const weeks = [1, 2, 3, 4];
</script>

<GanttTableHead>
    <GanttTableRow>
        <GanttTableCol>Task</GanttTableCol>
        {#each weeks as w}<GanttTableCol>W{w}</GanttTableCol>{/each}
    </GanttTableRow>
</GanttTableHead>
```

## Accessibility

- `<th scope="col">` associates the header with its column for assistive tech.
- Use `scope="colgroup"` together with `colspan` for grouped column headers.

## Related components

- `GanttTable` - parent grid.
- `GanttTableHead` / `GanttTableBody` / `GanttTableFoot` - sections.
- `GanttTableRow` - row wrapper.
- `GanttTableData` - data cell primitive.
- `DataTableCol`, `CalendarTableCol`, `KanbanTableCol`, `TableCol` - sibling header-cell components in other tables.
