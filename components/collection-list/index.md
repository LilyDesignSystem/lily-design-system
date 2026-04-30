# Collection List

A collection list is a compact `<ul>` of related items — typically articles,
events, search results, or news entries — rendered as a vertical stack of
`collection-list-item` children.

Use it whenever a page presents many small content cards that share a
template (heading, optional meta, optional thumbnail) and should be
announced as a single list to assistive technology.

## Implementation Notes

- Renders a native `<ul>` element with class `collection-list`
- `label` prop is **optional** — when supplied it sets `aria-label` on the list
- Children are expected to be `collection-list-item` elements
- The `<ul>` semantics provide list count and item position to screen readers
- Pass-through attributes are forwarded to the root `<ul>`

## Composition

This component is part of the `*List` `*ListItem` composition pattern.
Pair it with `CollectionListItem` children to form a complete collection.

## Props

- `label`: string (optional) -- aria-label for the list
- `children`: slot -- `collection-list-item` children
- `...restProps`: any additional HTML attributes

## Usage

Basic collection of articles:

```html
<CollectionList label="Recent articles">
  <CollectionListItem heading="First post" meta="Jan 5" />
  <CollectionListItem heading="Second post" meta="Jan 12" />
</CollectionList>
```

## Keyboard Interactions

- Tab: focus moves to interactive descendants (links, buttons) within items
- The list itself is not interactive

## ARIA

- Implicit `list` role from `<ul>` element
- `aria-label` is provided when the `label` prop is set
- Each child contributes a list item via its `<li>` element

## When to Use

- Use to present a homogeneous series of related content cards.
- Use when items share the same template and should be announced as a single list.
- Use as the body of search results, news feeds, event calendars.

## When Not to Use

- Do not use for navigation menus — use a `Nav` + `List` + `ListItem` composition.
- Do not use for tabular data — use `DataTable`.
- Do not use for a single item — use the underlying card or article element directly.

## Headless

Renders only the `<ul>` semantics. The list spacing, item dividers, and any
visual rhythm are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `collection-list` class. Typical treatments
remove default list bullets, apply consistent vertical spacing, and add
optional dividers between items.

## Testing

- Verify the component renders a `<ul>` element with class `collection-list`
- Verify `aria-label` is present when `label` is supplied
- Verify `aria-label` is absent when `label` is omitted
- Verify children render inside the list
- Verify additional HTML attributes pass through to the root `<ul>`

## Advice

- **Designers**: Keep item templates consistent so the list reads predictably. Use a generous vertical rhythm to separate items.
- **Developers**: Always supply `CollectionListItem` children. Add `label` when the list's purpose is not clear from surrounding context.

## Related components

- `collection-list-item` — one item in a collection list with optional image, heading, meta, and description

## References

- US Web Design System Collection: https://designsystem.digital.gov/components/collection/
- HTML `<ul>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WCAG 1.3.1 Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships
