# AreaChart

An area chart visualization showing sized components in continuous data.

See `components/area-chart/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `area-chart`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AreaChart Label="...">
    Content
</AreaChart>
```
