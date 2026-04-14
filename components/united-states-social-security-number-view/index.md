# United States Social Security Number View

A display component for showing a United States Social Security Number (SSN) in a read-only format. The SSN is a 9-digit identifier issued by the Social Security Administration, used for taxation, credit reporting, and various government and private-sector purposes.

This component renders the SSN as an inline `<span>` element with an accessible label, making it suitable for use in personal records, confirmation screens, account summaries, or any context where an SSN needs to be displayed but not edited. The accessible label ensures screen readers can announce the purpose of the displayed number.

## Implementation Notes

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the SSN value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses props for prop destructuring with rest props spread
- No formatting, masking, or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the SSN string to display (e.g., "123-45-6789")
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>Social Security Number</dt>
    <dd><UnitedStatesSocialSecurityNumberView label="SSN" value="123-45-6789" /></dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None -- this is a passive display-only component

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Screen readers announce the label followed by the text content (the number value)

## When to Use

- Use to display a US Social Security Number in a formatted, read-only view.
- Use in personal records, confirmation screens, or account summaries to show the SSN.
- Use when the SSN needs to be visible but not editable.

## When Not to Use

- Do not use for entering identifiers -- use UnitedStatesSocialSecurityNumberInput instead.
- Do not use for editable display -- combine with Editable.
- Do not use for other national identifiers -- use the corresponding country-specific view component.

## Headless

This headless component provides a `<span>` element with `aria-label` for accessible read-only display of a Social Security Number. The consumer provides the pre-formatted value and all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.united-states-social-security-number-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `united-states-social-security-number-view`
- Verify aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Consider partially masking the SSN (e.g., "***-**-6789") for privacy in non-secure contexts. Display the number with clear hyphen separators for readability.
- **Developers**: Ensure the `value` prop is pre-formatted before passing it to the component, as no formatting or masking logic is built in. Handle sensitive data carefully on the client side.

## Composition

UnitedStatesSocialSecurityNumberView is the read-only display counterpart to UnitedStatesSocialSecurityNumberInput, following the Input/View pattern. Use the View for display and the Input for data entry.

## References

- Social Security Number: https://www.ssa.gov/history/ssn/geocard.html
