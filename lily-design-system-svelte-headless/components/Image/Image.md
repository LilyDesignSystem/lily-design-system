# Image

An image component displays visual content such as photographs, illustrations, or diagrams within an interface. The Image component provides a headless wrapper that ensures proper accessibility through required alt text and optional caption support via the HTML `<figure>` and `<figcaption>` elements.

When a caption is provided, the component renders a `<figure>` containing the `<img>` and a `<figcaption>`, giving the image semantic association with its description. Without a caption, it renders a plain `<img>` element. The component also supports native lazy loading for performance optimization.

## Implementation Notes

- Renders a plain `<img>` element when no caption is provided
- Renders a `<figure>` with `<img>` and `<figcaption>` when a caption is provided
- The `alt` prop is required to enforce accessibility
- Rest props are spread onto the `<img>` element (no caption) or the `<figure>` element (with caption)
- Supports the native `loading` attribute for lazy/eager loading control

## Props

- `src`: string (required) -- the image source URL
- `alt`: string (required) -- alternative text describing the image for screen readers and when the image fails to load
- `caption`: string (optional) -- when provided, wraps the image in a `<figure>` with a `<figcaption>`
- `loading`: "lazy" | "eager" (optional) -- controls the native browser loading behavior
- `...restProps`: unknown -- additional attributes spread onto the root element

## Usage

```svelte
<!-- Basic image with alt text -->
<Image src="/photo.jpg" alt="A sunset over the ocean" />

<!-- Image with caption wrapped in figure/figcaption -->
<Image src="/photo.jpg" alt="A sunset over the ocean" caption="Photo by Jane Doe" />

<!-- Lazy-loaded image -->
<Image src="/large-photo.jpg" alt="Landscape" loading="lazy" />
```

## Keyboard Interactions

None -- this component is a passive content element. Images are not interactive by default.

## ARIA

- `alt="..."` -- provides the accessible name for the image, required for all non-decorative images
- `<figure>` and `<figcaption>` -- when caption is present, these semantic HTML elements associate the caption with the image for assistive technology

## References

- WAI Images Tutorial: https://www.w3.org/WAI/tutorials/images/
- HTML figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
