# CollectionListItem

one item in a collection list with optional image, heading, meta, and description

## Description

CollectionListItem is an `<li>` that renders an item inside a
`CollectionList`. It supports an optional thumbnail image, a heading
(optionally linked), a meta line, and a description paragraph.

This component is inspired by the U.S. Web Design System (USWDS)
collection item pattern.

## HTML tag

`<li>`

## CSS class

`collection-list-item`

## Params

- `heading` — string. **Required.** Heading text.
- `meta` — string. Optional meta line (e.g. date or category).
- `description` — string. Optional body paragraph.
- `imageUrl` — string. Optional thumbnail image src.
- `imageAlt` — string. Optional thumbnail alt text.
- `href` — string. When provided, the heading is wrapped in an `<a>`.
- `label` — string. Optional `aria-label` override.
- `text` — string. Optional fallback text when no heading.
- `html` — string. Raw HTML appended after the default content.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/collection-list-item/macro.njk" import collectionListItem %}

{{ collectionListItem({
  heading: "Article one",
  href: "/articles/one",
  meta: "Apr 27, 2026",
  description: "Lead paragraph for article one"
}) }}
```

## Accessibility

- Heading uses `<h3>` so screen reader users can navigate by heading.
- When `href` is omitted, the heading is plain text — the consumer
  may still wrap surrounding content in an `<a>` if desired.
- The `<img>` requires an `imageAlt` value (defaults to empty string
  for decorative images).

## Headless

No CSS or JavaScript bundled. Sub-element classes
(`collection-list-item-image`, `collection-list-item-heading`,
`collection-list-item-meta`, `collection-list-item-description`) are
provided as styling hooks only.

## Testing

`components/collection-list-item/macro.test.js` verifies the base
class, conditional `<a>` wrapping, image, meta, and description
rendering, and prop pass-through.

## References

- [USWDS: Collection](https://designsystem.digital.gov/components/collection/)
