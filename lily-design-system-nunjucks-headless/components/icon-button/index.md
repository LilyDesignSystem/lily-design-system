# IconButton

a button containing only an icon with a required accessible label

## Description

IconButton is a native `<button>` whose visible content is an icon
(SVG, emoji, glyph, etc.). Because there is no visible text, the
consumer **must** provide a `label` that is rendered as `aria-label`.

When `pressed` is provided, the button renders `aria-pressed` for
two-state toggle semantics.

## HTML tag

`<button>`

## CSS class

`icon-button`

## Params

- `label` — string. **Required.** `aria-label` for the button.
- `text` — string. Optional escaped fallback text.
- `html` — string. Raw HTML content (typically the icon SVG/glyph).
- `type` — `"button" | "submit" | "reset"`. Default `"button"`.
- `disabled` — boolean.
- `pressed` — boolean. When provided, renders `aria-pressed`.
- `id` — string.
- `name` — string.
- `value` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/icon-button/macro.njk" import iconButton %}

{{ iconButton({
  label: "Close dialog",
  html: '<svg viewBox="0 0 24 24" aria-hidden="true">…</svg>'
}) }}
```

Toggle state:

```njk
{{ iconButton({
  label: "Bold",
  pressed: true,
  html: "<strong aria-hidden='true'>B</strong>"
}) }}
```

## Keyboard

- Tab to focus
- Enter or Space to activate

## Accessibility

- `aria-label` provides the entire accessible name.
- The icon content should include `aria-hidden="true"` so screen
  readers don't double-announce it.
- `aria-pressed` is rendered when `pressed` is supplied (two-state
  toggle). For binary on/off settings consider `SwitchButton`
  (role="switch") instead.

## When to use

- Tight toolbars where text labels do not fit.
- Recognizable icons (close, search, like) where the icon is
  unambiguous.

## When not to use

- For ambiguous actions, prefer a labelled `Button`.
- For on/off settings, prefer `SwitchButton`.

## Headless

No CSS or JavaScript bundled. The consumer wires up click handlers
and styling.

## Testing

`components/icon-button/macro.test.js` verifies the base class,
`aria-label`, default type, `aria-pressed` rendering, disabled state,
and content slots.

## References

- [WAI-ARIA: button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [WAI-ARIA: aria-pressed](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed)

---

Lily™ and Lily Design System™ are trademarks.
