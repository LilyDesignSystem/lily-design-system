# DontListItem

## Metadata

- Component: dont-list-item
- PascalCase: DontListItem
- Description: a discouraged-practice item in a dont-list guideline list
- HTML tag: <li>
- CSS class: .dont-list-item
- Interactive: no

## Composition

- Pattern: List/ListItem
- Parent: dont-list

## Key Behaviors

- Renders as a semantic `<li>` element for use within a DontList `<ul>`
- All content is provided through the children slot
- Spreads `...restProps` onto the `<li>` element for consumer customization
- Should be placed inside a DontList component for valid HTML

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- Inherits list context from the parent DontList `<ul>`

## Keyboard

- None directly -- standard list item with no interactive behavior

## Props

- `children`: slot (required) -- list item content describing a discouraged action
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Acceptance Criteria

- [ ] Renders <li> element with class="dont-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .dont-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/dont-list-item.html
- MDN li element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li
