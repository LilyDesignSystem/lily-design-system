# Signature Pad

A signature pad provides a headless container for capturing handwritten signatures, typically using mouse, touch, or stylus input. Commonly used in contract signing workflows, consent forms, delivery confirmations, and legal document processing, the signature pad brings the familiar pen-on-paper signing experience to digital interfaces.

The component serves as a semantic container that consumers populate with their preferred drawing implementation, whether HTML canvas, SVG paths, or a third-party signature library. It uses `role="application"` to support complex pointer interactions, along with an accessible label describing the signing purpose.

## Implementation Notes

- Renders a `<div>` with `role="application"` to indicate complex widget behavior requiring pointer interaction
- Requires an `aria-label` describing the signing purpose for accessibility
- Consumers provide the actual drawing surface (canvas, SVG, etc.) as children
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- accessible description of the signature field via `aria-label`
- `children`: slot (required) -- drawing surface (canvas, SVG, or other input mechanism)

## Usage

Basic signature pad with a canvas:

```html
<SignaturePad label="Sign to accept terms">
  <canvas width="400" height="200"></canvas>
</SignaturePad>
```

Signature pad in a consent form:

```html
<Form label="Patient consent" onsubmit={handleConsent}>
  <p>I consent to the proposed treatment plan as described above.</p>
  <Field label="Patient signature" required>
    <SignaturePad label="Patient signature">
      <canvas width="500" height="200" id="patient-sig"></canvas>
    </SignaturePad>
  </Field>
  <Field label="Date">
    <DateInput label="Date of signature" value={signatureDate} required />
  </Field>
  <div class="actions">
    <Button type="button" onclick={clearSignature}>Clear signature</Button>
    <Button type="submit">Submit consent</Button>
  </div>
</Form>
```

Signature pad for a delivery confirmation:

```html
<SignaturePad label="Recipient signature for parcel delivery">
  <canvas width="400" height="150" id="delivery-sig"></canvas>
</SignaturePad>
<p>By signing, you confirm receipt of the package.</p>
```

## Keyboard Interactions

None -- this component is a passive container. Pointer-based interactions are handled by the consumer-provided drawing surface.

## ARIA

- `role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- `aria-label` -- provides an accessible description of the signature pad purpose

## When to Use

- Use when capturing a handwritten signature is required, such as for contracts, consent forms, delivery confirmations, or legal documents.
- Use when a pen-on-paper signing experience is needed in a digital interface.
- Use in clinical workflows where patient or clinician signatures are legally required.
- Use for parcel delivery confirmations where proof of receipt is needed.

## When Not to Use

- Do not use when a checkbox agreement is sufficient -- use CheckboxInput for simple consent.
- Do not use for drawing or annotation -- build a custom canvas instead.
- Do not use when a typed name input would meet the legal requirement -- use TextInput instead.

## Headless

This headless component provides a semantic container with `role="application"` and `aria-label` for complex pointer interactions. The consumer provides the actual drawing surface (HTML canvas, SVG, or third-party library) as children, along with all visual styling, stroke handling, and signature data capture.


## Styles

The consumer provides all CSS styling. The component renders with a `.signature-pad` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<canvas>` element with class `signature-pad`
- Verify role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- Verify aria-label` -- provides an accessible description of the signature pad purpose
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide a clear border and placeholder text (e.g., "Sign here") so users understand where to draw. Include a visible clear/reset button alongside the pad.
- **Developers**: Offer a clear button to reset the signature and export the result as an image or data URL. Provide a keyboard-accessible alternative or fallback for users who cannot use pointer input.

## References

- WAI-ARIA application Role: https://www.w3.org/TR/wai-aria-1.2/#application
