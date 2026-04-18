# DataTableCol

A column definition within a `DataTable`. Renders a `<col>` element, typically inside a `<colgroup>`, with an optional `span` attribute for grouping columns.

Note: the AGENTS description states this maps to `<th>` as "a data table interactive grid column". The actual source emits `<col>` (the HTML column-definition element), which is the correct HTML for styling entire columns. Use `<th scope="col">` inside a `DataTableHead` row for the actual column header cells.

## What it is

DataTableCol outputs `<col class="data-table-col ..." span={span || undefined}>`. It lives inside a `<colgroup>` and affects columns without representing header content.

## What it does

- Renders `<col>`.
- Applies `span` when set; omits when falsy.
- Spreads `restProps` onto the `<col>`.

## When to use it

- Assigning styles to entire columns via `<colgroup>`/`<col>`.
- Grouping columns where `span` represents how many data columns a single `<col>` represents.

## When not to use it

- For column header cells — use `<th scope="col">` inside a `DataTableHead` row.
- For per-cell styling — use classes on `DataTableData`.

## How to use it

Place inside `<colgroup>` inside `DataTable`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `span` | `number` | `undefined` | Number of columns this `<col>` spans. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<col>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableCol from "./DataTableCol.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="With colgroup">
    <colgroup>
        <DataTableCol />
        <DataTableCol span={2} />
    </colgroup>
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableData>Alice</DataTableData>
            <DataTableData>alice@example.com</DataTableData>
            <DataTableData>Admin</DataTableData>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableCol from "./DataTableCol.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="Single column col">
    <colgroup>
        <DataTableCol class="first-col" />
    </colgroup>
    <DataTableHead>
        <DataTableRow><th scope="col">Name</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow><DataTableData>Alice</DataTableData></DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableCol from "./DataTableCol.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";

    const cols = [1, 2, 3];
</script>

<DataTable label="Generated colgroup">
    <colgroup>
        {#each cols as c (c)}
            <DataTableCol />
        {/each}
    </colgroup>
    <DataTableHead>
        <DataTableRow>
            {#each cols as c}<th scope="col">Col {c}</th>{/each}
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            {#each cols as c}<DataTableData>{c}</DataTableData>{/each}
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

## Accessibility

- `<col>` has no ARIA impact; it provides only styling/layout hooks.
- Header semantics live on `<th scope="col">` cells inside `DataTableHead`.

## Related components

- `DataTable`, `DataTableHead`, `DataTableBody` — enclosing components.
- `DataTableRow`, `DataTableData` — row and cell.
