# QR Code

A QR code component provides a headless container for displaying a two-dimensional barcode encoding data such as URLs, text, contact information, or other machine-readable content. Commonly used for sharing links, mobile payments, event check-ins, product information, and authentication workflows, the QR code provides a quick way to transfer information from a screen to a mobile device camera.

The component serves as a semantic container that consumers populate with their preferred rendering approach, whether SVG paths, canvas drawings, or a third-party QR generation library. It uses `role="img"` with a required `aria-label` so screen reader users understand what the QR code represents and what action scanning it will perform.

## Implementation Notes

- Renders a `<div>` with `role="img"` to indicate the container represents an image
- Requires an `aria-label` describing the encoded content for accessibility
- Consumers provide the actual QR code rendering (SVG, canvas, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible description of the QR code content via `aria-label`
- `children`: slot (required) -- QR code rendering (SVG, canvas, or other visual output)

## Usage

```html
<QrCodeImage label="Scan to visit example.com">
  <svg><!-- QR code SVG paths --></svg>
</QrCodeImage>
```

## Keyboard Interactions

None -- this component is a passive display container.

## ARIA

- `role="img"` -- identifies the container as an image for assistive technologies
- `aria-label` -- provides an accessible description of the QR code content, ensuring screen reader users know what the code encodes

## When to Use

- Use QrCodeImage to encode URLs, text, or contact information for quick mobile scanning in marketing materials, event check-ins, or payment flows.
- Use QrCodeImage when users need to transfer information from screen to mobile device without manual typing.
- Avoid using QrCodeImage as the sole means of sharing a link; always provide a text-based alternative for accessibility.

## When Not to Use

- Do not use as the only way to access information — always pair with a text-based equivalent (a written URL, a copy-link button) so it is accessible to keyboard, screen reader, and desktop users.
- Do not use to encode large or sensitive payloads — large QR codes degrade scanning reliability and printed/screenshotted codes are not secret.
- Do not use as a generic image — use `Image` for arbitrary pictures, or `Icon` for symbolic glyphs.
- Do not use without a meaningful `label` describing what scanning will do, not the raw encoded string.

## Headless

The QrCodeImage headless component provides a `<div>` with `role="img"` and `aria-label` so screen readers can describe what the QR code encodes. The consumer provides the actual QR code rendering (SVG, canvas, or a third-party library) as children, along with all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.qr-code-image` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `qr-code-image`
- Verify role="img"` -- identifies the container as an image for assistive technologies
- Verify aria-label` -- provides an accessible description of the QR code content, ensuring screen reader users know what the code encodes
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the QR code has sufficient size and contrast for reliable scanning, and include a short text label or caption explaining what scanning will do.
- **Developers**: Use a proven QR generation library for the children content, and set the `aria-label` to describe the action (e.g., "Scan to visit example.com") rather than the raw encoded data.

## Related components

- `image` — an image element with alt text
- `icon` — a container for displaying an icon

## References

- WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img
