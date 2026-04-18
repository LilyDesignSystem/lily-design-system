# KanbanTableCol

KanbanTableCol is a headless Svelte 5 component representing a column definition within a `KanbanTable`. It renders a `<col>` element — not a `<th>` — to be used inside a `<colgroup>` for sizing or styling each workflow-stage column. It does not render visible content of its own.

## What it is

A structural wrapper around the native HTML `<col>` element. Despite the suffix `Col`, this component renders `<col>` (a column definition) rather than `<th>` (a column header). Use `<th>` inside `KanbanTableHead` + `KanbanTableRow` when you need visible column headers, and use `KanbanTableCol` inside `<colgroup>` to control column sizing.

## What it does

- Renders a `<col>` element with `class="kanban-table-col"` plus any consumer-provided CSS class.
- Forwards the optional `span` attribute (or `undefined` when zero/falsy).
- Spreads `...restProps` onto the `<col>` element.

## When to use it

- Inside a `<colgroup>` within a `KanbanTable` to declare column widths, spans, or consumer CSS hooks.
- Targeting specific columns with shared styles without touching every cell.

## When not to use it

- Do not use for visible column headers — use plain `<th scope="col">` inside a `KanbanTableRow` within `KanbanTableHead`.
- Do not use outside a `<colgroup>` element.
- Do not try to render text content inside it — `<col>` is a void element.

## How to use it

Place `KanbanTableCol` elements inside a `<colgroup>` inside the `KanbanTable`, one per workflow column.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-col` class.
- `span` (number, optional) — number of columns this `<col>` spans.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<col>`.

## Usage

### Column sizing for a three-stage board

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableCol from "./KanbanTableCol.svelte";
    import KanbanTableData from "../KanbanTableData/KanbanTableData.svelte";
</script>

<KanbanTable label="Board">
    <colgroup>
        <KanbanTableCol span={1} />
        <KanbanTableCol span={1} />
        <KanbanTableCol span={1} />
    </colgroup>
    <KanbanTableHead>
        <KanbanTableRow>
            <th>To Do</th>
            <th>Doing</th>
            <th>Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableData>A</KanbanTableData>
            <KanbanTableData>B</KanbanTableData>
            <KanbanTableData>C</KanbanTableData>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

### Spanning columns

```svelte
<script lang="ts">
    import KanbanTableCol from "./KanbanTableCol.svelte";
</script>

<table>
    <colgroup>
        <KanbanTableCol span={2} class="col-active" />
        <KanbanTableCol />
    </colgroup>
    <!-- rows... -->
</table>
```

### Per-column CSS classes

```svelte
<script lang="ts">
    import KanbanTableCol from "./KanbanTableCol.svelte";
</script>

<colgroup>
    <KanbanTableCol class="col-todo" />
    <KanbanTableCol class="col-doing" />
    <KanbanTableCol class="col-done" />
</colgroup>

<style>
    :global(col.col-todo) { background: #f9fafb; }
    :global(col.col-doing) { background: #eff6ff; }
    :global(col.col-done) { background: #ecfdf5; }
</style>
```

### Data-attribute for column theming

```svelte
<script lang="ts">
    import KanbanTableCol from "./KanbanTableCol.svelte";
</script>

<colgroup>
    <KanbanTableCol data-stage="todo" />
    <KanbanTableCol data-stage="doing" />
    <KanbanTableCol data-stage="done" />
</colgroup>
```

### No span attribute

```svelte
<script lang="ts">
    import KanbanTableCol from "./KanbanTableCol.svelte";
</script>

<colgroup>
    <KanbanTableCol />
    <KanbanTableCol />
    <KanbanTableCol />
</colgroup>
```

## Accessibility

- `<col>` provides structural column information for a table.
- Not interactive — no keyboard behaviour.
- Does not announce itself to screen readers; visible column headers should live inside `KanbanTableHead` using `<th scope="col">`.

## Related components

- `KanbanTable` — the root `<table>` with `role="grid"`.
- `KanbanTableHead` — the `<thead>` section containing column-header rows.
- `KanbanTableBody` — the `<tbody>` section containing task rows.
- `KanbanTableFoot` — the `<tfoot>` section for totals.
- `KanbanTableRow` — a `<tr>` row.
- `KanbanTableData` — a `<td role="gridcell">` task cell.
