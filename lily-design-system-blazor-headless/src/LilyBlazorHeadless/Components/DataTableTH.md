# DataTableTH

A data table interactive grid header cell for displaying and sorting tabular data <th>.

See `components/data-table-th/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `data-table-th`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DataTableTH>
    Content
</DataTableTH>
```
