# KanbanTableFoot

KanbanTableFoot is a headless Svelte 5 component representing the footer section of a `KanbanTable`. It renders a `<tfoot>` element and contains `KanbanTableRow` elements with summary or aggregate data cells.

## What it is

A structural wrapper around the native `<tfoot>` element. It marks the summary or totals section of a Kanban board but has no interactive behaviour, state, or styling.

## What it does

- Renders a `<tfoot>` with `class="kanban-table-foot"` plus any consumer-provided CSS class.
- Renders the required `children` snippet, which should be one or more `KanbanTableRow` elements with footer cells.
- Spreads `...restProps` onto the `<tfoot>` for consumer customization.

## When to use it

- Showing per-column totals or aggregate counts at the bottom of a Kanban board.
- Displaying summary metrics such as total story points per workflow stage.
- Hosting action cells (e.g., "Add task") at the bottom of each column.

## When not to use it

- Do not use outside a `KanbanTable` — `<tfoot>` is only valid inside `<table>`.
- Do not use for workflow-stage column headers — use `KanbanTableHead`.
- Do not use for data rows — use `KanbanTableBody`.

## How to use it

Place `KanbanTableFoot` after `KanbanTableBody` inside a `KanbanTable`, and nest `KanbanTableRow` elements containing summary cells.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-foot` class.
- `children` (Snippet, required) — `KanbanTableRow` elements with footer cells.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<tfoot>`.

## Usage

### Basic footer with column totals

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTable label="Board">
    <KanbanTableHead>
        <KanbanTableRow>
            <th>To Do</th>
            <th>Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableData>A</KanbanTableData>
            <KanbanTableData>B</KanbanTableData>
        </KanbanTableRow>
    </KanbanTableBody>
    <KanbanTableFoot>
        <KanbanTableRow>
            <KanbanTableData>Total: 3</KanbanTableData>
            <KanbanTableData>Total: 5</KanbanTableData>
        </KanbanTableRow>
    </KanbanTableFoot>
</KanbanTable>
```

### Footer with "Add" action cells

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableFoot>
    <KanbanTableRow>
        <KanbanTableData>
            <button type="button">+ Add to To Do</button>
        </KanbanTableData>
        <KanbanTableData>
            <button type="button">+ Add to Doing</button>
        </KanbanTableData>
        <KanbanTableData>
            <button type="button">+ Add to Done</button>
        </KanbanTableData>
    </KanbanTableRow>
</KanbanTableFoot>
```

### Footer summary bound to state

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";

    let totals = $state([3, 5, 2]);
    let labels = $state(["To Do", "Doing", "Done"]);
</script>

<KanbanTableFoot>
    <KanbanTableRow>
        {#each totals as t, i}
            <KanbanTableData label={`${labels[i]} total`}>
                {labels[i]}: {t}
            </KanbanTableData>
        {/each}
    </KanbanTableRow>
</KanbanTableFoot>
```

### Footer with consumer CSS class

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableFoot class="foot-totals">
    <KanbanTableRow>
        <KanbanTableData>12 pts</KanbanTableData>
        <KanbanTableData>8 pts</KanbanTableData>
        <KanbanTableData>20 pts</KanbanTableData>
    </KanbanTableRow>
</KanbanTableFoot>
```

### Footer with multiple summary rows

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableFoot>
    <KanbanTableRow>
        <KanbanTableData>Count: 3</KanbanTableData>
        <KanbanTableData>Count: 2</KanbanTableData>
    </KanbanTableRow>
    <KanbanTableRow>
        <KanbanTableData>Points: 8</KanbanTableData>
        <KanbanTableData>Points: 5</KanbanTableData>
    </KanbanTableRow>
</KanbanTableFoot>
```

## Accessibility

- `<tfoot>` provides structural footer semantics for the table.
- No additional ARIA needed — the parent `KanbanTable` provides `role="grid"` and the `aria-label`.
- Cells inside footer rows still participate in grid semantics via `KanbanTableData`.

## Related components

- `KanbanTable` — the root `<table role="grid">`.
- `KanbanTableHead` — the `<thead>` section with stage columns.
- `KanbanTableBody` — the `<tbody>` section with data rows.
- `KanbanTableRow` — a `<tr>` row.
- `KanbanTableData` — a `<td role="gridcell">` data cell.
- `KanbanTableCol` — `<col>` column definitions for `<colgroup>`.
