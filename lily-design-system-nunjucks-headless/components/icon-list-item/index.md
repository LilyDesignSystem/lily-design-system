# IconListItem

one item in an icon list with a leading icon slot

## Description

IconListItem is an `<li>` containing an optional leading icon span
and a text span. The icon is decorative (`aria-hidden="true"`); the
text is the accessible content.

This component is inspired by the U.S. Web Design System (USWDS)
icon list item pattern.

## HTML tag

`<li>`

## CSS class

`icon-list-item`

## Params

- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML for the text slot.
- `iconHtml` — string. Raw HTML for the leading icon (typically an
  SVG). When provided, an icon span is rendered with
  `aria-hidden="true"`.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/icon-list-item/macro.njk" import iconListItem %}

{{ iconListItem({
  text: "Fast",
  iconHtml: "<svg viewBox='0 0 24 24'>…</svg>"
}) }}
```

## Accessibility

- Leading icon is `aria-hidden="true"` so screen readers do not
  announce decorative imagery.
- The text span carries the accessible content.

## Headless

No CSS or JavaScript bundled. Sub-element classes
(`icon-list-item-icon`, `icon-list-item-text`) are styling hooks only.

## Testing

`components/icon-list-item/macro.test.js` verifies the base class,
optional icon span with `aria-hidden`, text rendering, and prop
pass-through.

## References

- [USWDS: Icon list](https://designsystem.digital.gov/components/icon-list/)

---

Lily™ and Lily Design System™ are trademarks.
