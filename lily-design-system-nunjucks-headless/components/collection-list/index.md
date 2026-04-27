# CollectionList

a compact list of multiple related items such as articles or events

## Description

CollectionList is a `<ul>` that contains zero or more
`CollectionListItem` children. It is designed for compact lists of
similar items: news articles, events, search results, related
resources.

This component is inspired by the U.S. Web Design System (USWDS)
collection pattern.

## HTML tag

`<ul>`

## CSS class

`collection-list`

## Params

- `label` — string. Optional `aria-label` for the list.
- `labelledBy` — string. Optional `aria-labelledby` target.
- `text` — string. Optional escaped fallback text.
- `html` — string. Raw HTML content rendered via `| safe`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/collection-list/macro.njk" import collectionList %}
{% from "components/collection-list-item/macro.njk" import collectionListItem %}

{% call collectionList({ label: "Latest articles" }) %}
  {{ collectionListItem({
    heading: "Article one",
    meta: "Apr 27, 2026",
    description: "Lead paragraph for article one"
  }) }}
{% endcall %}
```

## Accessibility

- The `<ul>` provides list semantics (item count is announced).
- `aria-label` or `aria-labelledby` names the list when needed.

## Headless

No CSS or JavaScript bundled. The consumer styles spacing and
visual treatment between items.

## Testing

`components/collection-list/macro.test.js` verifies the base class,
optional `aria-label`, child rendering, classes pass-through, and
attributes pass-through.

## References

- [USWDS: Collection](https://designsystem.digital.gov/components/collection/)
