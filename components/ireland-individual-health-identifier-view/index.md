# Ireland Individual Health Identifier View

IrelandIndividualHealthIdentifierView is a read-only display of an Ireland Individual Health Identifier (IHI), the unique national healthcare identifier used by the Health Service Executive (HSE) to match patients with their medical records. It renders the value as inline text inside a `<span>` with `aria-label` for accessibility. It is the display-only companion to IrelandIndividualHealthIdentifierInput.

## Implementation Notes

- Renders a `<span>` with `aria-label`
- Displays the value as text content
- No formatting or validation; consumer provides the value pre-formatted
- Companion to IrelandIndividualHealthIdentifierInput for the Input/View pattern

## Props

- `label`: string (required) -- accessible label via `aria-label`
- `value`: string (default: "") -- the IHI string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>Individual Health Identifier</dt>
    <dd><IrelandIndividualHealthIdentifierView label="IHI" value="1234567890" /></dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None (passive display-only component)

## ARIA

- `aria-label={label}` -- provides accessible name for the displayed identifier

## When to Use

- Use to display an Ireland Individual Health Identifier (IHI) in a formatted, read-only view.
- Use in patient banners, summary lists, or medical records to show the IHI.
- Use in confirmation screens after identifier entry.

## When Not to Use

- Do not use for entering identifiers -- use IrelandIndividualHealthIdentifierInput instead.
- Do not use for editable display -- combine with Editable.
- Do not use for other national identifiers -- use the corresponding country-specific view component.

## Headless

This headless component provides a `<span>` with `aria-label`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.ireland-individual-health-identifier-view` class for targeting.

## Testing

- Verify renders a `<span>` with the correct class
- Verify `aria-label` is set from the label prop
- Verify value is displayed as text content

## Domain Knowledge

The Ireland Individual Health Identifier (IHI) is a 10-digit clinical identifier used by healthcare providers to safely match patients with their medical records across different hospitals and GPs. Unlike the Ireland Personal Public Service Number (PPSN), the IHI contains no personal information (like birth date) and is not used for social welfare or taxes. Most patients do not need to know their IHI to access care; it is primarily used behind the scenes by the Health Service Executive (HSE).

## References

- HSE: https://www.hse.ie/
