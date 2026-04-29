# KanbanTableRow

KanbanTableRow is a headless Svelte 5 component representing a single row within a `KanbanTable`. It renders a `<tr>` element and typically contains `KanbanTableData` cells (one per workflow column), or `<th>` header cells when used inside `KanbanTableHead`.

## What it is

A structural wrapper around the native `<tr>` element. `<tr>` has an implicit `role="row"`, so no explicit ARIA role is required. It has no state, no keyboard handling, and no styling.

## What it does

- Renders a `<tr>` with `class="kanban-table-row"` plus any consumer-provided CSS class.
- Renders the required `children` snippet, which should be `KanbanTableData` cells (or `<th>` in a head section).
- Spreads `...restProps` onto the `<tr>` for consumer customization.

## When to use it

- Inside `KanbanTableHead` to group column headers across each workflow stage.
- Inside `KanbanTableBody` to group task cells across each workflow stage.
- Inside `KanbanTableFoot` to group summary or action cells.

## When not to use it

- Do not use outside a `KanbanTable` — `<tr>` is only valid inside a table section.
- Do not use as a child of a `<tbody>` belonging to a different table component — use the matching `*TableRow` for that family.

## How to use it

Nest `KanbanTableRow` inside `KanbanTableHead`, `KanbanTableBody`, or `KanbanTableFoot`, and place one header or data cell per workflow column.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-row` class.
- `children` (Snippet, required) — `KanbanTableData` cells or `<th>` header cells for this row.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<tr>`.

## Usage

### Single data row across three stages

```svelte
<script lang="ts">
    import KanbanTableRow from "./KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableRow>
    <KanbanTableData>Task A</KanbanTableData>
    <KanbanTableData>Task B</KanbanTableData>
    <KanbanTableData>Task C</KanbanTableData>
</KanbanTableRow>
```

### Header row with `<th>` cells

```svelte
<script lang="ts">
    import KanbanTableRow from "./KanbanTableRow.svelte";
</script>

<KanbanTableRow>
    <th scope="col">To Do</th>
    <th scope="col">In Progress</th>
    <th scope="col">Done</th>
</KanbanTableRow>
```

### Row populated from state

```svelte
<script lang="ts">
    import KanbanTableRow from "./KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
    let cells = $state(["Fix login", "Write docs", "Ship 1.0"]);
</script>

<KanbanTableRow>
    {#each cells as cell}
        <KanbanTableData>{cell}</KanbanTableData>
    {/each}
</KanbanTableRow>
```

### Row with active (selected) cell for roving tabindex

```svelte
<script lang="ts">
    import KanbanTableRow from "./KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
    let selected = $state(1);
</script>

<KanbanTableRow>
    {#each ["A", "B", "C"] as item, i}
        <KanbanTableData active={selected === i}>{item}</KanbanTableData>
    {/each}
</KanbanTableRow>
```

### Row with a consumer CSS class and data attribute

```svelte
<script lang="ts">
    import KanbanTableRow from "./KanbanTableRow.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTableRow class="row-highlight" data-priority="high">
    <KanbanTableData>Bug: Login failure</KanbanTableData>
    <KanbanTableData />
    <KanbanTableData />
</KanbanTableRow>
```

## Accessibility

- `<tr>` has an implicit `role="row"` — no explicit role is needed.
- Keyboard navigation should be wired up at the `KanbanTable` grid level by the consumer; individual rows do not handle keys.

## Related components

- `KanbanTable` — the root `<table role="grid">`.
- `KanbanTableHead`, `KanbanTableBody`, `KanbanTableFoot` — section wrappers.
- `KanbanTableData` — a `<td role="gridcell">` task cell.
- `KanbanTableCol` — `<col>` column definitions inside `<colgroup>`.
- `DataTableRow`, `CalendarTableRow`, `GanttTableTr` — equivalent rows for other table types.
