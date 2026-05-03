# StickyPromoBanner

A fixed-position promotional banner with a dismiss button.

See `components/sticky-promo-banner/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `sticky-promo-banner`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<StickyPromoBanner Label="...">
    Content
</StickyPromoBanner>
```
