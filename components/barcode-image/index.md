# BarcodeImage

A barcode-image is a visual machine-readable symbolic code image, such as a 1D linear barcode-image (UPC, EAN, Code 128) or a stacked symbology rendered as a flat image and scanned by a hardware or camera-based scanner. Typical uses include retail SKUs, inventory tracking, patient wristbands, shipping labels, ticket scanning, and library catalogs.

This headless component renders a standard `<img>` element with class `barcode-image` whose `src` attribute carries the barcode-image image (commonly a PNG, SVG, or data-URL produced by a barcode-image-generation library). Required `alt` text describes what the barcode-image encodes so screen reader users and users with images disabled understand the code's purpose.

Use `qr-code` for a 2D matrix code that you draw inside a `<div role="img">` container; use `barcode-image` for any image-shaped symbology delivered as an `<img>` `src`.

## Implementation Notes

- Renders an `<img>` element with class `barcode-image`
- The `src` prop carries the rendered barcode-image image URL or data-URL
- The `alt` prop is required and conveys the encoded value or its meaning
- Supports the native `loading` attribute for lazy/eager loading control
- Rest props are spread onto the `<img>` element

## Props

- `src`: string (required) -- the barcode-image image URL or data-URL
- `alt`: string (required) -- alternative text describing what the barcode-image encodes (e.g., "Order number 12345" or the raw value)
- `loading`: "lazy" | "eager" (optional) -- controls native browser loading behavior
- `...restProps`: unknown -- additional attributes spread onto the `<img>` element

## Usage

```html
<BarcodeImage src="/barcode-images/order-12345.svg" alt="Order number 12345" />
```

Patient wristband example:

```html
<BarcodeImage src={patientBarcodeImageDataUrl} alt="Patient identifier 943 476 5919" />
```

Shipping label with text fallback:

```html
<div>
  <BarcodeImage src="/labels/RX2024.svg" alt="Tracking number RX2024-998-441" />
  <p>RX2024-998-441</p>
</div>
```

## Keyboard Interactions

- None -- this is a passive image element

## ARIA

- `alt="..."` -- provides the accessible name for the barcode-image image; required for all non-decorative images

## When to Use

- Use to display 1D linear barcode-images (UPC, EAN, Code 128, Code 39) generated as an image.
- Use for printed-and-scanned workflows: retail checkout, inventory, shipping, ticketing, library, patient identification.
- Use when the encoded value is best represented as a flat raster or vector image rather than a drawn-in-place SVG path.

## When Not to Use

- Do not use for 2D matrix codes drawn with SVG paths or canvas — use `qr-code` instead.
- Do not use as the only way to convey the encoded value — always pair with a visible text-based equivalent (the order number, tracking number, identifier) so keyboard, screen reader, and desktop users have access.
- Do not use as a generic image — use `image` for arbitrary pictures, or `icon` for symbolic glyphs.
- Do not omit `alt`; an empty alt is only appropriate for purely decorative images, which barcode-images never are.

## Headless

The BarcodeImage headless component provides an `<img>` element with required `src` and `alt`, plus optional `loading` and rest-props passthrough. The consumer is responsible for generating the barcode-image image (via a barcode-image-generation library, server endpoint, or pre-rendered asset) and for all visual styling, sizing, and the surrounding text fallback.

## Styles

The consumer provides all CSS styling. The component renders with a `.barcode-image` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<img>` element with class `barcode-image`
- Verify `src` is applied from the prop
- Verify `alt` is applied from the prop
- Verify pass-through attributes are applied

## Advice

- **Designers**: Size the barcode-image for reliable scanning — keep adequate quiet zone (margin) on both sides, and ensure sufficient contrast. Always print or display the encoded value in human-readable text alongside the barcode-image.
- **Developers**: Set `alt` to the meaning of the code ("Order number 12345"), not the raw symbology. Use SVG `src` where possible for crisp rendering at any size; use PNG `src` for legacy print pipelines.

## Related components

- `qr-code` — a QR code image generated from text or URL data
- `image` — an image element with alt text
- `icon` — a container for displaying an icon

## References

- [MDN img element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
- [WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/)

---

Lily™ and Lily Design System™ are trademarks.
