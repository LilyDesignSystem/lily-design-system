# QrCode

A QR code component provides a headless container for displaying a two-dimensional barcode encoding data such as URLs, text, contact information, or other machine-readable content. Commonly used for sharing links, mobile payments, event check-ins, product information, and authentication workflows, the QR code provides a quick way to transfer information from a screen to a mobile device camera.

The component serves as a semantic container that consumers populate with their preferred rendering approach, whether SVG paths, canvas drawings, or a third-party QR generation library. It uses `role="img"` with a required `aria-label` so screen reader users understand what the QR code represents and what action scanning it will perform.

## Implementation Notes

- Renders a `<div>` with `role="img"` to indicate the container represents an image
- Requires an `aria-label` describing the encoded content for accessibility
- Consumers provide the actual QR code rendering (SVG, canvas, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible description of the QR code content via `aria-label`
- `children`: Snippet (required) -- QR code rendering (SVG, canvas, or other visual output)

## Usage

```svelte
<QrCode label="Scan to visit example.com">
  <svg><!-- QR code SVG paths --></svg>
</QrCode>
```

## Keyboard Interactions

None -- this component is a passive display container.

## ARIA

- `role="img"` -- identifies the container as an image for assistive technologies
- `aria-label` -- provides an accessible description of the QR code content, ensuring screen reader users know what the code encodes

## References

- WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img
