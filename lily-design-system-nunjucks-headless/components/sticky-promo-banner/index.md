# StickyPromoBanner

a fixed-position promotional banner with a dismiss button

## Description

StickyPromoBanner pins promotional content to the top or bottom of
the viewport. The component is the only Lily™ headless macro that
emits inline `style` (`position: fixed; left: 0; right: 0;` plus
`top: 0` or `bottom: 0`) — without it, consumers cannot pin the
banner without their own CSS framework. All other visual styling is
left to consumers.

The dismiss button is rendered only when `dismissLabel` is provided.
When `open` is `false` the banner is rendered with the `hidden`
attribute so it stays in the DOM (preserving event handlers) but is
not displayed.

## HTML tag

`<aside>`

## CSS class

`sticky-promo-banner`

## Params

- `label` — string. **Required.** `aria-label` for the aside region.
- `open` — boolean. Default `true`. When `false` the banner is
  rendered with the `hidden` attribute.
- `position` — `"top"` | `"bottom"`. Default `"bottom"`. Sticky edge
  of the viewport, exposed as `data-position`.
- `dismissLabel` — string. **Required to render the dismiss button.**
  The button is omitted when this param is falsy.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `id` — string.
- `classes` — string.
- `attributes` — object.

## Usage

```njk
{% from "components/sticky-promo-banner/macro.njk" import stickyPromoBanner %}

{% call stickyPromoBanner({
  label: "Spring sale promotion",
  position: "bottom",
  dismissLabel: "Dismiss promotion"
}) %}
  <p>50% off everything this weekend.</p>
  <a href="/sale">Shop now</a>
{% endcall %}
```

Banner pinned to top, no dismiss button:

```njk
{{ stickyPromoBanner({
  label: "Site notice",
  position: "top",
  text: "Maintenance window: Sunday 02:00–04:00 UTC."
}) }}
```

## Accessibility

- `<aside role="complementary">` with `aria-label` exposes a named
  landmark, letting screen reader users skip past the promo.
- The dismiss button has its own `aria-label` so its purpose is
  clear without context.
- Use `hidden` (via `open: false`) rather than removing from the DOM
  so consumer-attached focus/dismiss handlers remain bound.

## Inline style

Inline `style` is intentionally emitted on the root element:

- `position: fixed;`
- `left: 0; right: 0;`
- `top: 0` or `bottom: 0` based on `position`.

This keeps the banner pinned without requiring consumers to write
matching CSS. All other visual styling is provided by consumers.

## When to use

- Site-wide announcements, cookie/consent notices, sale promotions.

## When not to use

- For inline page banners, use `Banner` instead.
- For modal interruptions, use `Dialog` or `AlertDialog`.

## Headless

No CSS or JavaScript bundled. Consumers wire up the dismiss handler
and provide the rest of the styling.

## Testing

`components/sticky-promo-banner/macro.test.js` verifies the base
class, complementary role, aria-label, default and overridden
position with matching inline styles, conditional dismiss button,
and `hidden` behaviour.

## References

- [Mozilla Protocol: Sticky Promo Banner](https://protocol.mozilla.org/components/detail/sticky-promo-banner)

---

Lily™ and Lily Design System™ are trademarks.
