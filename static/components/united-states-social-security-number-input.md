# United States Social Security Number Input

A United States Social Security Number (SSN) input is a specialized form field
for entering a 9-digit SSN issued by the Social Security Administration. The SSN
is used as a national identifier for taxation, credit reporting, and various
government and private-sector purposes.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

The standard display format is "XXX-XX-XXXX" (three groups of digits separated
by hyphens: a 3-digit area number, a 2-digit group number, and a 4-digit serial
number). This input component enforces that pattern, uses a numeric keyboard
hint for mobile devices, and disables autocomplete to protect sensitive
personally identifiable information. The component supports required and disabled
states, and provides accessible labeling for screen readers.

## Implementation Notes

- Renders as `<input type="text">` with pattern validation for SSN format
- Pattern: `[0-9]{3}-[0-9]{2}-[0-9]{4}` (XXX-XX-XXXX)
- `inputmode="numeric"` for numeric keyboard on mobile
- `autocomplete="off"` to protect sensitive PII
- Supports two-way binding
- Pattern is defined as a constant for validation

## Props

- `label`: string (required) -- accessible label via aria-label
- `value`: string (default: "") -- bindable input value
- `required`: boolean (default: false) -- form validation
- `disabled`: boolean (default: false) -- disabled state
- `...restProps`: Any additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field
  label="Social Security Number"
  required
>
  <UnitedStatesSocialSecurityNumberInput
    label="SSN"
    value="{ssn}"
    required
  />
  <Hint>Format: XXX-XX-XXXX</Hint>
  <ErrorMessage>Please enter a valid Social Security Number</ErrorMessage>
</Field>
```

## Keyboard Interactions

- Standard text input keyboard behavior
- Users type digits and hyphens in the format XXX-XX-XXXX

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology
- `inputmode="numeric"` hints mobile assistive technology to present a numeric keyboard

## When to Use

- Use in forms to collect a US Social Security Number in the standard XXX-XX-XXXX format.
- Use with validation for the 9-digit SSN format.
- Use in tax forms, government applications, financial services, or any system that processes SSNs.
- Use when pattern validation, numeric keyboard hints, and disabled autocomplete are needed for SSN security.

## When Not to Use

- Do not use for displaying read-only identifiers -- use UnitedStatesSocialSecurityNumberView instead.
- Do not use for general text input -- use TextInput instead.
- Do not use for other national identifiers -- use the corresponding country-specific input component.

## Headless

This headless component provides an `<input type="text">` with SSN pattern validation, `inputmode="numeric"`, `autocomplete="off"`, `aria-label`, and support for `required`/`disabled` states. The consumer provides all visual styling, surrounding labels, hints, and error messages.

## Styles

The consumer provides all CSS styling. The component renders with a `.united-states-social-security-number-input` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<input>` element with class `united-states-social-security-number-input`
- Verify aria-label` provides accessible name from label prop
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display a format hint (e.g., "XXX-XX-XXXX") near the input and consider a password-style masking option for privacy. Use clear error messaging for invalid formats.
- **Developers**: The component enforces the pattern `[0-9]{3}-[0-9]{2}-[0-9]{4}` on form submission. Consider adding a masking toggle for sensitive display and server-side validation for the SSN format.

## Composition

UnitedStatesSocialSecurityNumberInput is the editable input counterpart to UnitedStatesSocialSecurityNumberView, following the Input/View pattern. Use the Input for data entry and the View for read-only display.

## Domain Knowledge

Nine-digit number in XXX-XX-XXXX format issued by the Social Security Administration since 1936 to track workers' earnings; randomised since 2011. Now a de facto national identifier in the United States. No check-digit or checksum algorithm is published for this identifier; correctness is confirmed by the issuing authority's own records, not by the format alone.

**Where to find it:** Social Security card, W-2 forms, tax returns (IRS Form 1040), payslips, and the SSA "my Social Security" portal.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The input renders `autocomplete="off"`, so the browser neither saves nor offers the value, and `spellcheck="false"`, so an enhanced spellchecker does not send it to a cloud service. `bin/check-identifier-inputs` keeps both in all nine catalogs.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker; mask it there if it must appear.
- The component stores nothing. Do not keep the value in `localStorage`, `sessionStorage` or a cookie; submit it in the body of a POST over HTTPS.
- A format or checksum check proves the number is well formed, not that it belongs to the person entering it.
- The page decides who may see it: the input does not mask what is typed. Use the matching `-view` to show it back, masked as the service requires.

## Related components

- `united-states-social-security-number-view` — a read-only display of a US Social Security number
- `text-input` — a single-line text input field <input type="text">

## References

- Social Security Number format: https://www.ssa.gov/employer/randomization.html

---

Lily™ and Lily Design System™ are trademarks.
