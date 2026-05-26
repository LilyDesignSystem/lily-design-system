# PaginationNav

## Metadata

- Component: pagination-nav
- PascalCase: PaginationNav
- Description: an ordered list of page navigation links
- HTML tag: <nav>
- CSS class: .pagination-nav
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Children: pagination-list, pagination-list-item

## Key Behaviors

- Renders as a `<nav>` element to create a navigation landmark for pagination controls
- The `label` prop sets `aria-label` to distinguish this navigation region from other `<nav>` elements on the page
- Consumer provides a PaginationList with PaginationListItem children inside the nav
- Spreads `...restProps` onto the `<nav>` element for consumer customization
- No internal state -- purely a structural wrapper providing the navigation landmark

## ARIA

- `<nav aria-label="...">` -- creates a navigation landmark with a descriptive label for the pagination region
- Consumer applies `aria-current="page"` on the link representing the current page

## Keyboard

- Tab: Moves focus between pagination links within the navigation
- Enter: Activates the focused link to navigate to that page

## Props

- `label`: string (required) -- accessible name for the navigation landmark via `aria-label`
- `children`: slot (required) -- PaginationList with page navigation items
- `...restProps`: any -- additional HTML attributes spread onto the `<nav>` element

## Acceptance Criteria

- [ ] Renders <nav> element with class="pagination-nav"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pagination-nav in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/pagination-nav.html
- WAI-ARIA Navigation Role: https://www.w3.org/TR/wai-aria-1.2/#navigation
- WAI-ARIA Practices - Navigation: https://www.w3.org/WAI/ARIA/apg/patterns/navigation/
