# SummaryListItem

## Metadata

- Component: summary-list-item
- PascalCase: SummaryListItem
- Description: one key-value pair in a summary list
- Purpose: Holds one name and value row of a summary list, with its actions.
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
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

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). Tests: `lily-design-system-swift/Tests/LilyUITests`, `lily-design-system-kotlin/lily-compose/src/test`.

- Apple: `SummaryListItem(term:value:)` in `LilyUI`: term and value combined into one VoiceOver element; the plain style stacks them so nothing truncates at the largest Dynamic Type sizes. Style: `SummaryListItemStyle`.
- Android: `SummaryListItem(term) { value }` in `lily-compose`: merged into one TalkBack stop (`mergeDescendants`).

## Acceptance Criteria

- [ ] Renders <div> element with class="summary-list-item"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .summary-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/summary-list-item.html
- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- MDN dt element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt
- MDN dd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd
- HTML spec div in dl: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
