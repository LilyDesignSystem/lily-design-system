# United Kingdom National Health Service Number View

A display component for showing a United Kingdom National Health Service (NHS) number in a read-only format. The NHS number is a 10-digit identifier that uniquely identifies individuals registered with the National Health Service in England, Wales, and the Isle of Man.

This component renders the NHS number as an inline `<span>` element with an accessible label, making it suitable for use in patient records, summaries, confirmation screens, or any context where an NHS number needs to be displayed but not edited. The accessible label ensures screen readers can announce the purpose of the displayed number.

## Implementation Notes

- Renders as a `<span>` element with `aria-label` for accessible naming
- Displays the NHS number value as inline text content
- Read-only display component (not an input); pairs with an Input component for editing
- Uses props for prop destructuring with rest props spread
- No formatting or validation logic; the consumer provides the value pre-formatted
- No hardcoded strings; all text comes through props for internationalization

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the NHS number string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>` element

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>NHS Number</dt>
    <dd><UnitedKingdomNationalHealthServiceNumberView label="NHS Number" value="123 456 7890" /></dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None -- this is a passive display-only component

## ARIA

- `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Screen readers announce the label followed by the text content (the number value)

## When to Use

- Use to display a UK NHS number in a formatted, read-only view.
- Use in patient banners, summary lists, or medical records to show the NHS number.
- Use in confirmation screens after identifier entry.
- Use when the NHS number needs to be visible but not editable.

## When Not to Use

- Do not use for entering identifiers -- use UnitedKingdomNationalHealthServiceNumberInput instead.
- Do not use for editable display -- combine with Editable.
- Do not use for Northern Ireland H&C numbers -- use NorthernIrelandHealthAndCareNumberView instead.

## Headless

This headless component provides a `<span>` element with `aria-label` for accessible read-only display of an NHS number. The consumer provides the pre-formatted value and all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.united-kingdom-national-health-service-number-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `united-kingdom-national-health-service-number-view`
- Verify aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Display the NHS number in the standard XXX XXX XXXX format with adequate spacing for readability. Consider masking part of the number for privacy in non-clinical contexts.
- **Developers**: Ensure the `value` prop is pre-formatted before passing it to the component, as no formatting logic is built in.

## Composition

UnitedKingdomNationalHealthServiceNumberView is the read-only display counterpart to UnitedKingdomNationalHealthServiceNumberInput, following the Input/View pattern. Use the View for display and the Input for data entry.

## References

- NHS Number: https://www.nhs.uk/using-the-nhs/about-the-nhs/what-is-an-nhs-number/
