# PaginationList

## Metadata

- Component: pagination-list
- PascalCase: PaginationList
- Description: an ordered list of pagination list items
- HTML tag: <ol>
- CSS class: .pagination-list
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: pagination-nav
- Children: pagination-list-item

## Key Behaviors

- Renders a `<nav>` element wrapping a `<ul>` list
- The `<nav>` element uses `aria-label` for identification by assistive technology
- The `label` prop is required to distinguish this navigation from other `<nav>` elements on the page
- Consumer provides `<li>` children containing page links or buttons
- Rest props are spread onto the `<nav>` element
- This is a compound component; see PaginationListItem for individual page items

## ARIA

- `<nav aria-label="...">` -- identifies the pagination as a navigation landmark with a descriptive label
- `aria-current="page"` -- consumer applies this to the link representing the current page

## Keyboard

- Tab: Moves focus between pagination links/buttons in the list
- Enter: Activates the focused link or button to navigate to that page

## Props

- `label`: string (required) -- accessible name for the pagination navigation region via `aria-label`
- `children`: slot (required) -- pagination list items, typically `<li>` elements containing links or buttons
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element

## Acceptance Criteria

- [ ] Renders <ol> element with class="pagination-list"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pagination-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/pagination-list.html
- WAI-ARIA Practices - Pagination: https://www.w3.org/WAI/ARIA/apg/patterns/navigation/
- WAI-ARIA navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
