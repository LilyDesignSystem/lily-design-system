# Sparkline

A small inline chart showing a data trend.

See `components/sparkline/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `sparkline`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Sparkline Label="...">
    Content
</Sparkline>
```
