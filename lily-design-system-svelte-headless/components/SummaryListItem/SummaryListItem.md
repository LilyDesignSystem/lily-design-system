# SummaryListItem

SummaryListItem is a single key-value row within a SummaryList. It renders a `<div>` wrapper containing a `<dt>` (term) and `<dd>` (description) pair. The HTML specification permits `<div>` as a direct child of `<dl>` for grouping `<dt>`/`<dd>` pairs, which enables per-row styling and attribute targeting.

Use SummaryListItem inside a SummaryList to present structured key-value information such as order details, account settings, form review data, or any term-description pairs.

## Implementation Notes

- Renders a `<div>` wrapper containing a `<dt>` and `<dd>` element
- The `term` prop provides the key/label text in the `<dt>` element
- The `children` snippet provides the value/description content in the `<dd>` element
- The `<div>` wrapper is valid inside `<dl>` per the HTML spec for grouping dt/dd pairs
- The wrapper is transparent to assistive technology
- Spreads `restProps` onto the wrapper `<div>` for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing

## Props

- `term`: string (required) -- the key/label text rendered in the `<dt>` element
- `children`: Snippet (required) -- the value/description content rendered in the `<dd>` element
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>` element

## Usage

```svelte
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

## References

- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- MDN dt element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt
- MDN dd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd
- HTML spec div in dl: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
