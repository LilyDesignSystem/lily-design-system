# ContextMenuItem

## Metadata

- Component: context-menu-item
- PascalCase: ContextMenuItem
- Description: one item in a context menu
- HTML tag: <div>
- CSS class: .context-menu-item
- Interactive: yes

## Composition

- Pattern: Menu/MenuItem
- Parent: context-menu

## Key Behaviors

- Renders as `<div role="menuitem" tabindex="-1">` for context menu items
- `tabindex="-1"` supports roving focus managed by the parent menu
- Should be placed inside a `role="menu"` container
- Focus management (ArrowUp/ArrowDown) is handled by the parent menu component
- All additional HTML attributes are spread onto the div via `restProps`

## ARIA

- `role="menuitem"` -- identifies this element as an item within a menu
- `tabindex="-1"` -- supports roving focus management by the parent menu
- Supports `aria-disabled` for disabled state (added by consumer)
- Supports `aria-keyshortcuts` for keyboard shortcut hints (added by consumer)

## Keyboard

- Focus is managed by the parent menu using ArrowUp/ArrowDown
- Enter or Space activates the menu item (handled by consumer event listeners)

## Props

- `children`: slot (required) -- menu item content (text, icon, shortcut hint, etc.)
- `...restProps`: any -- additional HTML attributes spread onto the div

## Acceptance Criteria

- [ ] Renders <div> element with class="context-menu-item"
- [ ] Has role="menuitem"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .context-menu-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/context-menu-item.html
- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
