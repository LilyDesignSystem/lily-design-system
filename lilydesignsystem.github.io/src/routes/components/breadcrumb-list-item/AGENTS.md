# BreadcrumbListItem

## Metadata

- Component: breadcrumb-list-item
- PascalCase: BreadcrumbListItem
- Description: one breadcrumb list item in the trail
- HTML tag: <li>
- CSS class: .breadcrumb-list-item
- Interactive: no

## Composition

- Pattern: Nav/List/ListItem
- Parent: breadcrumb-list

## Key Behaviors

- Renders as a semantic `<li>` element for use inside a breadcrumb `<nav>` / `<ol>` structure
- Supports `aria-current="page"` via the `current` prop to indicate the active page in the breadcrumb trail
- Content is provided through the children slot, typically an `<a>` link or plain text
- Passes through all additional HTML attributes via `...restProps`
- Uses `slot` for children content

## ARIA

- Implicit `listitem` role from the semantic `<li>` element
- `aria-current="page"` -- set when `current` is true, indicating the user's current location in the breadcrumb trail

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `current`: boolean (default: false) -- whether this item represents the current page in the breadcrumb trail
- `children`: slot (required) -- breadcrumb content, typically a link or text

## Acceptance Criteria

- [ ] Renders <li> element with class="breadcrumb-list-item"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .breadcrumb-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/breadcrumb-list-item.html
- WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
