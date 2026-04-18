# DataTable

An interactive data table that displays structured information in rows and columns as a grid widget. It renders a `<table role="grid" aria-label>` with an optional visible `<caption>`. Compose with `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableCol`, and `DataTableData`.

## What it is

DataTable is the outermost wrapper of the compound table system. It sets up grid semantics so `DataTableData` cells can use `role="gridcell"` with roving tabindex for keyboard grid navigation (which consumers implement at the table level).

## What it does

- Renders `<table role="grid" aria-label={label}>`.
- Optionally renders `<caption>{caption}</caption>` at the top.
- Renders children inside the `<table>`.
- Spreads `restProps` onto the `<table>`.

## When to use it

- Sortable tables, editable cells, interactive grids where cell navigation matters.
- Data dashboards, spreadsheet-like views.
- Any situation where the WAI-ARIA grid pattern applies.

## When not to use it

- For static tabular data without interaction — use `Table`.
- For calendars — use `CalendarTable`.
- For kanban, Gantt layouts — use `KanbanTable`, `GanttTable`.

## How to use it

Compose head/body/foot/row/cell components. Provide a descriptive `label` for the grid and an optional visible `caption`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | `aria-label` for the grid. |
| `caption` | `string` | `undefined` | Visible caption. |
| `children` | `Snippet` | required | Head/body/foot elements. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<table>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "./DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="User accounts">
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
        <DataTableRow>
            <DataTableData>Bob</DataTableData>
            <DataTableData>bob@example.com</DataTableData>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "./DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableFoot from "../DataTableFoot/DataTableFoot.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="Sales" caption="Quarterly sales">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Month</th>
            <th scope="col">Revenue</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableData>January</DataTableData>
            <DataTableData>$10,000</DataTableData>
        </DataTableRow>
        <DataTableRow>
            <DataTableData>February</DataTableData>
            <DataTableData>$12,000</DataTableData>
        </DataTableRow>
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow>
            <DataTableData>Total</DataTableData>
            <DataTableData>$22,000</DataTableData>
        </DataTableRow>
    </DataTableFoot>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "./DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableCol from "../DataTableCol/DataTableCol.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="Users">
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
    import DataTable from "./DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";

    let activeRow = $state(0);
    let activeCol = $state(0);
    const data = [
        ["A1", "A2"],
        ["B1", "B2"]
    ];
</script>

<DataTable label="Grid navigation demo">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Col 1</th>
            <th scope="col">Col 2</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        {#each data as row, r}
            <DataTableRow>
                {#each row as cell, c}
                    <DataTableData active={activeRow === r && activeCol === c}>
                        {cell}
                    </DataTableData>
                {/each}
            </DataTableRow>
        {/each}
    </DataTableBody>
</DataTable>
```

## Accessibility

- `role="grid"` communicates the interactive grid pattern.
- `aria-label` names the grid.
- Pair with `DataTableData` which provides `role="gridcell"` and roving tabindex via the `active` prop.
- Implement keyboard grid navigation (Arrow keys) at the table level as needed.

## Related components

- `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableCol`, `DataTableData` — compound parts.
- `Table` — static table.
- `CalendarTable`, `GanttTable`, `KanbanTable` — specialized tables.
