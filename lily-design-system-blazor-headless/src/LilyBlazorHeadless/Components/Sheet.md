# Sheet

A panel that slides in from a screen edge as an overlay.

See `components/sheet/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `sheet`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Sheet Label="...">
    Content
</Sheet>
```
