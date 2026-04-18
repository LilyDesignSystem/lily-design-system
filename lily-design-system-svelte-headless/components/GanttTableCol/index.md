# GanttTableCol

A column definition for a `GanttTable`. Despite the name, this component renders a native `<col>` element (not `<th>`), to be used inside a `<colgroup>` for column-level styling or span declarations.

## What it is

A Svelte 5 component that renders a self-closing `<col class="gantt-table-col ..." />` with an optional `span` attribute. It is a structural element with no content and no ARIA attributes.

## What it does

- Renders `<col class="gantt-table-col ..." />`.
- If `span` is a truthy number, sets the `span` attribute; otherwise leaves it undefined.
- Spreads additional HTML attributes onto the `<col>`.

## When to use it

- Inside `<colgroup>` within a `GanttTable` to define columns for styling (e.g. weekend columns, milestone columns).
- When column grouping via `span` is needed for visual/CSS targeting of a range of time-period columns.

## When not to use it

- For a column header cell displayed in a header row. Use a native `<th>` inside `GanttTableRow`.
- For non-Gantt tables. Use `DataTableCol` (note: other `*TableCol` components in this system render `<th>`, but `GanttTableCol` renders `<col>`).
- For a row. Use `GanttTableRow`.

## How to use it

Wrap one or more `GanttTableCol` elements in a `<colgroup>` inside a `GanttTable`.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-col` class.
- `span` (number, optional) - Number of columns this `<col>` spans. When falsy/undefined, the attribute is not rendered.
- `...restProps` - Additional HTML attributes spread onto the `<col>` element.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableCol from "./GanttTableCol.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Columns example">
    <colgroup>
        <GanttTableCol />
        <GanttTableCol span={5} />
        <GanttTableCol />
    </colgroup>
    <GanttTableHead>
        <GanttTableRow><th>Task</th><th>Jan-May</th><th>Jun</th></GanttTableRow>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableRow><th>Design</th><GanttTableData active /><GanttTableData /></GanttTableRow>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTableCol from "./GanttTableCol.svelte";
</script>

<colgroup>
    <GanttTableCol class="task-column" />
    <GanttTableCol span={4} class="weeks-column" />
</colgroup>
```

```svelte
<script lang="ts">
    import GanttTableCol from "./GanttTableCol.svelte";
</script>

<colgroup>
    <GanttTableCol data-testid="col-label" />
    <GanttTableCol data-testid="col-weekdays" span={5} />
    <GanttTableCol data-testid="col-weekend" span={2} class="weekend" />
</colgroup>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableCol from "./GanttTableCol.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    const cols = [1, 2, 3, 4];
</script>

<GanttTable label="Dynamic columns">
    <colgroup>
        <GanttTableCol />
        {#each cols as _}
            <GanttTableCol />
        {/each}
    </colgroup>
    <GanttTableHead>
        <GanttTableRow>
            <th>Task</th>
            {#each cols as c}<th>W{c}</th>{/each}
        </GanttTableRow>
    </GanttTableHead>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTableCol from "./GanttTableCol.svelte";
</script>

<colgroup>
    <GanttTableCol style="width: 200px" />
    <GanttTableCol span={3} style="width: 80px" />
</colgroup>
```

## Accessibility

- `<col>` is a structural element with no interactive semantics.
- No ARIA attributes applied.
- All grid-level semantics live on `GanttTable` (`role="grid"`).

## Related components

- `GanttTable` - parent grid.
- `GanttTableHead` / `GanttTableBody` / `GanttTableFoot` - sections.
- `GanttTableRow` - row wrapper.
- `GanttTableData` - data cell primitive.
- `DataTableCol`, `CalendarTableCol`, `KanbanTableCol`, `TableCol` - column header `<th>` components in other table families.
