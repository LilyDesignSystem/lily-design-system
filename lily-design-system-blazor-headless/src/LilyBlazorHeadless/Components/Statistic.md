# Statistic

A numeric value display with title, prefix, and suffix.

See `components/statistic/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `statistic`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Statistic>
    Content
</Statistic>
```
