# AustraliaTaxFileNumberView

## Metadata

- Component: australia-tax-file-number-view
- PascalCase: AustraliaTaxFileNumberView
- Description: a read-only display of Australia's Tax File Number (TFN)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .australia-tax-file-number-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `australia-tax-file-number-view`
- Format: Nine digits, written 123 456 782 (older numbers have eight). The digits are multiplied by the weights 1,4,3,7,5,8,6,9,10 and summed, and the sum must be a multiple of 11.
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

- [x] Renders <span> element with class="australia-tax-file-number-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .australia-tax-file-number-view in css-style-sheet-template.css
- Companion: AustraliaTaxFileNumberInput
- Wikipedia: [Tax file number](https://en.wikipedia.org/wiki/Tax_file_number)
