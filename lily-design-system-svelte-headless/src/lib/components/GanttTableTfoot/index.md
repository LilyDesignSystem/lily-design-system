# GanttTableTfoot

The footer section of a `GanttTable`, rendered as a native `<tfoot>` element. It contains `GanttTableTr` elements with summary or aggregate data cells.

## What it is

A Svelte 5 structural wrapper that renders `<tfoot class="gantt-table-tfoot ...">{children}</tfoot>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<tfoot class="gantt-table-tfoot ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tfoot>`.

## When to use it

- Summary rows under a `GanttTableTbody` - totals, averages, aggregates.
- Notes or legends that belong inside the table structure.

## When not to use it

- For body rows. Use `GanttTableTbody`.
- For header rows. Use `GanttTableThead`.
- For footer content outside the table. Use `Footer`.

## How to use it

Place inside a `GanttTable` after `GanttTableTbody` and populate with `GanttTableTr` elements.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-tfoot` class.
- `children` (Snippet, required) - `GanttTableTr` elements with footer cells.
- `...restProps` - Additional HTML attributes spread onto the `<tfoot>`.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTfoot from "./GanttTableTfoot.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Plan">
    <GanttTableTfoot>
        <GanttTableTr>
            <GanttTableTd>Total: 12 tasks</GanttTableTd>
        </GanttTableTr>
    </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableThead from "../GanttTableThead/GanttTableThead.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTfoot from "./GanttTableTfoot.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Sprint">
    <GanttTableThead>
        <GanttTableTr><th>Task</th><th>W1</th><th>W2</th></GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <th>Implement</th>
            <GanttTableTd active />
            <GanttTableTd />
        </GanttTableTr>
    </GanttTableTbody>
    <GanttTableTfoot>
        <GanttTableTr>
            <GanttTableTd colspan="3">1 task in sprint</GanttTableTd>
        </GanttTableTr>
    </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTfoot from "./GanttTableTfoot.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Usage">
    <GanttTableTfoot class="summary-row" data-testid="gantt-foot">
        <GanttTableTr>
            <GanttTableTd>Total utilisation: 68%</GanttTableTd>
        </GanttTableTr>
    </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTfoot from "./GanttTableTfoot.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
    const totals = [3, 4, 1];
</script>

<GanttTable label="Totals">
    <GanttTableTfoot>
        <GanttTableTr>
            <th>Total</th>
            {#each totals as t}<GanttTableTd>{t}</GanttTableTd>{/each}
        </GanttTableTr>
    </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableTfoot from "./GanttTableTfoot.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Legend">
    <GanttTableTfoot>
        <GanttTableTr>
            <GanttTableTd>--- = scheduled</GanttTableTd>
            <GanttTableTd>◆ = milestone</GanttTableTd>
        </GanttTableTr>
    </GanttTableTfoot>
</GanttTable>
```

## Accessibility

- `<tfoot>` conveys structural footer semantics to assistive tech.
- No additional ARIA applied; grid semantics live on `GanttTable`.

## Related components

- `GanttTable` - parent grid.
- `GanttTableThead` - header section.
- `GanttTableTbody` - body section.
- `GanttTableTr` - row wrapper.
- `GanttTableTd` - data cell primitive.
- `GanttTableTh` - column definition.
