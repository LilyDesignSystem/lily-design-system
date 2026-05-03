# IconButton

A button containing only an icon with a required accessible label.

See `components/icon-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `icon-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<IconButton Label="...">
    Content
</IconButton>
```
