# Collection List Item

A collection list item is one entry in a `collection-list`, presenting a
required heading plus optional thumbnail image, meta line (date, category),
and short description.

Use it inside `CollectionList` to render homogeneous summary cards for
articles, events, search results, or news entries.

## Implementation Notes

- Renders a native `<li>` element with class `collection-list-item`
- `heading` prop is **required** — it is rendered as an `<h3>` heading inside the item
- When `href` is provided, the heading text is wrapped in an `<a>` element
- Optional `imageUrl` + `imageAlt` render a leading `<img>` thumbnail
- Optional `meta` renders a meta paragraph (e.g., date or category)
- Optional `description` renders a body paragraph
- Optional `children` render after the description for custom extra content
- Optional `label` sets `aria-label` to override the default accessible name

## Composition

This component is part of the `*List` `*ListItem` composition pattern.
It must be a child of `CollectionList`.

## Props

- `heading`: string (**required**) -- item heading text
- `meta`: string (optional) -- meta line such as a date or category
- `description`: string (optional) -- body description text
- `imageUrl`: string (optional) -- thumbnail image src
- `imageAlt`: string (optional) -- thumbnail image alt text
- `href`: string (optional) -- when provided, the heading is wrapped in an `<a>`
- `label`: string (optional) -- aria-label override
- `children`: slot -- additional content rendered after the description
- `...restProps`: any additional HTML attributes

## Usage

Article entry with link, meta, and description:

```html
<CollectionListItem
  heading="Plain language is for everyone"
  href="/blog/plain-language"
  meta="Published Jan 5, 2025"
  description="A short overview of why plain language matters in public services."
/>
```

Event entry with thumbnail:

```html
<CollectionListItem
  heading="Annual conference"
  imageUrl="/img/conf.jpg"
  imageAlt="Speaker on stage"
  meta="May 12, 2025"
/>
```

## Keyboard Interactions

- Tab: moves focus to the heading link (when `href` is provided) or to descendants
- All key handling is delegated to the contained interactive elements

## ARIA

- Implicit `listitem` role from `<li>` element
- `aria-label` is rendered when `label` is supplied
- Image `alt` attribute provides the image's accessible text

## When to Use

- Use as a child of `CollectionList` to render an entry in a homogeneous list.
- Use when each entry has a heading and optional supporting information.
- Use when the heading should optionally link to a detail page.

## When Not to Use

- Do not use outside a `CollectionList`.
- Do not use for tabular data — use `DataTableRow` instead.
- Do not use for navigation list items — use the appropriate `*ListItem` for the navigation.

## Headless

Renders the structural skeleton — `<li>` with optional `<img>`, `<h3>`,
`<p class="...-meta">`, `<p class="...-description">`, and slot. Visual
spacing, image dimensions, and typography are entirely the consumer's
responsibility.

## Styles

Consumer CSS targets the `collection-list-item` class plus the inner
`collection-list-item-image`, `collection-list-item-heading`,
`collection-list-item-meta`, and `collection-list-item-description`
classes for fine-grained control.

## Testing

- Verify the component renders an `<li>` element with class `collection-list-item`
- Verify the heading text appears inside an `<h3>` element
- Verify the heading is wrapped in an `<a>` when `href` is provided
- Verify the heading is plain text when `href` is omitted
- Verify the image renders only when `imageUrl` is provided
- Verify the meta paragraph renders only when `meta` is provided
- Verify the description paragraph renders only when `description` is provided
- Verify children render after the description when supplied
- Verify additional HTML attributes pass through to the root `<li>`

## Advice

- **Designers**: Keep heading length predictable so the list reads as a tidy stack. Use thumbnails sparingly and at consistent dimensions.
- **Developers**: Always supply `imageAlt` when `imageUrl` is set. Use `href` to make the heading the link target so the entire heading text is announced as the link.

## Related components

- `collection-list` — a compact list of multiple related items such as articles or events

## References

- US Web Design System Collection: https://designsystem.digital.gov/components/collection/
- HTML `<li>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
- WCAG 1.1.1 Non-text Content: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content

---

Lily™ and Lily Design System™ are trademarks.
