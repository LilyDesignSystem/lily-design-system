# IbanView

## Metadata

- Component: iban-view
- PascalCase: IbanView
- Description: a read-only display of an International Bank Account Number (IBAN)
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .iban-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `iban-view` and `role="text"`
- Format: up to 34 letters and digits: a two-letter country code, two check digits, then the national account number (ISO 13616)
- Read-only; not editable

## ARIA

- `aria-label` provides accessible name from label prop
- `role="text"` so the identifier announces as a single unit

## Keyboard

- Not interactive

## Props

- `value`: string (required) — the identifier to display
- `label`: string (optional) — accessible name override via `aria-label`
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <span> element with class="iban-view" and role="text"
- [ ] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .iban-view in css-style-sheet-template.css
- Companion: IbanInput
- Wikipedia: https://en.wikipedia.org/wiki/International_Bank_Account_Number
