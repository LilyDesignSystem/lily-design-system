# GanttTableTbody

The body section of a `GanttTable`, rendered as a native `<tbody>` element. It contains `GanttTableTr` elements with task data cells.

## What it is

A Svelte 5 structural wrapper that renders `<tbody class="gantt-table-tbody ...">{children}</tbody>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<tbody class="gantt-table-tbody ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tbody>`.

## When to use it

- Inside a `GanttTable` to group the body rows containing task-vs-time cells.

## When not to use it

- For header rows. Use `GanttTableThead`.
- For footer/summary rows. Use `GanttTableTfoot`.
- For non-Gantt table bodies. Use `DataTableBody`, `CalendarTableBody`, `KanbanTableBody`, or `TableBody`.

## How to use it

Place inside a `GanttTable` and fill with `GanttTableTr` elements.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-tbody` class.
- `children` (Snippet, required) - `GanttTableTr` elements with task data cells.
- `...restProps` - Additional HTML attributes spread onto the `<tbody>`.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTbody from "./GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Project timeline">
    <GanttTableTbody>
        <GanttTableTr>
            <th>Design</th>
            <GanttTableTd active>---</GanttTableTd>
            <GanttTableTd />
        </GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "../GanttTableThead/GanttTableThead.svelte";
    import GanttTableTbody from "./GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Release plan">
    <GanttTableThead>
        <GanttTableTr><th>Task</th><th>W1</th></GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <th>Ship v1</th>
            <GanttTableTd active>---</GanttTableTd>
        </GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTbody from "./GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
    const tasks = [
        { name: "Scope", active: [true, false] },
        { name: "Build", active: [false, true] },
    ];
</script>

<GanttTable label="Tasks">
    <GanttTableTbody>
        {#each tasks as t}
            <GanttTableTr>
                <th>{t.name}</th>
                {#each t.active as a}
                    <GanttTableTd active={a} />
                {/each}
            </GanttTableTr>
        {/each}
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTbody from "./GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Custom styling demo">
    <GanttTableTbody class="striped" data-testid="gantt-body">
        <GanttTableTr><th>Row</th><GanttTableTd /></GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTbody from "./GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Grouped body">
    <GanttTableTbody>
        <GanttTableTr><th>Group A</th><GanttTableTd active /></GanttTableTr>
    </GanttTableTbody>
    <GanttTableTbody>
        <GanttTableTr><th>Group B</th><GanttTableTd /></GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

## Accessibility

- `<tbody>` conveys structural body semantics natively.
- No additional ARIA applied; grid-level semantics live on `GanttTable` (`role="grid"`).
- Keyboard navigation is expected to be implemented by the consumer at the grid level.

## Related components

- `GanttTable` - the parent grid.
- `GanttTableThead` - header section.
- `GanttTableTfoot` - footer section.
- `GanttTableTr` - row wrapper.
- `GanttTableTd` - cell primitive with `role="gridcell"` and `active` state.
- `GanttTableTh` - column definition for `<colgroup>`.
