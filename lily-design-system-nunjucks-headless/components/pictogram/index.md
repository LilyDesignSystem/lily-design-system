# Pictogram

an icon-based component pairing an icon with a title and description
in a centered or side layout

## Description

Pictogram is a `<figure>` containing an icon slot, a heading, and a
description. The icon container is `aria-hidden="true"` so the
figure's accessible name is supplied by the heading (or `label`
override). Layout is exposed as a data attribute so consumers can
drive composition with CSS.

## HTML tag

`<figure>`

## CSS class

`pictogram`

## Params

- `layout` — `"centered"` | `"side"`. Default `"centered"`. Rendered
  as `data-layout`.
- `heading` — string. Title text rendered as `<h3>`.
- `description` — string. Body text rendered as `<p>`.
- `iconHtml` — string. Raw HTML icon content (rendered via `| safe`).
  Use for SVGs.
- `iconText` — string. Plain text icon content (escaped). Use for
  emoji or single glyphs.
- `label` — string. `aria-label` override (defaults to `heading`).
- `text` — string. Plain text trailing content; overrides
  `description`.
- `html` — string. Raw HTML trailing content; overrides
  `description`.
- `id` — string.
- `classes` — string.
- `attributes` — object.

## Usage

```njk
{% from "components/pictogram/macro.njk" import pictogram %}

{{ pictogram({
  layout: "centered",
  heading: "Privacy",
  description: "Your data, your choice.",
  iconHtml: "<svg viewBox='0 0 24 24' aria-hidden='true'>…</svg>"
}) }}
```

With an emoji glyph:

```njk
{{ pictogram({
  iconText: "🔒",
  heading: "Privacy",
  description: "Your data, your choice."
}) }}
```

## Accessibility

- The icon container is `aria-hidden="true"` so screen readers do not
  announce decorative SVGs.
- The accessible name comes from the heading or the `label` override.

## When to use

- Three-up or four-up feature grids on marketing pages.

## When not to use

- For an interactive card with a CTA, prefer `FeatureCard`.

## Headless

No CSS or JavaScript bundled. Consumers provide all styling and
supply their own icon SVGs.

## Testing

`components/pictogram/macro.test.js` verifies the base class,
data-layout, aria-hidden icon container, heading default aria-label,
description rendering, and content overrides.

## References

- [Mozilla Protocol: Pictogram](https://protocol.mozilla.org/components/detail/pictogram)

---

Lily™ and Lily Design System™ are trademarks.
