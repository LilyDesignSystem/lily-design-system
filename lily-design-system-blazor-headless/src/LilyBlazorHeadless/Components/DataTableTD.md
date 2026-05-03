# DataTableTD

A data table interactive grid data cell for displaying and sorting tabular data <td>.

See `components/data-table-td/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `data-table-td`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DataTableTD>
    Content
</DataTableTD>
```
