# MockupTabletPortrait

A box area that looks like a tablet computer in portrait mode.

See `components/mockup-tablet-portrait/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mockup-tablet-portrait`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MockupTabletPortrait Label="...">
    Content
</MockupTabletPortrait>
```
