# Image

## Metadata

- Component: image
- PascalCase: Image
- Description: an image element with alt text
- HTML tag: <img>
- CSS class: .image
- Interactive: no

## Key Behaviors

- Renders a plain `<img>` element when no caption is provided
- Renders a `<figure>` with `<img>` and `<figcaption>` when a caption is provided
- The `alt` prop is required to enforce accessibility
- Rest props are spread onto the `<img>` element (no caption) or the `<figure>` element (with caption)
- Supports the native `loading` attribute for lazy/eager loading control

## ARIA

- `alt="..."` -- provides the accessible name for the image, required for all non-decorative images
- `<figure>` and `<figcaption>` -- when caption is present, these semantic HTML elements associate the caption with the image for assistive technology

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `src`: string (required) -- the image source URL
- `alt`: string (required) -- alternative text describing the image for screen readers and when the image fails to load
- `caption`: string (optional) -- when provided, wraps the image in a `<figure>` with a `<figcaption>`
- `loading`: "lazy" | "eager" (optional) -- controls the native browser loading behavior
- `...restProps`: unknown -- additional attributes spread onto the root element

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
