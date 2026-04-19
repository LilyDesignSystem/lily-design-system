# Menu

## Metadata

- Component: menu
- PascalCase: Menu
- Description: a list of actions or options triggered by a button
- HTML tag: <div>
- CSS class: .menu
- Interactive: yes

## Composition

- Pattern: Menu/MenuItem
- Children: menu-item

## Key Behaviors

- Renders a `<div>` with `role="menu"` and an accessible label.
- Uses reactive state to track the `menuRef` element reference for querying child items.
- Keyboard navigation queries all child elements with `[role='menuitem']` to build the navigable item list.
- Arrow keys wrap around: pressing ArrowDown on the last item moves focus to the first, and vice versa.
- Home and End keys jump to the first and last menu item respectively.
- Spreads `restProps` onto the container for consumer customization.
- This is a compound component -- pair with MenuItem for individual menu actions.

## ARIA

- `role="menu"` -- identifies the container as a menu widget for presenting a list of actions.
- `aria-label` -- provides an accessible name describing the purpose of the menu.
- Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu items.

## Keyboard

- ArrowDown: Moves focus to the next menu item, wrapping to the first item from the last.
- ArrowUp: Moves focus to the previous menu item, wrapping to the last item from the first.
- Home: Moves focus to the first menu item.
- End: Moves focus to the last menu item.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `children`: slot (required) -- menu item elements to render inside the menu (should have `role="menuitem"` and `tabindex="-1"`).
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Acceptance Criteria

- [ ] Renders <div> element with class="menu"
- [ ] Has aria-label attribute
- [ ] Has role="menu"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .menu in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/menu.html
- WAI-ARIA Menu Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu/
