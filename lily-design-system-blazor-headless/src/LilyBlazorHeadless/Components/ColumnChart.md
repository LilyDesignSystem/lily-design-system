# ColumnChart

A vertical column chart visualization for displaying data.

See `components/column-chart/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `column-chart`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ColumnChart Label="...">
    Content
</ColumnChart>
```
