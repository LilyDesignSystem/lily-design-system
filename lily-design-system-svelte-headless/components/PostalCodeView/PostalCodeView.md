# PostalCodeView

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

```svelte
<PostalCodeView text="90210" />
```

```svelte
<PostalCodeView text="SW1A 1AA" />
```

```svelte
<p>Your postal code: <PostalCodeView text={postalCode} /></p>
```

## Keyboard Interactions

None -- this component is a passive display element with no interactive behavior.

## ARIA

No ARIA attributes are needed. The `<span>` renders inline text content that is natively accessible to screen readers.

## References

- MDN span element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
