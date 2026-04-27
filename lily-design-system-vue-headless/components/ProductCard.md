# ProductCard

A specialized card for displaying a product with an optional image, a required name, a required pre-formatted price, and arbitrary child content for descriptions and actions. Renders a semantic `<article>` root.

## Implementation Notes

- Headless: no CSS or styles
- `<article>` creates an implicit landmark with `aria-label` defaulting to the product name
- `<h3>` carries the name in the document outline
- The `<img>` is rendered only when `imageUrl` is provided

## Props

- `name`: string (**required**)
- `price`: string (**required**) — pre-formatted price text
- `imageUrl`: string (optional)
- `imageAlt`: string (optional)
- `label`: string (optional) — `aria-label` override
- default slot — additional content (description, actions)
- `...$attrs` — additional HTML attributes

## Usage

```vue
<ProductCard
    name="Wonder Widget"
    price="$19.99"
    image-url="/widget.jpg"
    image-alt="Wonder Widget product photo"
>
    <p>A widget that wonders.</p>
    <button>Add to cart</button>
</ProductCard>
```

## Keyboard Interactions

- None at the container level; interactive children manage their own behavior.

## ARIA

- `<article>` landmark with `aria-label` (defaults to name)
- `<h3>` for the product name in the document outline

## When to Use

- Product grids, e-commerce galleries, marketplace listings

## When Not to Use

- Generic content cards — use `Card`
- Person/organization summaries — use `Person` or `Organization`

## Headless

No styling is applied. Class names are exposed (`product-card`, `product-card-image`, `product-card-header`, `product-card-name`, `product-card-price`) for consumer CSS hooks. Currency formatting is delegated to the consumer.

## Testing

- Verify root `<article>` with `product-card` class
- Verify the `name` is rendered in an `<h3>` and the `price` is rendered
- Verify `aria-label` defaults to the name and accepts overrides
- Verify the image is conditionally rendered

## References

- [MDN: `<article>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article)
