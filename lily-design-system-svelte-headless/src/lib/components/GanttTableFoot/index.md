# GanttTableFoot

The footer section of a `GanttTable`, rendered as a native `<tfoot>` element. It contains `GanttTableRow` elements with summary or aggregate data cells.

## What it is

A Svelte 5 structural wrapper that renders `<tfoot class="gantt-table-foot ...">{children}</tfoot>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<tfoot class="gantt-table-foot ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tfoot>`.

## When to use it

- Summary rows under a `GanttTableBody` - totals, averages, aggregates.
- Notes or legends that belong inside the table structure.

## When not to use it

- For body rows. Use `GanttTableBody`.
- For header rows. Use `GanttTableHead`.
- For footer content outside the table. Use `Footer`.

## How to use it

Place inside a `GanttTable` after `GanttTableBody` and populate with `GanttTableRow` elements.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-foot` class.
- `children` (Snippet, required) - `GanttTableRow` elements with footer cells.
- `...restProps` - Additional HTML attributes spread onto the `<tfoot>`.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableFoot from "./GanttTableFoot.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Plan">
    <GanttTableFoot>
        <GanttTableRow>
            <GanttTableData>Total: 12 tasks</GanttTableData>
        </GanttTableRow>
    </GanttTableFoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableFoot from "./GanttTableFoot.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Sprint">
    <GanttTableHead>
        <GanttTableRow><th>Task</th><th>W1</th><th>W2</th></GanttTableRow>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableRow>
            <th>Implement</th>
            <GanttTableData active />
            <GanttTableData />
        </GanttTableRow>
    </GanttTableBody>
    <GanttTableFoot>
        <GanttTableRow>
            <GanttTableData colspan="3">1 task in sprint</GanttTableData>
        </GanttTableRow>
    </GanttTableFoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableFoot from "./GanttTableFoot.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Usage">
    <GanttTableFoot class="summary-row" data-testid="gantt-foot">
        <GanttTableRow>
            <GanttTableData>Total utilisation: 68%</GanttTableData>
        </GanttTableRow>
    </GanttTableFoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableFoot from "./GanttTableFoot.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
    const totals = [3, 4, 1];
</script>

<GanttTable label="Totals">
    <GanttTableFoot>
        <GanttTableRow>
            <th>Total</th>
            {#each totals as t}<GanttTableData>{t}</GanttTableData>{/each}
        </GanttTableRow>
    </GanttTableFoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableFoot from "./GanttTableFoot.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Legend">
    <GanttTableFoot>
        <GanttTableRow>
            <GanttTableData>--- = scheduled</GanttTableData>
            <GanttTableData>◆ = milestone</GanttTableData>
        </GanttTableRow>
    </GanttTableFoot>
</GanttTable>
```

## Accessibility

- `<tfoot>` conveys structural footer semantics to assistive tech.
- No additional ARIA applied; grid semantics live on `GanttTable`.

## Related components

- `GanttTable` - parent grid.
- `GanttTableHead` - header section.
- `GanttTableBody` - body section.
- `GanttTableRow` - row wrapper.
- `GanttTableData` - data cell primitive.
- `GanttTableCol` - column definition.
