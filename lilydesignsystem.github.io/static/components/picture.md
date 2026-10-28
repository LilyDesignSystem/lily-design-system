# Picture

A headless wrapper for a responsive image that lets the browser choose among several sources, using the native picture element.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The component renders the native `<picture>` element. The consumer supplies the `<source>` children (each with `srcset`, and optionally `media`, `type` and `sizes`) and a final `<img>` that carries the `src`, the `alt` text, and the `width` and `height`. The browser picks the first source that matches, or falls back to the `<img>`. The component adds no ARIA, draws nothing and carries no strings of its own.

## Implementation Notes

- Renders `<picture class="picture {class}">` containing the children
- `restProps` spread onto the `<picture>`; no state, no behaviour
- The `<img>` is the consumer's: it is the element that is read by assistive technology, so its `alt` is the consumer's string, supplied in the consumer's language
- A `<picture>` without an `<img>` child renders nothing, so always end with one

## Props

| Prop           | Type            | Default | Description                               |
| -------------- | --------------- | ------- | ----------------------------------------- |
| `class`        | string          | `""`    | Appended to the base class                |
| `children`     | slot            | —       | The `<source>` elements, then one `<img>` |
| `...restProps` | HTML attributes | —       | Spread onto the root `<picture>`          |

## Usage

```svelte
<Picture>
  <source
    srcset="/images/lily-wide.avif"
    media="(min-width: 48rem)"
    type="image/avif"
  />
  <source
    srcset="/images/lily-wide.webp"
    media="(min-width: 48rem)"
    type="image/webp"
  />
  <img
    src="/images/lily-narrow.jpg"
    alt="A white lily in bloom"
    width="640"
    height="400"
  />
</Picture>
```

## Keyboard Interactions

- None. The element is not focusable.

## ARIA

- No ARIA is added; the native `<picture>` carries no role of its own and the `<img>` inside it supplies the accessible name through `alt`
- Do not put `aria-label` on the `<picture>`: it has no role to name. Describe the image with the `<img>`'s `alt`, or wrap both in a `Figure` with a `Caption`

## When to Use

- Art direction: showing a different crop of the image at different viewport widths
- Offering modern formats (AVIF, WebP) with a JPEG or PNG fallback
- Switching images by media condition, such as a dark-mode or print variant
- Anywhere an `Image` is not enough because the browser needs more than one source to choose from

## When Not to Use

- Use `Image` — one source, with optional caption, and `srcset`/`sizes` on the `<img>` itself handles plain resolution switching
- Use `Figure` and `Caption` — to give an image a visible caption (a `Picture` can sit inside a `Figure`)
- Use `ImageFileInput` — choosing an image from the user's device
- Use `Avatar` — a person or organisation image with a fallback
- Use a CSS background — for a purely decorative picture that carries no information

## Headless

This component decides semantics only: the element and the class hook. It decides no sizing, aspect ratio, object-fit, border, radius or loading behaviour.

## Styles

Target `.picture`. A `<picture>` is `display: inline` by default and is only a wrapper, so the useful rules go on the `<img>` inside it (see Advice). The reference themes do not restyle it. No default styles are included in the component.

## Testing

- Renders a `<picture>` with class `picture` and appends the consumer class
- The `<source>` and `<img>` children render, and the `<img>`'s `alt` is untouched
- The component adds no text of its own; rest props reach the root

## Advice

- Always put the `<img>` last and give it `alt`, `width` and `height`. The width and height attributes let the browser reserve the right space before the file arrives, so the page does not shift as it loads. Give the `<source>` elements the same aspect ratio as the `<img>`, or the reserved space will not match.
- Order matters: the browser uses the first `<source>` that matches. Put the most specific media conditions and the newest formats first.
- Write `alt` for the image that is shown. If art direction changes what the picture shows, the same `alt` must still be true of every source.
- Style the `<img>`, not the `<picture>`: the `<picture>` is only a wrapper. See `Image` for the three rules (`display: block`, `max-inline-size: 100%`, `block-size: auto`).
- Use `loading="lazy"` and `decoding="async"` on the `<img>` for images below the fold; do not lazy-load the first image on the page.

## Related components

- `image`
- `figure`
- `caption`
- `image-file-input`
- `avatar`

## References

- [MDN picture element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
- [MDN Responsive images](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images#responsive_images)
- [WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/)

---

Lily™ and Lily Design System™ are trademarks.
