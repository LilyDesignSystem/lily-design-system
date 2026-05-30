# BarcodeImage

## Metadata

- Component: barcode-image
- PascalCase: BarcodeImage
- Description: a visual machine-readable symbolic code image, such as for a scanner
- HTML tag: <img>
- CSS class: .barcode-image
- Interactive: no

## Key Behaviors

- Renders an `<img>` element with class `barcode-image`
- `src` prop carries the rendered barcode-image image URL or data-URL
- `alt` prop is required and conveys the encoded value or its meaning
- Supports the native `loading` attribute for lazy/eager loading control
- Rest props are spread onto the `<img>` element

## ARIA

- `alt="..."` -- provides the accessible name for the barcode-image image; required for all non-decorative images

## Keyboard

- None -- this is a passive image element

## Props

- `src`: string (required) -- the barcode-image image URL or data-URL
- `alt`: string (required) -- alternative text describing what the barcode-image encodes
- `loading`: "lazy" | "eager" (optional) -- controls native browser loading behavior
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <img> element with class="barcode-image"
- [ ] Has src attribute from the prop
- [ ] Has alt attribute from the prop
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .barcode-image in css-style-sheet-template.css
- WAI Images Tutorial: https://www.w3.org/WAI/tutorials/images/
