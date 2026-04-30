# DontList

## Metadata

- Component: dont-list
- PascalCase: DontList
- Description: a guideline list of discouraged dont-list-item components
- HTML tag: <ol>
- CSS class: .dont-list
- Interactive: no

## Composition

- Pattern: List/ListItem
- Children: dont-list-item

## Key Behaviors

- Renders a `<ul>` element with explicit `role="list"` to preserve list semantics
- Uses `aria-label` to provide an accessible name (defaults to "Don't")
- Children slot is rendered inside the list; each child should be an `<li>` element
- Label prop has a sensible default but can be overridden for internationalization
- Spreads `restProps` on the `<ul>` element

## ARIA

- `role="list"` -- explicitly declares list semantics on the `<ul>`, ensuring assistive technology announces it as a list
- `aria-label={label}` -- provides an accessible name for the list (defaults to "Don't")

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (default: `"Don't"`) -- accessible name for the list
- `children`: slot (required) -- list items, each should be an `<li>` element
- `...restProps`: any additional HTML attributes spread onto the `<ul>` element

## Acceptance Criteria

- [ ] Renders <ol> element with class="dont-list"
- [ ] Has aria-label attribute
- [ ] Has role="list"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .dont-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/dont-list.html
- MDN ul element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul
- WAI list role: https://www.w3.org/WAI/ARIA/apd/roles/list/
