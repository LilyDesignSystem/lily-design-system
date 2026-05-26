# PaginationListItem

## Metadata

- Component: pagination-list-item
- PascalCase: PaginationListItem
- Description: one pagination list item in the trail
- HTML tag: <li>
- CSS class: .pagination-list-item
- Interactive: no

## Composition

- Pattern: Nav/List/ListItem
- Parent: pagination-list

## Key Behaviors

- Renders as a semantic `<li>` element for use inside a PaginationList `<ul>` / `<nav>` structure
- Content is provided through the children slot, typically a link or button for a page number
- Passes through all additional HTML attributes via `...restProps`
- Uses `slot` for children content

## ARIA

- Implicit `listitem` role from the semantic `<li>` element
- Consumer should set `aria-current="page"` on the active page link within the item

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- item content, typically a link (e.g., `<a href="/page/2">2</a>`) or button

## Acceptance Criteria

- [ ] Renders <li> element with class="pagination-list-item"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pagination-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/pagination-list-item.html
