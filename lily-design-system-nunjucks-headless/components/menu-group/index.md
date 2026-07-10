# MenuGroup

a labeled section of menu items within a menu

## Description

MenuGroup wraps a related cluster of menu items inside a single
labelled group. The label is rendered both as `aria-label` on the
container and as a visible `<div class="menu-group-heading">` that
is marked `aria-hidden="true"` to avoid being announced twice.

## HTML tag

`<div role="group">`

## CSS class

`menu-group`

## Params

- `label` — string. **Required.** Section heading text. Used as
  the group's `aria-label` and as the visible (but
  `aria-hidden="true"`) heading.
- `text` — string. Plain text content (escaped). Typically
  `MenuItem` children.
- `html` — string. Raw HTML content (rendered via `| safe`).
  Typically `MenuItem` children.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/menu-group/macro.njk" import menuGroup %}

{{ menuGroup({
  label: "View",
  html: '<div role="menuitem">Zoom in</div>'
       + '<div role="menuitem">Zoom out</div>'
}) }}
```

## Accessibility

- `role="group"` plus `aria-label` describe the section.
- The visible heading carries `aria-hidden="true"` so screen
  readers do not announce the same text twice.

## Headless

No CSS or JavaScript bundled. The consumer wires up styling.

## Testing

`components/menu-group/macro.test.js` verifies the role,
`aria-label`, the visible heading, the `aria-hidden` heading,
content slots, classes, and attributes.

## References

- [WAI-ARIA: menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)
- [Adobe Spectrum: Menu](https://spectrum.adobe.com/page/menu/)

---

Lily™ and Lily Design System™ are trademarks.
