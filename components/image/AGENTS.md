# Image

## Metadata

- Component: image
- PascalCase: Image
- Description: an image element with alt text
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <img>
- CSS class: .image
- Interactive: no

## Key Behaviors

- Renders a plain `<img>` element; for a caption, wrap it in `figure` with a `caption` (its `<figcaption>`)
- The `alt` prop is required to enforce accessibility
- Rest props are spread onto the `<img>` element
- Supports the native `loading` attribute for lazy/eager loading control

## Consumer CSS and attributes

- Give the image explicit `width` and `height` attributes (the file's real dimensions) so the page does not shift as images load
- Consumer CSS: `display: block` (no baseline gap), `max-inline-size: 100%` (no overflow), `block-size: auto` (keeps the aspect ratio)

## ARIA

- `alt="..."` -- provides the accessible name for the image, required for all non-decorative images

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `src`: string (required) -- the image source URL
- `alt`: string (required) -- alternative text describing the image for screen readers and when the image fails to load
- `loading`: "lazy" | "eager" (optional) -- controls the native browser loading behavior
- `...restProps`: unknown -- additional attributes spread onto the `<img>`

## Acceptance Criteria

- [ ] Renders <img> element with class="image"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .image in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/image.html
- WAI Images Tutorial: https://www.w3.org/WAI/tutorials/images/
- HTML figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
