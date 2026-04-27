# CollectionList

A compact list of multiple related items such as articles, events, or resources. Inspired by the USWDS Collection component. Renders a `<ul>` so the items are exposed with native list semantics.

## Implementation Notes

- Root element is `<ul>` (provides native list semantics)
- `label` is optional; when provided it is rendered as `aria-label`
- Each child should typically be a [`CollectionListItem`](CollectionListItem.md)

## Props

- `label`: string (optional) — `aria-label` for the list
- `children`: ReactNode (required) — `CollectionListItem` children
- `className`: string (optional) — appended after the root `collection-list` class
- `...restProps`: any additional HTML attributes passed to the `<ul>`

## Usage

```tsx
<CollectionList label="Recent articles">
  <CollectionListItem heading="Designing for trust" />
  <CollectionListItem heading="Plain language wins" />
</CollectionList>
```

## ARIA

- The native `<ul>` provides list semantics
- `aria-label` provides an optional accessible name

## References

- [USWDS Collection](https://designsystem.digital.gov/components/collection/)
