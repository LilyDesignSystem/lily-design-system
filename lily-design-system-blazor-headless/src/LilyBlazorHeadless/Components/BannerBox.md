# BannerBox

A banner box that is inside a banner component, using flexbox horizontal.

See `components/banner-box/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `banner-box`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BannerBox>
    Content
</BannerBox>
```
