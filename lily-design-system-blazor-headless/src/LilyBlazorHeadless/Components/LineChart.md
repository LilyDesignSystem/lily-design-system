# LineChart

A line chart visualization connecting data points to display data.

See `components/line-chart/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `line-chart`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<LineChart Label="...">
    Content
</LineChart>
```
