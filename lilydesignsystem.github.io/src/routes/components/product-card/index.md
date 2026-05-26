# Product Card

A product card is a specialized `<article>` that displays a product's image,
name, and price together with optional description, badges, and action
buttons, presenting one product as a self-contained landmark for catalogs,
search results, and recommendation strips.

Use it for e-commerce listings, marketplace browse pages, recommendation
modules, and any context where products are presented in a uniform card
layout.

## Implementation Notes

- Renders an `<article>` with `class="product-card"` so each card is a discrete landmark
- `aria-label` defaults to the product name; consumers may override via `label`
- Optional `imageUrl` renders an `<img class="product-card-image" alt={imageAlt}>`
- The header contains `<h3 class="product-card-name">{name}</h3>` and `<p class="product-card-price">{price}</p>`
- Children render after the header for description, ratings, action buttons, etc.
- Price text is consumer-formatted — the component does not perform currency localization

## Props

- `name`: string (required) -- product name
- `price`: string (required) -- pre-formatted price text
- `imageUrl`: string (optional) -- product image src
- `imageAlt`: string (optional) -- product image alt text
- `label`: string (optional) -- aria-label override (defaults to `name`)
- `children`: slot -- additional content (description, actions)
- `...restProps`: any additional HTML attributes

## Usage

Basic product card:

```html
<ProductCard
  name="Premium notebook"
  price="$19.99"
  imageUrl="/img/notebook.jpg"
  imageAlt="Premium notebook with embossed cover"
/>
```

Product card with description and actions:

```html
<ProductCard
  name="Premium notebook"
  price="$19.99"
  imageUrl="/img/notebook.jpg"
  imageAlt="Premium notebook with embossed cover"
>
  <p>180 pages, dot-grid, hardcover.</p>
  <FlexStack direction="row">
    <Button>Add to cart</Button>
    <IconButton label="Save for later">♡</IconButton>
  </FlexStack>
</ProductCard>
```

## Keyboard Interactions

- None on the card itself.
- Focusable controls inside the card (e.g., add-to-cart button) follow their own keyboard behavior.

## ARIA

- `<article>` provides an implicit landmark
- `aria-label` defaults to `name` and may be overridden by `label`
- The image's `alt` text is the consumer's responsibility (pass via `imageAlt`)

## When to Use

- Use to present a single product in catalogs, search results, recommendation strips, and shopping cart summaries.
- Use when products are displayed in a uniform layout and each item has an image, name, and price.
- Use as a child of Grid or Masonry for product listings.

## When Not to Use

- Do not use for non-product content (use Card or Tile).
- Do not use as a navigation tile (use Tile or a labeled link).
- Do not omit `imageAlt` when an image is provided — alt text is required for non-decorative images.

## Headless

Provides only the semantic structure (article, headings, image, slot for
extras). Layout, sizing, badge styling, hover states, and any visual
treatment are the consumer's responsibility.

## Styles

Consumer CSS targets `.product-card`, `.product-card-image`, `.product-card-header`,
`.product-card-name`, and `.product-card-price` for visual styling.

## Testing

- Verify the component renders an `<article>` element with class `product-card`
- Verify `aria-label` defaults to `name` and is overridable by `label`
- Verify the image renders only when `imageUrl` is provided, with the supplied `alt`
- Verify the name renders inside `<h3 class="product-card-name">`
- Verify the price renders inside `<p class="product-card-price">`
- Verify children content is rendered after the header

## Domain Knowledge

- Pre-format `price` to include currency symbol, thousands separators, and decimal places appropriate to the user's locale.
- For sale or strike-through pricing, pass formatted text (e.g., `<del>$24.99</del> $19.99`) via the slot or include it in `price`.

## Advice

- **Designers**: Maintain a consistent aspect ratio for product images across cards. Keep the price visually prominent and the action button reachable on small screens.
- **Developers**: Always supply `imageAlt`. For decorative product photos that duplicate the name, an empty `alt=""` is acceptable, but if the image conveys information not in the name, write descriptive alt text.

## Related components

- `card` — a grouped content container with header, body, and footer areas
- `feature-card` — a large content card with a prominent image positioned alongside or above the text

## References

- MDN article element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
- WCAG 1.1.1 Non-text Content: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content
