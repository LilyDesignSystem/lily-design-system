# SummaryList

A summary list is a component that presents a concise overview of key information as key-value pairs, typically in a structured, easy-to-scan format. It is often used to summarize important details such as transaction history, order details, product features, account settings, or form review data in a description list layout.

This component renders as a semantic `<dl>` (description list) element with an accessible label. Each item in the summary list consists of a `<dt>` (term) and `<dd>` (description) pair, helping users quickly grasp essential information. A well-designed summary list focuses on clarity, using clear labels, concise text, and consistent formatting to enhance readability.

## Implementation Notes

- Renders as `<dl aria-label={label}>` (description list) with a `children` Snippet
- Children typically contain `<dt>` (term) and `<dd>` (description) element pairs
- Semantic `<dl>` element provides description list semantics for key-value pairs
- Uses Svelte 5 `$props()` rune for prop destructuring
- Spreads `...restProps` on the `<dl>` element for consumer extensibility
- No hardcoded user-facing strings; all text comes through props and children

## Props

- `label`: string (required) -- accessible label for the description list via `aria-label`
- `children`: Snippet (required) -- list content, typically `<dt>`/`<dd>` pairs
- `...restProps`: any additional HTML attributes spread onto the `<dl>` element

## Usage

```svelte
<SummaryList label="Order summary">
    <dt>Product</dt><dd>Widget</dd>
    <dt>Quantity</dt><dd>3</dd>
    <dt>Total</dt><dd>$29.97</dd>
</SummaryList>
```

## Keyboard Interactions

None -- this is a passive informational display, not an interactive element.

## ARIA

- `aria-label={label}` -- provides the accessible name for the description list, allowing screen readers to announce the context of the key-value pairs

## References

- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- WAI-ARIA landmark regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
