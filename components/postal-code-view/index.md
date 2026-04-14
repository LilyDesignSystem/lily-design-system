# Postal Code View

A postal code view displays a postal or ZIP code as read-only text within a `<span>` element. It is used to present postal code information in address displays, confirmation pages, shipping summaries, or any context where the value is not editable.

This component pairs with PostalCodeInput to form an Input/View pattern: PostalCodeInput handles data entry while PostalCodeView handles display. The simple span-based rendering allows consumers to apply any formatting or styling needed.

## Implementation Notes

- Renders a `<span>` element containing the postal code text
- Text content is provided via the `text` prop (not via children)
- Defaults to an empty string if no text is provided
- Spreads `restProps` on the `<span>` for consumer customization (e.g., `class`, `data-*` attributes)
- No ARIA attributes needed; the text content is directly readable by assistive technology

## Props

- `text`: string (default: `""`) -- the postal code string to display
- `...restProps`: any additional HTML attributes spread onto the `<span>` element

## Usage

US ZIP code display:

```html
<PostalCodeView text="90210" />
```

UK postcode display:

```html
<PostalCodeView text="SW1A 1AA" />
```

Postal code inline in an address summary:

```html
<p>Your postal code: <PostalCodeView text={postalCode} /></p>
```

Address confirmation with postal code view:

```html
<SummaryList>
  <SummaryListItem>
    <dt>Street</dt>
    <dd>10 Downing Street</dd>
  </SummaryListItem>
  <SummaryListItem>
    <dt>City</dt>
    <dd>London</dd>
  </SummaryListItem>
  <SummaryListItem>
    <dt>Postcode</dt>
    <dd><PostalCodeView text="SW1A 2AA" /></dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

None -- this component is a passive display element with no interactive behavior.

## ARIA

No ARIA attributes are needed. The `<span>` renders inline text content that is natively accessible to screen readers.

## When to Use

- Use to display a postal or ZIP code in read-only contexts such as address summaries, confirmation pages, and shipping details.
- Use when the postal code should be visible but not editable.
- Use in order confirmations, delivery tracking pages, or patient address displays.

## When Not to Use

- Do not use when the user needs to edit the postal code -- use PostalCodeInput instead.
- Do not use for general text display -- use a plain `<span>` element instead.

## Headless

The PostalCodeView headless component provides a `<span>` element that renders postal code text content. It requires no ARIA attributes since inline text is natively accessible. The consumer provides all visual styling, formatting, and layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.postal-code-view` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `postal-code-view`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the postal code is visually distinct within address blocks, using consistent typography and spacing with surrounding address fields.
- **Developers**: Format the postal code text appropriately for the target locale before passing it to the `text` prop (e.g., adding spaces in UK postcodes).

## Composition

PostalCodeView is the read-only counterpart of PostalCodeInput. Use PostalCodeInput for data entry and PostalCodeView for displaying the saved postal code value.

## References

- MDN span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
