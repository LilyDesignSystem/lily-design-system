# ContentsListItem

## Metadata

- Component: contents-list-item
- PascalCase: ContentsListItem
- Description: one contents list item
- HTML tag: <li>
- CSS class: .contents-list-item
- Interactive: no

## Composition

- Pattern: Nav/List/ListItem
- Parent: contents-list

## Key Behaviors

- Renders as a semantic `<li>` element for use in contents/navigation lists
- All content is provided through the children slot (typically links)
- Supports nesting by placing a `<ul>` inside a ContentsListItem
- Should be placed inside a `<ul>` or `<ol>` parent element for valid HTML
- Spreads `...restProps` onto the `<li>` element for consumer customization

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- Supports `aria-current="page"` or `aria-current="true"` on the `<li>` for indicating the current page in a navigation context

## Keyboard

- None directly -- keyboard interaction is handled by contained links or the parent list

## Props

- `children`: slot (required) -- list item content, typically a link or nested list
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Acceptance Criteria

- [ ] Renders <li> element with class="contents-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .contents-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/contents-list-item.html
