# ScreenReaderSpan

A visually hidden span of text intended for screen readers to provide more descriptive labels.

See `components/screen-reader-span/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `screen-reader-span`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ScreenReaderSpan>
    Content
</ScreenReaderSpan>
```
