# FeaturePhoto

A responsive photo with lazy loading and alt text validation.

See `components/feature-photo/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `feature-photo`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FeaturePhoto>
    Content
</FeaturePhoto>
```
