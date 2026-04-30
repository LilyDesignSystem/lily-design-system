# ProductCard

## Metadata

- Component: product-card
- PascalCase: ProductCard
- Description: a specialized card for displaying a product with image, title, price, and actions
- HTML tag: <article>
- CSS class: .product-card
- Interactive: no (focusable children manage their own behavior)

## Key Behaviors

- Renders `<article aria-label={label || name}>`
- Optional `<img class="product-card-image">` when imageUrl provided
- Header contains `<h3 class="product-card-name">` and `<p class="product-card-price">`
- Children render after header for description, badges, actions
- Price is consumer-formatted (no currency localization)

## ARIA

- `<article>` implicit landmark
- `aria-label` defaults to name, overridable by label prop
- Image `alt` supplied via imageAlt prop

## Keyboard

- None on card
- Focusable children manage their own keyboard behavior

## Props

- `name`: string (required)
- `price`: string (required) -- pre-formatted
- `imageUrl`: string (optional)
- `imageAlt`: string (optional)
- `label`: string (optional) -- aria-label override
- `children`: slot -- additional content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="product-card"
- [ ] aria-label defaults to name; overridable via label prop
- [ ] Image renders only when imageUrl provided, with imageAlt as alt
- [ ] Name renders inside <h3 class="product-card-name">
- [ ] Price renders inside <p class="product-card-price">
- [ ] Children render after header
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .product-card in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/product-card.html
- MDN article: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
