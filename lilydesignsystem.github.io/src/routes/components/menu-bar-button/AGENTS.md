# MenuBarButton

## Metadata

- Component: menu-bar-button
- PascalCase: MenuBarButton
- Description: one item in a menu bar
- HTML tag: <button>
- CSS class: .menu-bar-button
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Parent: menu-bar

## Key Behaviors

- Renders as a `<div>` with `role="menuitem"` for ARIA menubar semantics
- Uses `tabindex="-1"` so focus is managed programmatically by the parent MenuBar
- Content is provided through child elements
- Passes through all additional HTML attributes via `...restProps`
- Designed to be placed inside a MenuBar container with `role="menubar"`

## ARIA

- `role="menuitem"` -- identifies this as an item within a menubar
- `tabindex="-1"` -- removed from tab order; focus managed by parent MenuBar

## Keyboard

- Arrow keys: Focus movement is managed by the parent MenuBar
- Enter / Space: Activate the menu item (consumer-provided handler)
- `tabindex="-1"` enables programmatic focus from parent keyboard navigation

## Props

- `children`: slot (required) -- content of the menu bar item
- `...restProps`: Any additional HTML attributes passed to the `<div>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="menu-bar-button"
- [ ] Has role="menuitem"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .menu-bar-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/menu-bar-button.html
- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
