# SummaryList

## Metadata

- Component: summary-list
- PascalCase: SummaryList
- Description: an ordered list of key-value summary pairs
- HTML tag: <ol>
- CSS class: .summary-list
- Interactive: no

## Composition

- Pattern: List/ListItem
- Children: summary-list-item

## Key Behaviors

- Renders as `<dl aria-label={label}>` (description list) with a `children` slot
- Children typically contain `<dt>` (term) and `<dd>` (description) element pairs
- Semantic `<dl>` element provides description list semantics for key-value pairs
- Uses props rune for prop destructuring
- Spreads `...restProps` on the `<dl>` element for consumer extensibility
- No hardcoded user-facing strings; all text comes through props and children

## ARIA

- `aria-label={label}` -- provides the accessible name for the description list, allowing screen readers to announce the context of the key-value pairs

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible label for the description list via `aria-label`
- `children`: slot (required) -- list content, typically `<dt>`/`<dd>` pairs
- `...restProps`: any additional HTML attributes spread onto the `<dl>` element

## Acceptance Criteria

- [ ] Renders <ol> element with class="summary-list"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .summary-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/summary-list.html
- MDN dl element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl
- WAI-ARIA landmark regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
