# DataTableFoot

The footer section of a `DataTable`. Renders a `<tfoot>` containing summary or aggregate rows.

## What it is

DataTableFoot is a structural wrapper emitting `<tfoot class="data-table-foot ...">`. It has no state and no ARIA of its own.

## What it does

- Renders `<tfoot>`.
- Renders children inside.
- Spreads `restProps` onto the `<tfoot>`.

## When to use it

- Showing totals, aggregates, or summary rows at the bottom of a `DataTable`.

## When not to use it

- For header rows — use `DataTableHead`.
- For regular data rows — use `DataTableBody`.

## How to use it

Place inside `DataTable`, after `DataTableBody`. Populate with `DataTableRow` children.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `children` | `Snippet` | required | Footer rows. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<tfoot>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableFoot from "./DataTableFoot.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="Budget">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Item</th>
            <th scope="col">Amount</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableData>Travel</DataTableData>
            <DataTableData>$1,200</DataTableData>
        </DataTableRow>
        <DataTableRow>
            <DataTableData>Lodging</DataTableData>
            <DataTableData>$800</DataTableData>
        </DataTableRow>
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow>
            <DataTableData>Total</DataTableData>
            <DataTableData>$2,000</DataTableData>
        </DataTableRow>
    </DataTableFoot>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableFoot from "./DataTableFoot.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";

    const lines = [
        { label: "A", amount: 10 },
        { label: "B", amount: 20 },
        { label: "C", amount: 30 }
    ];
    const total = lines.reduce((s, l) => s + l.amount, 0);
</script>

<DataTable label="Totals">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Label</th>
            <th scope="col">Amount</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        {#each lines as l}
            <DataTableRow>
                <DataTableData>{l.label}</DataTableData>
                <DataTableData>{l.amount}</DataTableData>
            </DataTableRow>
        {/each}
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow>
            <DataTableData>Sum</DataTableData>
            <DataTableData>{total}</DataTableData>
        </DataTableRow>
    </DataTableFoot>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableFoot from "./DataTableFoot.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableData from "../DataTableData/DataTableData.svelte";
</script>

<DataTable label="With empty foot">
    <DataTableHead>
        <DataTableRow><th scope="col">X</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow><DataTableData>1</DataTableData></DataTableRow>
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow><DataTableData>—</DataTableData></DataTableRow>
    </DataTableFoot>
</DataTable>
```

## Accessibility

- `<tfoot>` adds structural footer semantics.

## Related components

- `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableRow`, `DataTableData`.
