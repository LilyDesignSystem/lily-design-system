# DoListItem

## Metadata

- Component: do-list-item
- PascalCase: DoListItem
- Description: an encouraged-practice item in a do-list guideline list
- HTML tag: <li>
- CSS class: .do-list-item
- Interactive: no

## Composition

- Pattern: List/ListItem
- Parent: do-list

## Key Behaviors

- Renders as a semantic `<li>` element for use within a DoList `<ul>`
- All content is provided through the children slot
- Spreads `...restProps` onto the `<li>` element for consumer customization
- Should be placed inside a DoList component for valid HTML

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- Inherits list context from the parent DoList `<ul>`

## Keyboard

- None directly -- standard list item with no interactive behavior

## Props

- `children`: slot (required) -- list item content describing a recommended action
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Acceptance Criteria

- [ ] Renders <li> element with class="do-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .do-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/do-list-item.html
- MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
