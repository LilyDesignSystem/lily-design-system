# ProductCard

A specialized card for displaying a product with image, title, price, and actions.

See `components/product-card/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `product-card`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<ProductCard>
    Content
</ProductCard>
```
