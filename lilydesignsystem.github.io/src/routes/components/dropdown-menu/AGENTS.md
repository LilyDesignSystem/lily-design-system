# DropdownMenu

## Metadata

- Component: dropdown-menu
- PascalCase: DropdownMenu
- Description: a menu that opens below a trigger button
- HTML tag: <div>
- CSS class: .dropdown-menu
- Interactive: yes

## Key Behaviors

- Renders a wrapper `<div>` containing a `<button>` trigger and a conditionally rendered menu `<div>`
- Supports two-way binding on the `open` prop with the parent
- Uses reactive state to track the `menuRef` DOM reference for querying menu items
- Uses `$effect()` to auto-focus the first `[role="menuitem"]` element when the menu opens
- Menu items are discovered dynamically via `querySelectorAll("[role='menuitem']")`
- ArrowDown/ArrowUp navigation wraps around from last to first and first to last
- Home and End keys jump to first and last menu items respectively
- Escape key closes the menu
- The trigger button displays the `label` text and uses it as `aria-label`
- Spreads `restProps` onto the outer wrapper `<div>`

## ARIA

- `aria-haspopup="true"` -- on the trigger button, indicates it opens a menu
- `aria-expanded="{open}"` -- on the trigger button, communicates whether the menu is currently shown
- `aria-label="{label}"` -- on both the trigger button and the menu, provides an accessible name
- `role="menu"` -- on the menu container, identifies it as a menu widget
- `role="menuitem"` -- expected on each child item provided by the consumer

## Keyboard

- Enter or Space (on button): toggles the menu open/closed
- ArrowDown: moves focus to the next menu item, wraps from last to first
- ArrowUp: moves focus to the previous menu item, wraps from first to last
- Home: moves focus to the first menu item
- End: moves focus to the last menu item
- Escape: closes the menu

## Props

- `label`: string (required) -- accessible name for the menu button, also displayed as button text
- `open`: boolean (default: false) -- whether the menu is visible; bindable
- `children`: slot (required) -- menu items, each should have `role="menuitem"` and `tabindex="-1"`

## Acceptance Criteria

- [ ] Renders <div> element with class="dropdown-menu"
- [ ] Has aria-label attribute
- [ ] Has role="menu"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .dropdown-menu in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/dropdown-menu.html
- WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
- WAI-ARIA menu role: https://www.w3.org/TR/wai-aria-1.2/#menu
- WAI-ARIA menuitem role: https://www.w3.org/TR/wai-aria-1.2/#menuitem
