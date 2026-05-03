# DataTableFoot

A data table interactive grid tfoot for displaying and sorting tabular data <tfoot>.

See `components/data-table-foot/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `data-table-foot`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DataTableFoot>
    Content
</DataTableFoot>
```
