# DataTableRow

A data table interactive grid row for displaying and sorting tabular data <tr>.

See `components/data-table-row/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `data-table-row`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DataTableRow>
    Content
</DataTableRow>
```
