# BarChart

A horizontal bar chart visualization for displaying data.

See `components/bar-chart/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `bar-chart`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BarChart Label="...">
    Content
</BarChart>
```
