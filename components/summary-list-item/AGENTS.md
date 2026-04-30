# SummaryListItem

## Metadata

- Component: summary-list-item
- PascalCase: SummaryListItem
- Description: one key-value pair in a summary list
- HTML tag: <li>
- CSS class: .summary-list-item
- Interactive: no

## Composition

- Pattern: List/ListItem
- Parent: summary-list

## Key Behaviors

- Renders a `<div>` wrapper containing a `<dt>` and `<dd>` element
- The `term` prop provides the key/label text in the `<dt>` element
- The `children` slot provides the value/description content in the `<dd>` element
- The `<div>` wrapper is valid inside `<dl>` per the HTML spec for grouping dt/dd pairs
- The wrapper is transparent to assistive technology
- Spreads `restProps` onto the wrapper `<div>` for consumer customization

## ARIA

- Semantic `<dt>` and `<dd>` elements provide description list semantics
- Screen readers announce term-description pairs naturally
- The `<div>` wrapper is transparent to assistive technology and does not interfere with list semantics

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `term`: string (required) -- the key/label text rendered in the `<dt>` element
- `children`: slot (required) -- the value/description content rendered in the `<dd>` element
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>` element

## Acceptance Criteria

- [ ] Renders <li> element with class="summary-list-item"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .summary-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/summary-list-item.html
- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- MDN dt element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt
- MDN dd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd
- HTML spec div in dl: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
