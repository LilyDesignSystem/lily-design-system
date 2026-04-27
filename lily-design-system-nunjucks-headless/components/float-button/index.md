# FloatButton

a floating action button anchored to a viewport corner

## Description

FloatButton renders a native `<button class="float-button">` whose
inline `style="position: fixed; …"` pins it to one of four viewport
corners. The corner is exposed via `data-position` for consumer CSS
overrides.

Because the visible content is typically an icon, the consumer
**must** provide `label`, which is rendered as `aria-label`.

## HTML tag

`<button>`

## CSS class

`float-button`

## Params

- `label` — string. **Required.** `aria-label` for the button.
- `position` — `"top-left" | "top-right" | "bottom-left" |
  "bottom-right"`. Default `"bottom-right"`.
- `type` — `"button" | "submit" | "reset"`. Default `"button"`.
- `disabled` — boolean.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `id` — string.
- `name` — string.
- `value` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/float-button/macro.njk" import floatButton %}

{{ floatButton({
  label: "Compose new message",
  position: "bottom-right",
  html: '<svg viewBox="0 0 24 24" aria-hidden="true">…</svg>'
}) }}
```

Top-left, with caller block:

```njk
{% call floatButton({ label: "Help", position: "top-left" }) %}
  <span aria-hidden="true">?</span>
{% endcall %}
```

## Behavior

The macro renders inline `style="position: fixed; <corner offsets>"`
using `1rem` defaults so the button is positioned on first paint.
Consumers can override sizing, animation, and layering via CSS.

## Accessibility

- `aria-label` provides the entire accessible name.
- The icon should include `aria-hidden="true"` so screen readers
  don't double-announce it.
- Avoid placing critical actions only inside a FloatButton — keep
  primary actions discoverable in the document flow as well.

## Headless

No CSS or JavaScript is bundled beyond the inline positioning style.
Consumers wire click handlers and visual styling.

## Testing

`components/float-button/macro.test.js` verifies the base class,
`aria-label`, default type, all four `data-position` values and
their inline offsets, disabled state, and pass-through.

## References

- [WAI-ARIA: button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Ant Design: FloatButton](https://ant.design/components/float-button)
