# SignaturePad

## Metadata

- Component: signature-pad
- PascalCase: SignaturePad
- Description: a drawing area for capturing a handwritten signature
- HTML tag: <canvas>
- CSS class: .signature-pad
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="application"` to indicate complex widget behavior requiring pointer interaction
- Requires an `aria-label` describing the signing purpose for accessibility
- Consumers provide the actual drawing surface (canvas, SVG, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## ARIA

- `role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- `aria-label` -- provides an accessible description of the signature pad purpose

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible description of the signature field via `aria-label`
- `children`: slot (required) -- drawing surface (canvas, SVG, or other input mechanism)

## Acceptance Criteria

- [ ] Renders <canvas> element with class="signature-pad"
- [ ] Has aria-label attribute
- [ ] Has role="application"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .signature-pad in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/signature-pad.html
- WAI-ARIA application Role: https://www.w3.org/TR/wai-aria-1.2/#application
