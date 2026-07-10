# ProductCard

a specialized card for displaying a product with image, title, price,
and actions

## Description

ProductCard wraps product information in an `<article>` landmark with
`aria-label` set to the product name (or a consumer override). It
renders an optional product image, a header containing the product
name (`<h3>`) and price (`<p>`), and a slot for additional content
(description, ratings, action buttons, etc.).

The price is supplied pre-formatted — the component does not
localize currency. Use `Intl.NumberFormat` (or your own formatter) on
the consumer side.

## HTML tag

`<article>`

## CSS class

`product-card` (with `product-card-image`, `product-card-header`,
`product-card-name`, `product-card-price` on inner elements)

## Params

- `name` — string. **Required.** Product name.
- `price` — string. **Required.** Pre-formatted price text.
- `imageUrl` — string. Optional product image src.
- `imageAlt` — string. Optional product image alt text.
- `label` — string. `aria-label` override (defaults to `name`).
- `text` — string. Optional plain text body.
- `html` — string. Optional raw HTML body.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/product-card/macro.njk" import productCard %}

{% call productCard({
  name: "Wireless Headphones",
  price: "$199.00",
  imageUrl: "/images/headphones.jpg",
  imageAlt: "Black over-ear headphones"
}) %}
  <p>Active noise cancellation, 30-hour battery.</p>
  <button type="button">Add to cart</button>
{% endcall %}
```

## Accessibility

- `<article>` is a self-contained landmark.
- `aria-label` on the article gives assistive technology a single
  accessible name for the product.
- The image's `alt` text is consumer-supplied. Pass an empty string
  for purely decorative product photos.

## When to use

- E-commerce product grids, search result cards, related-product
  lists.

## When not to use

- For generic non-commerce content cards, use `Card`.

## Headless

No CSS shipped. Consumers style the article, image, header, name,
and price using the listed class names.

## Testing

`components/product-card/macro.test.js` verifies the base class,
default and custom `aria-label`, name and price rendering, image
rendering and alt fallback, and caller composition.

---

Lily™ and Lily Design System™ are trademarks.
