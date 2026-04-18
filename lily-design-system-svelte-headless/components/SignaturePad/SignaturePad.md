# SignaturePad

A signature pad provides a headless container for capturing handwritten signatures, typically using mouse, touch, or stylus input. Commonly used in contract signing workflows, consent forms, delivery confirmations, and legal document processing, the signature pad brings the familiar pen-on-paper signing experience to digital interfaces.

The component serves as a semantic container that consumers populate with their preferred drawing implementation, whether HTML canvas, SVG paths, or a third-party signature library. It uses `role="application"` to support complex pointer interactions, along with an accessible label describing the signing purpose.

## Implementation Notes

- Renders a `<div>` with `role="application"` to indicate complex widget behavior requiring pointer interaction
- Requires an `aria-label` describing the signing purpose for accessibility
- Consumers provide the actual drawing surface (canvas, SVG, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible description of the signature field via `aria-label`
- `children`: Snippet (required) -- drawing surface (canvas, SVG, or other input mechanism)

## Usage

```svelte
<SignaturePad label="Sign to accept terms">
  <canvas width="400" height="200"></canvas>
</SignaturePad>
```

## Keyboard Interactions

None -- this component is a passive container. Pointer-based interactions are handled by the consumer-provided drawing surface.

## ARIA

- `role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- `aria-label` -- provides an accessible description of the signature pad purpose

## References

- WAI-ARIA application Role: https://www.w3.org/TR/wai-aria-1.2/#application
