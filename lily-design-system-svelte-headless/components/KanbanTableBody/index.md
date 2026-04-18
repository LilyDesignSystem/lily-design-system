# KanbanTableBody

KanbanTableBody is a headless Svelte 5 component representing the body section of a `KanbanTable`. It renders a `<tbody>` element and contains `KanbanTableRow` elements with task data cells.

## What it is

A structural wrapper around the native `<tbody>` element. It contributes table-body semantics to a Kanban board but has no interactive behaviour, no state, and no styling.

## What it does

- Renders a `<tbody>` with `class="kanban-table-body"` plus any consumer-provided CSS class.
- Renders the required `children` snippet, which should be one or more `KanbanTableRow` elements containing task cells.
- Spreads `...restProps` onto the `<tbody>` for consumer customization.

## When to use it

- Inside a `KanbanTable` to mark the section that contains data rows for tasks/items.
- When grouping task rows separately from the column-headers (`KanbanTableHead`) and summary footer (`KanbanTableFoot`).

## When not to use it

- Do not use outside a `KanbanTable` — the `<tbody>` element is only valid inside a `<table>`.
- Do not use for the header row — use `KanbanTableHead`.
- Do not use for totals or summary rows — use `KanbanTableFoot`.

## How to use it

Place `KanbanTableBody` inside a `KanbanTable` and nest `KanbanTableRow` children containing `KanbanTableData` cells.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-body` class.
- `children` (Snippet, required) — `KanbanTableRow` elements with data cells.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<tbody>`.

## Usage

### Basic body with a single row

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "./KanbanTableBody.svelte";
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
            <KanbanTableData>Task A</KanbanTableData>
            <KanbanTableData>Task B</KanbanTableData>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

### Body with multiple rows

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "./KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTable label="Sprint">
    <KanbanTableHead>
        <KanbanTableRow>
            <th>To Do</th>
            <th>Doing</th>
            <th>Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableData>Story 1</KanbanTableData>
            <KanbanTableData>Story 2</KanbanTableData>
            <KanbanTableData>Story 3</KanbanTableData>
        </KanbanTableRow>
        <KanbanTableRow>
            <KanbanTableData>Story 4</KanbanTableData>
            <KanbanTableData />
            <KanbanTableData>Story 5</KanbanTableData>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

### Body populated from state

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "./KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";

    let rows = $state([
        ["Fix login", "Review PR", "Ship patch"],
        ["Write docs", "QA regression", "Announce"],
    ]);
</script>

<KanbanTable label="Board">
    <KanbanTableHead>
        <KanbanTableRow>
            <th>To Do</th>
            <th>Doing</th>
            <th>Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        {#each rows as row}
            <KanbanTableRow>
                {#each row as cell}
                    <KanbanTableData>{cell}</KanbanTableData>
                {/each}
            </KanbanTableRow>
        {/each}
    </KanbanTableBody>
</KanbanTable>
```

### Body with a consumer CSS class

```svelte
<script lang="ts">
    import KanbanTableBody from "./KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableBody class="striped">
    <KanbanTableRow>
        <KanbanTableData>A</KanbanTableData>
        <KanbanTableData>B</KanbanTableData>
    </KanbanTableRow>
</KanbanTableBody>
```

### Body with data-attribute variant

```svelte
<script lang="ts">
    import KanbanTableBody from "./KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableBody data-density="compact">
    <KanbanTableRow>
        <KanbanTableData>Compact row</KanbanTableData>
    </KanbanTableRow>
</KanbanTableBody>
```

## Accessibility

- `<tbody>` provides structural body semantics for the table.
- No additional ARIA needed — the parent `KanbanTable` provides `role="grid"` and the `aria-label`.
- No keyboard behaviour — keyboard navigation is handled at the grid level by the consumer.

## Related components

- `KanbanTable` — the root `<table>` with `role="grid"`.
- `KanbanTableHead` — the `<thead>` section for workflow-stage headers.
- `KanbanTableFoot` — the `<tfoot>` section for summary cells.
- `KanbanTableRow` — a `<tr>` row inside body/head/foot.
- `KanbanTableData` — a `<td role="gridcell">` data cell.
- `KanbanTableCol` — a `<col>` element inside `<colgroup>` for column sizing.
