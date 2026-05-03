# DataTable

A data table interactive grid for displaying and sorting tabular data <table>.

See `components/data-table/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `data-table`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DataTable>
    Content
</DataTable>
```
