# QrCodeImage

## Metadata

- Component: qr-code-image
- PascalCase: QrCodeImage
- Description: a QR code image generated from text or URL data
- HTML tag: <div>
- CSS class: .qr-code-image
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="img"` to indicate the container represents an image
- Requires an `aria-label` describing the encoded content for accessibility
- Consumers provide the actual QR code rendering (SVG, canvas, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## ARIA

- `role="img"` -- identifies the container as an image for assistive technologies
- `aria-label` -- provides an accessible description of the QR code content, ensuring screen reader users know what the code encodes

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible description of the QR code content via `aria-label`
- `children`: slot (required) -- QR code rendering (SVG, canvas, or other visual output)

## Acceptance Criteria

- [ ] Renders <div> element with class="qr-code-image"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .qr-code-image in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/qr-code.html
- WAI-ARIA img Role: https://www.w3.org/TR/wai-aria-1.2/#img
