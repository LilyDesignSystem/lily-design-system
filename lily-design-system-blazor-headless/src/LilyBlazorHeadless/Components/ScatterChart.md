# ScatterChart

A scatter chart visualization using dots to display data.

See `components/scatter-chart/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `scatter-chart`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ScatterChart Label="...">
    Content
</ScatterChart>
```
