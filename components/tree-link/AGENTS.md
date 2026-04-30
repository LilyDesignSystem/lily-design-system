# TreeLink

## Metadata

- Component: tree-link
- PascalCase: TreeLink
- Description: one link in the tree
- HTML tag: <a>
- CSS class: .tree-link
- Interactive: yes

## Composition

- Pattern: Nav/List/ListItem
- Parent: tree-list-item

## Key Behaviors

- Renders as a semantic `<a>` element for tree navigation
- Designed to be used inside a TreeListItem
- Supports an optional `aria-label` override for more descriptive screen reader text
- All link text is provided through the children slot
- Spreads `...restProps` onto the `<a>` element

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop

## Keyboard

- Tab: Focus the link
- Enter: Activate the link (browser default)

## Props

- `href`: string (required) -- the URL to navigate to
- `label`: string (optional, default: undefined) -- accessible label override via `aria-label`
- `children`: slot (required) -- the link text/content
- `...restProps`: Any additional HTML attributes spread onto the `<a>`

## Acceptance Criteria

- [ ] Renders <a> element with class="tree-link"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tree-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tree-link.html
- WAI-ARIA Tree View Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
