# DataTable

Pattern:

```tsx
<DataTable>
    <DataTableHead>
        <DataTableRow>
            <DataTableTH>…</DataTableTH>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableTD>…</DataTableTD>
        </DataTableRow>
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow>
            <DataTableTH>…</DataTableTH>
        </DataTableRow>
    </DataTableFoot>
</DataTable>
```

Suffix slugs (kebab):

- data-table-head ↔ `<thead>`
- data-table-body ↔ `<tbody>`
- data-table-foot ↔ `<tfoot>`
- data-table-row ↔ `<tr>`
- data-table-th ↔ `<th>`
- data-table-td ↔ `<td>`
