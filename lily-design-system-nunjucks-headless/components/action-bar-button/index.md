# ActionBarButton

one action button inside an action bar

## Description

ActionBarButton is a native `<button>` intended to live inside an
`ActionBar`. The consumer provides the visible content (icon and/or
label text) plus a required `aria-label`.

## HTML tag

`<button>`

## CSS class

`action-bar-button`

## Params

- `label` — string. **Required.** `aria-label` for the button.
- `text` — string. Plain text content (escaped).
- `html` — string. Raw HTML content (rendered via `| safe`).
- `type` — `"button" | "submit" | "reset"`. Default `"button"`.
- `disabled` — boolean.
- `id` — string.
- `name` — string.
- `value` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/action-bar-button/macro.njk" import actionBarButton %}

{{ actionBarButton({ label: "Delete", text: "Delete" }) }}
```

With an icon:

```njk
{{ actionBarButton({
  label: "Delete",
  html: '<svg aria-hidden="true">…</svg><span>Delete</span>'
}) }}
```

## Keyboard

- Tab to focus.
- Enter or Space to activate.

## Accessibility

- Native `<button>` provides implicit role and keyboard semantics.
- `aria-label` is required so the button has an accessible name even
  when the visible content is icon-only.

## Headless

No CSS or JavaScript bundled. The consumer wires up click handlers
and styling.

## Testing

`components/action-bar-button/macro.test.js` verifies the base
class, `aria-label`, default and custom `type`, disabled state,
content slots, classes, and attributes.

## References

- [WAI-ARIA: button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Adobe Spectrum: Action bar](https://spectrum.adobe.com/page/action-bar/)

---

Lily™ and Lily Design System™ are trademarks.
