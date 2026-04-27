# IconList

an ordered list of icon list item components

## Description

IconList is a `<ul>` that contains zero or more `IconListItem`
children. Each child has a leading icon slot and a text slot.

This component is inspired by the U.S. Web Design System (USWDS)
icon list pattern.

## HTML tag

`<ul>`

## CSS class

`icon-list`

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
{% from "components/icon-list/macro.njk" import iconList %}
{% from "components/icon-list-item/macro.njk" import iconListItem %}

{% call iconList({ label: "Benefits" }) %}
  {{ iconListItem({
    text: "Fast",
    iconHtml: "<svg viewBox='0 0 24 24'>…</svg>"
  }) }}
{% endcall %}
```

## Accessibility

- The `<ul>` provides list semantics.
- `aria-label` or `aria-labelledby` names the list when needed.
- Icon content inside each item is decorative (`aria-hidden="true"`)
  so the item text is the accessible content.

## Headless

No CSS or JavaScript bundled. The consumer styles spacing and the
icon column.

## Testing

`components/icon-list/macro.test.js` verifies the base class,
optional `aria-label` / `aria-labelledby`, child rendering, and
prop pass-through.

## References

- [USWDS: Icon list](https://designsystem.digital.gov/components/icon-list/)
