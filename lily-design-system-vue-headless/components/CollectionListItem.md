# CollectionListItem

One item in a `CollectionList` with optional image, heading, meta, and description. When `href` is provided, the heading text is wrapped in an `<a>`.

## Implementation Notes

- Headless: no CSS, no styles
- `heading` is **required** and non-optional in the TypeScript interface
- `<a>` is rendered only when `href` is supplied
- Image is rendered only when `imageUrl` is supplied; alt defaults to `""`

## Props

- `heading`: string (**required**) — item heading
- `meta`: string (optional) — meta line such as date or category
- `description`: string (optional) — body description
- `imageUrl`: string (optional) — image src
- `imageAlt`: string (optional) — image alt text
- `href`: string (optional) — link URL
- `label`: string (optional) — aria-label override
- default slot — additional content
- `...$attrs` — additional HTML attributes

## Usage

```vue
<CollectionListItem
    heading="Hello"
    href="/hello"
    meta="Jan 1, 2026"
    description="A short summary"
/>
```

## ARIA

- `aria-label` (optional) override
- Decorative images still require alt; consumers must supply meaningful alt text

## When to Use

- Inside a `CollectionList` to render a single article, event, or item

## Headless

The component does not apply any visual treatment. The consumer styles layout, image sizing, and typography.

## Testing

- Verify root `collection-list-item` class
- Verify heading renders, with anchor when href is provided
- Verify meta, description, and image render when supplied
- Verify slot children render

## References

- [USWDS Collection](https://designsystem.digital.gov/components/collection/)
