# SignaturePad

## Metadata

- Component: signature-pad
- PascalCase: SignaturePad
- Description: a drawing area for capturing a handwritten signature
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .signature-pad
- Interactive: yes (the typed-name field)

## Key Behaviors

- Renders a `<div role="group">` named by `aria-label`; not `role="application"` (changed 2026-11-17, tasks.md P31-T5)
- `attestation` is shown first and is the group's `aria-describedby`
- Consumers provide the drawing surface (canvas, SVG, etc.) as children
- `typedNameLabel` adds a labelled `<input type="text" autocomplete="name">`, so drawing is never the only way to sign (WCAG 2.1.1)
- `outcome` (signed, declined, unable, verbal, on-paper, pending, revoked) is `data-outcome`; `outcomeLabel` is its words, required with it
- Spreads `restProps` onto the container for consumer customization

## ARIA

- `role="group"` with `aria-label` -- names the whole signature
- `aria-describedby` -- the attestation
- The typed-name field is a native `<input>` with a `<label for>`

## Keyboard

- Tab moves to the typed-name field; the consumer's drawing surface handles its own keys

## Props

- `label`: string (required) -- the group's accessible name via `aria-label`
- `attestation`: string (optional) -- what the signer confirms; shown first and the group's description
- `typedNameLabel`: string (optional) -- adds the typed-name field with this label
- `typedName`: string (optional, bindable) -- the typed name
- `name`: string (optional) -- the typed-name field's form name
- `outcome`: "signed" | "declined" | "unable" | "verbal" | "on-paper" | "pending" | "revoked" (optional) -- `data-outcome`
- `outcomeLabel`: string -- the outcome in the consumer's words; required with `outcome`
- `children`: slot (optional) -- drawing surface (canvas, SVG, or other input mechanism)

## Acceptance Criteria

- [x] Renders `<div class="signature-pad" role="group">` with `aria-label`
- [x] The attestation is the group's description
- [x] A signature can be completed by keyboard alone (typed name)
- [x] An outcome other than signed is shown in words, with `data-outcome`
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .signature-pad in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/signature-pad.html
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
- WCAG 2.1.1 Keyboard: https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html
