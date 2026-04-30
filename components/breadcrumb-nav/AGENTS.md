# BreadcrumbNav

## Metadata

- Component: breadcrumb-nav
- PascalCase: BreadcrumbNav
- Description: a navigation container for breadcrumb trail links
- HTML tag: <nav>
- CSS class: .breadcrumb-nav
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Children: breadcrumb-list, breadcrumb-list-item

## Key Behaviors

- Renders a `<nav>` element for the navigation landmark
- Contains an `<ol>` to convey the ordered hierarchical relationship of the breadcrumb trail
- `aria-label` on the `<nav>` provides an accessible name (e.g. "Breadcrumb")
- Consumer places BreadcrumbListItem components as children
- Separator characters (e.g. "/" or ">") between items should be added by the consumer via CSS or text
- The final item typically uses the `current` prop and contains plain text instead of a link
- Spreads `restProps` onto the `<nav>` for consumer customization

## ARIA

- `<nav>` with `aria-label` creates a navigation landmark for the breadcrumb trail
- `<ol>` conveys the ordered hierarchical relationship of the trail
- `aria-current="page"` on the BreadcrumbListItem for the current page
- Implicit `listitem` role from semantic `<li>` elements

## Keyboard

- Tab: Focus moves between links in the breadcrumb trail
- Enter: Activates the focused breadcrumb link

## Props

- `label`: string (required) -- accessible name for the navigation landmark
- `children`: slot (required) -- BreadcrumbListItem components
- `...restProps`: unknown -- additional attributes spread onto the `<nav>` element

## Acceptance Criteria

- [ ] Renders <nav> element with class="breadcrumb-nav"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .breadcrumb-nav in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/breadcrumb-nav.html
- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
