# MockupTabletLandscape

A box area that looks like a tablet computer in landscape mode.

See `components/mockup-tablet-landscape/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mockup-tablet-landscape`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MockupTabletLandscape Label="...">
    Content
</MockupTabletLandscape>
```
