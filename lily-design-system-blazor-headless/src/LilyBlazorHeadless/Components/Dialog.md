# Dialog

A modal or non-modal dialog window.

See `components/dialog/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `dialog`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Dialog Label="...">
    Content
</Dialog>
```
