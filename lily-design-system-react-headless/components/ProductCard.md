# ProductCard

A specialized card for displaying a product with image, name, pre-formatted price, and optional additional content (description, actions). Renders a semantic `<article>` with an optional image, a `<header>` containing the name (`<h3>`) and price (`<p>`), then any consumer-supplied children.

The price string must be pre-formatted by the consumer so locale-specific currency rules remain in the consumer's control.

## Implementation Notes

- Renders `<article aria-label={label || name}>`
- Hook classes: `product-card-image`, `product-card-header`, `product-card-name`, `product-card-price`
- Image is rendered only when `imageUrl` is provided; `imageAlt` falls back to empty string

## Props

- `name`: string (**required**) -- product name
- `price`: string (**required**) -- pre-formatted price text
- `imageUrl`: string (optional) -- image src
- `imageAlt`: string (optional) -- image alt text
- `label`: string (optional) -- `aria-label` override (defaults to `name`)
- `children`: ReactNode (optional) -- description, actions, etc.
- `...restProps`: Any additional HTML attributes passed to the `<article>`

## Usage

```tsx
<ProductCard
  name="Reading Lamp"
  price="$49.00"
  imageUrl="/lamp.jpg"
  imageAlt="Brass reading lamp on a desk"
>
  <p>Adjustable brass reading lamp.</p>
  <button>Add to cart</button>
</ProductCard>
```

## Keyboard Interactions

- None at the card level; child controls handle their own keyboard input

## ARIA

- Semantic `<article>` landmark
- `aria-label` set from `label` or `name`
