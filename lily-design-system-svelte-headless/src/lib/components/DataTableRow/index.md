# DataTableRow

A single row within a `DataTable`. Renders a `<tr>` containing `DataTableData` cells or `<th>` header cells. Used inside `DataTableHead`, `DataTableBody`, or `DataTableFoot`.

## What it is

DataTableRow is a structural wrapper emitting `<tr class="data-table-row ...">`. `<tr>` has an implicit `role="row"`; no explicit role is added.

## What it does

- Renders `<tr>` with a base class.
- Renders children inside.
- Spreads `restProps` onto the `<tr>`.

## When to use it

- Any row inside a `DataTable`.

## When not to use it

- For static tables — use `TableRow`.

## How to use it

Place inside `DataTableHead`, `DataTableBody`, or `DataTableFoot`. Populate with `DataTableData` cells or `<th scope="col"|"row">`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `children` | `Snippet` | required | Cells for this row. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<tr>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "./DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="Users">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableData>Alice</DataTableData>
            <DataTableData>alice@example.com</DataTableData>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "./DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";

    const rows = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
    ];
</script>

<DataTable label="People">
    <DataTableHead>
        <DataTableRow><th scope="col">Name</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        {#each rows as r (r.id)}
            <DataTableRow aria-rowindex={r.id + 1}>
                <DataTableData>{r.name}</DataTableData>
            </DataTableRow>
        {/each}
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "./DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="With row header">
    <DataTableBody>
        <DataTableRow>
            <th scope="row">Total</th>
            <DataTableData>42</DataTableData>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

## Accessibility

- `<tr>` provides implicit `role="row"` in the ARIA grid pattern.
- Use `<th scope="col|row">` for header cells to announce row/column associations.

## Related components

- `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableCol`, `DataTableData`.
