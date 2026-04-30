# MenuItem

## Metadata

- Component: menu-item
- PascalCase: MenuItem
- Description: one item in a menu
- HTML tag: <div>
- CSS class: .menu-item
- Interactive: yes

## Composition

- Pattern: Menu/MenuItem
- Parent: menu

## Key Behaviors

- Renders as `<div role="menuitem" tabindex="-1">` for menu items
- `tabindex="-1"` supports roving focus managed by the parent menu
- Should be placed inside a `role="menu"` or `role="menubar"` container
- Focus management (ArrowUp/ArrowDown) is handled by the parent menu component
- All content provided through children slot; no hardcoded strings

## ARIA

- `role="menuitem"` identifies this as a menu item
- `tabindex="-1"` for roving focus management
- Supports `aria-disabled` for disabled state
- Supports `aria-haspopup` for submenu triggers
- Supports `aria-expanded` for items with open/closed submenus

## Keyboard

- Focus is managed by the parent menu using ArrowUp/ArrowDown
- Enter or Space activates the menu item (handled by consumer event listeners)
- Home/End move focus to the first/last item (handled by the parent menu)

## Props

- `children`: slot -- menu item content
- `...restProps`: Any additional HTML attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="menu-item"
- [ ] Has role="menuitem"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .menu-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/menu-item.html
- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
- WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem
