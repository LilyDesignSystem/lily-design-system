# UnitedKingdomNationalHealthServiceNumberView

A display component for showing a United Kingdom National Health Service (NHS) number in a read-only format. The NHS number is a 10-digit identifier that uniquely identifies individuals registered with the National Health Service in England, Wales, and the Isle of Man.

This component renders the NHS number as an inline `<span>` element with an accessible label, making it suitable for use in patient records, summaries, confirmation screens, or any context where an NHS number needs to be displayed but not edited. The accessible label ensures screen readers can announce the purpose of the displayed number.

## Implementation Notes

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the NHS number value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses Svelte 5 `$props()` for prop destructuring with rest props spread
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the NHS number string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Usage

```svelte
<UnitedKingdomNationalHealthServiceNumberView label="NHS Number" value="123 456 7890" />
```

```svelte
<UnitedKingdomNationalHealthServiceNumberView label="Patient NHS Number" value={nhsNumber} />
```

## Keyboard Interactions

- None -- this is a passive display-only component

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Screen readers announce the label followed by the text content (the number value)

## References

- NHS Number: https://www.nhs.uk/using-the-nhs/about-the-nhs/what-is-an-nhs-number/
