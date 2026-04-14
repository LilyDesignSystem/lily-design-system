# Summary List Item

SummaryListItem is a single key-value row within a SummaryList. It renders a `<div>` wrapper containing a `<dt>` (term) and `<dd>` (description) pair. The HTML specification permits `<div>` as a direct child of `<dl>` for grouping `<dt>`/`<dd>` pairs, which enables per-row styling and attribute targeting.

Use SummaryListItem inside a SummaryList to present structured key-value information such as order details, account settings, form review data, or any term-description pairs.

## Implementation Notes

- Renders a `<div>` wrapper containing a `<dt>` and `<dd>` element
- The `term` prop provides the key/label text in the `<dt>` element
- The `children` slot provides the value/description content in the `<dd>` element
- The `<div>` wrapper is valid inside `<dl>` per the HTML spec for grouping dt/dd pairs
- The wrapper is transparent to assistive technology
- Spreads `restProps` onto the wrapper `<div>` for consumer customization

## Props

- `term`: string (required) -- the key/label text rendered in the `<dt>` element
- `children`: slot (required) -- the value/description content rendered in the `<dd>` element
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>` element

## Usage

```html
<SummaryList label="Order summary">
  <SummaryListItem term="Product">Widget</SummaryListItem>
  <SummaryListItem term="Quantity">3</SummaryListItem>
  <SummaryListItem term="Total">$29.97</SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

None -- this is a passive informational display, not an interactive element.

## ARIA

- Semantic `<dt>` and `<dd>` elements provide description list semantics
- Screen readers announce term-description pairs naturally
- The `<div>` wrapper is transparent to assistive technology and does not interfere with list semantics

## When to Use

- Use inside a SummaryList to represent one key-value pair with proper description list semantics
- Use with an action link when users need to change their answer, including visually hidden context text for screen readers
- Use when each term-description pair needs individual styling or attribute targeting via the `<div>` wrapper

## When Not to Use

- Do not use outside of a SummaryList `<dl>` container -- it has no standalone meaning as the `<dt>`/`<dd>` elements require a description list parent
- Do not use for table rows -- use TableRow with TableData instead

## Headless

This headless component renders a `<div>` wrapper containing a `<dt>` and `<dd>` element for a single key-value pair. It provides semantic description list item structure that is transparent to assistive technology. The consumer provides all visual styling for the wrapper, term, and description elements.


## Styles

The consumer provides all CSS styling. The component renders with a `.summary-list-item` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<li>` element with class `summary-list-item`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep term labels concise and consistent in width to maintain alignment across rows. Use visual weight (bold or color) to distinguish terms from descriptions.
- **Developers**: Use the `term` prop for the key text and the `children` slot for the value content, which can include rich HTML. Use `restProps` on the wrapper `<div>` for per-row styling hooks.

## Composition

SummaryListItem is designed to be used as a child of SummaryList. The SummaryList provides the outer `<dl>` container, and each SummaryListItem provides one `<div>`-wrapped `<dt>`/`<dd>` pair within it.

## References

- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- MDN dt element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt
- MDN dd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd
- HTML spec div in dl: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
