# ValidationListItem

one validation rule in a validation list with a status of pending,
passed, or failed

## Description

ValidationListItem is an `<li>` representing a single validation
rule. The `status` is conveyed via the `data-status` attribute so
the consumer can style the item per state. The parent
`ValidationList` provides the `aria-live` polite region that
announces status changes.

This component is inspired by the U.S. Web Design System (USWDS)
validation pattern.

## HTML tag

`<li>`

## CSS class

`validation-list-item`

## Params

- `text` — string. Plain text rule content (escaped).
- `html` — string. Raw HTML rule content rendered via `| safe`.
- `status` — `"pending" | "passed" | "failed"`. Default `"pending"`.
- `label` — string. Optional `aria-label` override.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/validation-list-item/macro.njk" import validationListItem %}

{{ validationListItem({
  text: "At least 8 characters",
  status: "pending"
}) }}
```

## Accessibility

- `data-status` allows the consumer to apply visual indicators
  (color, icons) for pending / passed / failed states.
- The accessible name comes from the rule text (or the `label`
  override).
- Consumers may render screen-reader-only "passed" / "failed"
  prefixes inside the item content for additional clarity.

## Headless

No CSS or JavaScript bundled. The consumer updates `status` as the
input value changes.

## Testing

`components/validation-list-item/macro.test.js` verifies the base
class, default and explicit `data-status` values, optional
`aria-label`, content rendering, and prop pass-through.

## References

- [USWDS: Validation](https://designsystem.digital.gov/components/validation/)

---

Lily™ and Lily Design System™ are trademarks.
