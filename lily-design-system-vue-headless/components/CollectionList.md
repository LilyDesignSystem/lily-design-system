# CollectionList

A compact list of multiple related items such as articles or events. Renders `<ul class="collection-list">`.

## Implementation Notes

- Headless: no CSS, no styles
- `label` is optional; when provided, it sets `aria-label`
- Children should typically be `CollectionListItem` components

## Props

- `label`: string (optional) — aria-label for the list
- default slot — `CollectionListItem` children
- `...$attrs` — additional HTML attributes

## Usage

```vue
<CollectionList label="Recent articles">
    <CollectionListItem heading="Article one" />
    <CollectionListItem heading="Article two" />
</CollectionList>
```

## ARIA

- Native `<ul>` list semantics
- `aria-label` (optional) names the list

## When to Use

- Showing a series of similar items: articles, events, search results

## When Not to Use

- For a single item, use a card-style layout instead

## Headless

The component renders a `<ul>` and does not apply any visual treatment. The consumer styles spacing, dividers, and layout.

## Testing

- Verify root `collection-list` class
- Verify aria-label is applied when provided
- Verify slot children render

## References

- [USWDS Collection](https://designsystem.digital.gov/components/collection/)
