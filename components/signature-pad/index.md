# Signature Pad

A signature pad provides a headless container for capturing handwritten signatures, typically using mouse, touch, or stylus input. Commonly used in contract signing workflows, consent forms, delivery confirmations, and legal document processing, the signature pad brings the familiar pen-on-paper signing experience to digital interfaces.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

The component is a named group that consumers populate with their preferred drawing implementation, whether HTML canvas, SVG paths, or a third-party signature library. It carries the consumer's attestation (what the signer confirms), an optional typed-name field so that drawing is never the only way to sign (WCAG 2.1.1), and the signature's outcome in the consumer's words (signed, declined, unable, verbal, on paper, pending, revoked). Changed 2026-11-17 (tasks.md P31-T5, spec/lessons/zoblocks item 6): it was `role="application"`, which took a screen reader's own keys away.

## Implementation Notes

- Renders a `<div role="group">` named by `label` (`aria-label`); not `role="application"`, so a screen reader keeps its own keys
- `attestation` is shown first, as `<p class="signature-pad-attestation">`, and is the group's description (`aria-describedby`)
- Consumers provide the drawing surface (canvas, SVG, etc.) as children; the Web Components and Nunjucks versions include a `<canvas class="signature-pad-canvas">`
- `typedNameLabel` adds `<p class="signature-pad-typed">` with a labelled `<input type="text" autocomplete="name">`, so a signature can be given by keyboard alone
- `outcome` is rendered as `data-outcome`; with `outcomeLabel` it adds `<p class="signature-pad-outcome">`, a notice in the consumer's words, never an empty line. A development warning names a missing `outcomeLabel`
- No hashing, timestamps or storage: those are the consumer's
- Spreads `restProps` onto the container for consumer customization

## Props

- `label`: string (required) -- the group's accessible name, via `aria-label`
- `attestation`: string (optional) -- what the signer confirms, in the consumer's words; shown first and the group's description
- `typedNameLabel`: string (optional) -- adds a typed-name field with this label; drawing is then never the only way to sign
- `typedName`: string (optional, bindable) -- the typed name (React: controlled with `onTypedNameChange`; Vue `v-model:typedName`; Angular `[(typedName)]`; Blazor `@bind-TypedName`)
- `name`: string (optional) -- the typed-name field's form name (Nunjucks: `typedName`)
- `outcome`: `"signed"` | `"declined"` | `"unable"` | `"verbal"` | `"on-paper"` | `"pending"` | `"revoked"` (optional) -- rendered as `data-outcome`
- `outcomeLabel`: string -- the outcome in the consumer's words ("Declined to sign"); required with `outcome`
- `children`: slot (optional) -- drawing surface (canvas, SVG, or other input mechanism)

## Usage

Basic signature pad with a canvas:

```html
<SignaturePad label="Sign to accept terms">
  <canvas
    width="400"
    height="200"
  ></canvas>
</SignaturePad>
```

Signature pad in a consent form:

```html
<form
  label="Patient consent"
  onsubmit="{handleConsent}"
>
  <p>I consent to the proposed treatment plan as described above.</p>
  <Field
    label="Patient signature"
    required
  >
    <SignaturePad label="Patient signature">
      <canvas
        width="500"
        height="200"
        id="patient-sig"
      ></canvas>
    </SignaturePad>
  </Field>
  <Field label="Date">
    <DateInput
      label="Date of signature"
      value="{signatureDate}"
      required
    />
  </Field>
  <div class="actions">
    <button
      type="button"
      onclick="{clearSignature}"
    >
      Clear signature
    </button>
    <button type="submit">Submit consent</button>
  </div>
</form>
```

Signature pad for a delivery confirmation:

```html
<SignaturePad label="Recipient signature for parcel delivery">
  <canvas
    width="400"
    height="150"
    id="delivery-sig"
  ></canvas>
</SignaturePad>
<p>By signing, you confirm receipt of the package.</p>
```

## Keyboard Interactions

| Key | Action                                                                                    |
| --- | ----------------------------------------------------------------------------------------- |
| Tab | Moves to the typed-name field, and to any control the consumer's drawing surface provides |

The drawing surface handles its own keys. Because the group is not `role="application"`, a screen reader's reading keys still work inside it.

## ARIA

- `role="group"` with `aria-label` -- names the signature, its attestation, drawing surface and typed-name field as one group
- `aria-describedby` -- the attestation, so the group is announced with what the signer confirms
- The typed-name field is a native `<input>` with a `<label for>`
- The outcome is plain text, not a live region: announce a change yourself when the user's own action caused it

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

This headless component provides a named group (`role="group"`, `aria-label`) with the attestation, an optional typed-name field and the outcome in words. The consumer provides the actual drawing surface (HTML canvas, SVG, or third-party library) as children, along with all visual styling, stroke handling, and signature data capture.

## Styles

The consumer provides all CSS styling. The component renders with a `.signature-pad` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the root is a `<div class="signature-pad" role="group">` with `aria-label`, and that no element has `role="application"`
- Verify the attestation is the first child and the group's `aria-describedby`
- Verify a signature can be completed by keyboard alone: Tab to the typed-name field and type a name
- Verify `outcome` sets `data-outcome` and `outcomeLabel` is shown as text
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide a clear border and placeholder text (e.g., "Sign here") so users understand where to draw. Include a visible clear/reset button alongside the pad.
- **Developers**: Offer a clear button to reset the signature and export the result as an image or data URL. Always set `typedNameLabel`, so a person who cannot draw can still sign. Record an outcome other than signed (declined, unable, verbal, on paper) in words, with a witness where your rules require one; never leave an empty signature line.

## Related components

- `text-input` — a single-line text input field <input type="text">
- `field` — a form field wrapper with label, input, and error message
- `form` — a form element for collecting and submitting user data

## References

- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- WCAG 2.1.1 Keyboard: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
- ZoBlocks Signature (the outcomes and the typed alternative): https://zoblocks.design/components/signature

---

Lily™ and Lily Design System™ are trademarks.
