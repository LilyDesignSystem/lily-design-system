# Watermark

a decorative repeating overlay text or image marking a page

## Description

Watermark renders a `<div class="watermark">` containing two
children: a decorative `<div class="watermark-overlay" aria-hidden="true">`
and the page content beneath it. The watermark settings (text,
image URL, gap, rotation) are exposed as `data-*` attributes so the
consumer can build the actual repeating-pattern CSS (typically
`background-image` with an SVG-encoded text snippet).

The headless component does not synthesize the visual pattern itself;
it provides the structural ARIA scaffolding and the parameter hooks.

## HTML tag

`<div>`

## CSS class

`watermark`

## Params

- `text` — string. Optional watermark text. Exposed as `data-text`
  on the overlay.
- `imageUrl` — string. Optional watermark image URL. Exposed as
  `data-image-url` on the overlay.
- `gap` — string. Default `"100px"`. Spacing between repeats (CSS
  length). Exposed as `data-gap` on the root.
- `rotate` — number (degrees). Default `-22`. Rotation angle.
  Exposed as `data-rotate` on the root.
- `contentText` — string. Plain text content beneath the watermark
  (escaped).
- `contentHtml` — string. Raw HTML content beneath the watermark
  (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes on the root element.

## Usage

```njk
{% from "components/watermark/macro.njk" import watermark %}

{% call watermark({
  text: "Confidential",
  rotate: -22,
  gap: "120px"
}) %}
  <article>
    <h1>Q3 Forecast</h1>
    <p>…</p>
  </article>
{% endcall %}
```

Image watermark:

```njk
{% call watermark({ imageUrl: "/assets/draft.png", gap: "200px" }) %}
  <article>…</article>
{% endcall %}
```

## Accessibility

- The overlay carries `aria-hidden="true"` because the watermark is
  decorative.
- The watermark must not convey the only signal of important
  information (e.g., "Confidential"). Repeat the message in the
  visible content for screen-reader users.

## Headless

No CSS or JavaScript is bundled. Consumers are responsible for the
repeating pattern (e.g., a `background-image` built from an
SVG-encoded text or an image URL combined with the `--gap` and
`--rotate` custom properties).

## Testing

`components/watermark/macro.test.js` verifies the base class, the
decorative overlay with `aria-hidden`, the data attributes for text,
imageUrl, gap, and rotate, document order, and pass-through.

## References

- [WAI-ARIA: aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden)
- [Ant Design: Watermark](https://ant.design/components/watermark)
