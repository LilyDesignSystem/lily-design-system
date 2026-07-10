# SplitView

a two-panel resizable layout container with a draggable divider
between them

## Description

SplitView renders two `<section>` panels separated by a divider.
The container exposes the orientation and split percentage as
`data-orientation` and `data-split-percent` so the consumer can
style and animate them.

By default the divider is a `<div role="separator">` with
`aria-orientation`, `aria-valuenow`, `aria-valuemin`,
`aria-valuemax`, and `tabindex="0"` so keyboard users can resize
it. The consumer can replace the default divider entirely by
passing `dividerHtml`.

## HTML tag

`<div>` containing two `<section>` panels and a divider element.

## CSS class

`split-view`

## Params

- `label` — string. **Required.** `aria-label` for the container.
- `orientation` — `"horizontal" | "vertical"`. Default
  `"horizontal"`. Used as `data-orientation` on the container and
  `aria-orientation` on the default divider.
- `primaryHtml` — string. **Required.** Raw HTML for the first panel.
- `secondaryHtml` — string. **Required.** Raw HTML for the second panel.
- `dividerHtml` — string. Optional raw HTML replacing the default
  divider entirely.
- `splitPercent` — number (0-100). Default `50`. Initial split
  position as a percentage. Rendered as `data-split-percent` and as
  `aria-valuenow` on the default divider.
- `id` — string.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/split-view/macro.njk" import splitView %}

{{ splitView({
  label: "Files and preview",
  orientation: "horizontal",
  splitPercent: 30,
  primaryHtml: "<nav>files</nav>",
  secondaryHtml: "<article>preview</article>"
}) }}
```

Custom divider:

```njk
{{ splitView({
  label: "Files and preview",
  primaryHtml: "<nav>files</nav>",
  secondaryHtml: "<article>preview</article>",
  dividerHtml: '<button class="my-handle" type="button" role="separator" aria-orientation="horizontal" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">drag</button>'
}) }}
```

## Accessibility

- Container has an `aria-label`.
- The default divider has `role="separator"`, `aria-orientation`,
  and `aria-valuenow`/`aria-valuemin`/`aria-valuemax`.
- The divider has `tabindex="0"` so keyboard users can focus and
  resize it.

## Headless

No CSS or JavaScript bundled. The consumer wires up resize
handlers, focus management, and styling.

## Testing

`components/split-view/macro.test.js` verifies the base class,
`aria-label`, default and custom orientation/split values, panel
content rendering, default divider ARIA, custom divider override,
classes, and attributes.

## References

- [WAI-ARIA: separator role](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)
- [Adobe Spectrum: Split view](https://spectrum.adobe.com/page/split-view/)

---

Lily™ and Lily Design System™ are trademarks.
