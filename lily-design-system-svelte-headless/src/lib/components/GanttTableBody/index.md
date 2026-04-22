# GanttTableBody

The body section of a `GanttTable`, rendered as a native `<tbody>` element. It contains `GanttTableRow` elements with task data cells.

## What it is

A Svelte 5 structural wrapper that renders `<tbody class="gantt-table-body ...">{children}</tbody>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<tbody class="gantt-table-body ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tbody>`.

## When to use it

- Inside a `GanttTable` to group the body rows containing task-vs-time cells.

## When not to use it

- For header rows. Use `GanttTableHead`.
- For footer/summary rows. Use `GanttTableFoot`.
- For non-Gantt table bodies. Use `DataTableBody`, `CalendarTableBody`, `KanbanTableBody`, or `TableBody`.

## How to use it

Place inside a `GanttTable` and fill with `GanttTableRow` elements.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-body` class.
- `children` (Snippet, required) - `GanttTableRow` elements with task data cells.
- `...restProps` - Additional HTML attributes spread onto the `<tbody>`.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Project timeline">
    <GanttTableBody>
        <GanttTableRow>
            <th>Design</th>
            <GanttTableData active>---</GanttTableData>
            <GanttTableData />
        </GanttTableRow>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Release plan">
    <GanttTableHead>
        <GanttTableRow><th>Task</th><th>W1</th></GanttTableRow>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableRow>
            <th>Ship v1</th>
            <GanttTableData active>---</GanttTableData>
        </GanttTableRow>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
    const tasks = [
        { name: "Scope", active: [true, false] },
        { name: "Build", active: [false, true] },
    ];
</script>

<GanttTable label="Tasks">
    <GanttTableBody>
        {#each tasks as t}
            <GanttTableRow>
                <th>{t.name}</th>
                {#each t.active as a}
                    <GanttTableData active={a} />
                {/each}
            </GanttTableRow>
        {/each}
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Custom styling demo">
    <GanttTableBody class="striped" data-testid="gantt-body">
        <GanttTableRow><th>Row</th><GanttTableData /></GanttTableRow>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableRow from "../GanttTableRow/GanttTableRow.svelte";
    import GanttTableData from "../GanttTableData/GanttTableData.svelte";
</script>

<GanttTable label="Grouped body">
    <GanttTableBody>
        <GanttTableRow><th>Group A</th><GanttTableData active /></GanttTableRow>
    </GanttTableBody>
    <GanttTableBody>
        <GanttTableRow><th>Group B</th><GanttTableData /></GanttTableRow>
    </GanttTableBody>
</GanttTable>
```

## Accessibility

- `<tbody>` conveys structural body semantics natively.
- No additional ARIA applied; grid-level semantics live on `GanttTable` (`role="grid"`).
- Keyboard navigation is expected to be implemented by the consumer at the grid level.

## Related components

- `GanttTable` - the parent grid.
- `GanttTableHead` - header section.
- `GanttTableFoot` - footer section.
- `GanttTableRow` - row wrapper.
- `GanttTableData` - cell primitive with `role="gridcell"` and `active` state.
- `GanttTableCol` - column definition for `<colgroup>`.
