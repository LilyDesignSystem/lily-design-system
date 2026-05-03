# Watermark

A decorative repeating overlay text or image marking a page.

See `components/watermark/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `watermark`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Watermark>
    Content
</Watermark>
```
