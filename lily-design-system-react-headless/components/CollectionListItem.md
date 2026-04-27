# CollectionListItem

One item in a [`CollectionList`](CollectionList.md) with a required heading and optional image, meta, description, and link. Inspired by the USWDS Collection component pattern.

## Implementation Notes

- Root element is `<li>` (provides native list-item semantics)
- `heading` is non-optional
- When `href` is provided the heading is wrapped in an `<a>`; otherwise it is plain text
- The `<img>` element renders only when `imageUrl` is provided
- Additional content can be appended via `children`

## Props

- `heading`: string (**required**) — item heading
- `meta`: string (optional) — meta line, e.g. date or category
- `description`: string (optional) — body text
- `imageUrl`: string (optional) — thumbnail image src
- `imageAlt`: string (optional) — alt text for the image (defaults to empty string for decorative images)
- `href`: string (optional) — when provided the heading is wrapped in `<a>`
- `label`: string (optional) — `aria-label` override
- `children`: ReactNode (optional) — additional content
- `className`: string (optional) — appended after the root `collection-list-item` class
- `...restProps`: any additional HTML attributes passed to the `<li>`

## Usage

```tsx
<CollectionList label="Articles">
  <CollectionListItem
    heading="Designing for trust"
    meta="April 27, 2026"
    description="How public services build trust online."
    imageUrl="/cover.jpg"
    imageAlt="Cover image"
    href="/articles/designing-for-trust"
  />
</CollectionList>
```

## ARIA

- Native `<li>` semantics
- Optional `aria-label` override

## References

- [USWDS Collection](https://designsystem.digital.gov/components/collection/)
