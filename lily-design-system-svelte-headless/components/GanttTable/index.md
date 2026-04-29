# GanttTable

An interactive Gantt table that displays project tasks and their timelines as a structured grid widget. Renders a `<table>` element with `role="grid"` and an accessible label, optionally accompanied by a visible `<caption>`.

## What it is

A Svelte 5 component that renders `<table role="grid">`, writing an optional `<caption>` when provided. The actual rows/cells are supplied by the composed sub-components `GanttTableThead`, `GanttTableTbody`, `GanttTableTfoot`, `GanttTableTr`, and `GanttTableTd`.

## What it does

- Renders `<table class="gantt-table ..." role="grid" aria-label={label}>`.
- When `caption` is provided, emits `<caption>{caption}</caption>` as the first child of the table.
- Renders the `children` snippet (expected to be `GanttTableThead` / `GanttTableTbody` / `GanttTableTfoot`) inside the table.
- Spreads extra attributes onto the `<table>` element.

## When to use it

- Project management tools that schedule tasks over a time axis.
- Resource planning views showing which resources are busy during which time periods.
- Any tabular visualisation of tasks vs. time with discrete columns per time period.

## When not to use it

- For non-time-based tabular data. Use `DataTable`.
- For a status-based kanban board. Use `KanbanTable`.
- For a calendar-by-date grid. Use `CalendarTable`.
- For a plain generic table. Use `Table`.

## How to use it

Import `GanttTable` along with the sub-components and compose head/body/foot rows. Each row mixes native `<th>` cells for task labels or time-period headers with `GanttTableTd` cells for the cells representing time periods.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table` class.
- `label` (string, required) - Accessible name via `aria-label`.
- `caption` (string, optional) - Visible `<caption>` text.
- `children` (Snippet, required) - `GanttTableThead` / `GanttTableTbody` / `GanttTableTfoot` elements.
- `...restProps` - Additional HTML attributes spread onto the `<table>` element.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableThead from "../GanttTableThead/GanttTableThead.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Project timeline" caption="Q2 plan">
    <GanttTableThead>
        <GanttTableTr>
            <th>Task</th>
            <th>Week 1</th>
            <th>Week 2</th>
            <th>Week 3</th>
        </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <th>Design</th>
            <GanttTableTd active>---</GanttTableTd>
            <GanttTableTd />
            <GanttTableTd />
        </GanttTableTr>
        <GanttTableTr>
            <th>Development</th>
            <GanttTableTd />
            <GanttTableTd active>---</GanttTableTd>
            <GanttTableTd active>---</GanttTableTd>
        </GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableThead from "../GanttTableThead/GanttTableThead.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTfoot from "../GanttTableTfoot/GanttTableTfoot.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable label="Release plan">
    <GanttTableThead>
        <GanttTableTr>
            <th>Feature</th><th>Jan</th><th>Feb</th><th>Mar</th>
        </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <th>Auth</th>
            <GanttTableTd active />
            <GanttTableTd active />
            <GanttTableTd />
        </GanttTableTr>
    </GanttTableTbody>
    <GanttTableTfoot>
        <GanttTableTr>
            <GanttTableTd>Total: 1 feature</GanttTableTd>
        </GanttTableTr>
    </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableThead from "../GanttTableThead/GanttTableThead.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
    import GanttTableTh from "../GanttTableTh/GanttTableTh.svelte";
</script>

<GanttTable label="Schedule with columns">
    <colgroup>
        <GanttTableTh />
        <GanttTableTh span={3} />
    </colgroup>
    <GanttTableThead>
        <GanttTableTr>
            <th>Task</th><th>W1</th><th>W2</th><th>W3</th>
        </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        <GanttTableTr>
            <th>Research</th>
            <GanttTableTd active />
            <GanttTableTd />
            <GanttTableTd />
        </GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableThead from "../GanttTableThead/GanttTableThead.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
    const weeks = ["W1", "W2", "W3", "W4"];
    const tasks = [
        { name: "Design", active: [true, true, false, false] },
        { name: "Build", active: [false, true, true, true] },
    ];
</script>

<GanttTable label="Four week plan">
    <GanttTableThead>
        <GanttTableTr>
            <th>Task</th>
            {#each weeks as w}<th>{w}</th>{/each}
        </GanttTableTr>
    </GanttTableThead>
    <GanttTableTbody>
        {#each tasks as t}
            <GanttTableTr>
                <th>{t.name}</th>
                {#each t.active as active}
                    <GanttTableTd {active}>{active ? "---" : ""}</GanttTableTd>
                {/each}
            </GanttTableTr>
        {/each}
    </GanttTableTbody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableTbody from "../GanttTableTbody/GanttTableTbody.svelte";
    import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
    import GanttTableTd from "../GanttTableTd/GanttTableTd.svelte";
</script>

<GanttTable
    label="Sprint plan"
    class="sprint-gantt"
    data-testid="sprint-gantt"
>
    <GanttTableTbody>
        <GanttTableTr>
            <th>Ticket 1</th>
            <GanttTableTd active>▮</GanttTableTd>
        </GanttTableTr>
    </GanttTableTbody>
</GanttTable>
```

## Accessibility

- `role="grid"` turns the table into an interactive grid widget for assistive tech.
- `aria-label` gives the grid a name; `<caption>` provides a visible accessible name.
- Row cells representing active time periods use `aria-selected="true"` and a roving `tabindex`, wired in `GanttTableTd`.
- Consumers are expected to implement Arrow-key grid navigation (the component does not ship keyboard handlers).

## Related components

- `GanttTableThead`, `GanttTableTbody`, `GanttTableTfoot` - structural sections.
- `GanttTableTr`, `GanttTableTd`, `GanttTableTh` - row, cell, and column primitives.
- `DataTable` - non-time-based tabular data.
- `CalendarTable` - calendar-by-date grid.
- `KanbanTable` - status-based board grid.
- `Table` - generic table.
