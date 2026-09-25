# PilipinasPhilhealthIdentificationNumberView

## Metadata

- Component: pilipinas-philhealth-identification-number-view
- PascalCase: PilipinasPhilhealthIdentificationNumberView
- Description: a read-only display of the Philippines's PhilHealth Identification Number (PIN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .pilipinas-philhealth-identification-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `pilipinas-philhealth-identification-number-view`
- Format: Twelve-digit number assigned by the Philippine Health Insurance Corporation (PhilHealth) to every enrolled member, commonly displayed grouped as NN-NNNNNNNNN-N. No published check-digit algorithm; correctness is confirmed against PhilHealth's own membership records.
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible name via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="pilipinas-philhealth-identification-number-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pilipinas-philhealth-identification-number-view in css-style-sheet-template.css
- Companion: PilipinasPhilhealthIdentificationNumberInput
- Wikipedia: [PhilHealth](https://en.wikipedia.org/wiki/PhilHealth)
