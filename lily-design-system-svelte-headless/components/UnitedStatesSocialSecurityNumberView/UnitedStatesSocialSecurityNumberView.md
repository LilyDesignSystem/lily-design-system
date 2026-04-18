# UnitedStatesSocialSecurityNumberView

A display component for showing a United States Social Security Number (SSN) in a read-only format. The SSN is a 9-digit identifier issued by the Social Security Administration, used for taxation, credit reporting, and various government and private-sector purposes.

This component renders the SSN as an inline `<span>` element with an accessible label, making it suitable for use in personal records, confirmation screens, account summaries, or any context where an SSN needs to be displayed but not edited. The accessible label ensures screen readers can announce the purpose of the displayed number.

## Implementation Notes

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the SSN value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses Svelte 5 `$props()` for prop destructuring with rest props spread
- No formatting, masking, or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the SSN string to display (e.g., "123-45-6789")
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Usage

```svelte
<UnitedStatesSocialSecurityNumberView label="SSN" value="123-45-6789" />
```

```svelte
<UnitedStatesSocialSecurityNumberView label="Social Security Number" value={ssn} />
```

## Keyboard Interactions

- None -- this is a passive display-only component

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Screen readers announce the label followed by the text content (the number value)

## References

- Social Security Number: https://www.ssa.gov/history/ssn/geocard.html
