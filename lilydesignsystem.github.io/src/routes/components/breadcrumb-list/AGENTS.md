# BreadcrumbList

## Metadata

- Component: breadcrumb-list
- PascalCase: BreadcrumbList
- Description: an ordered list of breadcrumb list items
- HTML tag: <ol>
- CSS class: .breadcrumb-list
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: breadcrumb-nav
- Children: breadcrumb-list-item

## Key Behaviors

- Renders as an `<ol>` element to convey the ordered hierarchical relationship of the breadcrumb trail
- Designed to be used inside a BreadcrumbNav, which provides the `<nav>` landmark and `aria-label`
- Consumer places BreadcrumbListItem components as children
- Separator characters (e.g., "/" or ">") between items should be added by the consumer via CSS or text
- Spreads `...restProps` onto the `<ol>` element for consumer customization

## ARIA

- `<ol>` conveys the ordered hierarchical relationship of the breadcrumb trail
- Implicit `list` role from the semantic `<ol>` element
- The parent BreadcrumbNav provides the `<nav>` landmark with `aria-label`

## Keyboard

- Tab: Focus moves between links in the breadcrumb trail
- Enter: Activates the focused breadcrumb link

## Props

- `children`: slot (required) -- BreadcrumbListItem components forming the breadcrumb trail
- `...restProps`: any -- additional HTML attributes spread onto the `<ol>` element

## Acceptance Criteria

- [ ] Renders <ol> element with class="breadcrumb-list"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .breadcrumb-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/breadcrumb-list.html
- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
