# Tooltip

A small popup showing descriptive text on hover or focus.

See `components/tooltip/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tooltip`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Tooltip Label="...">
    Content
</Tooltip>
```
