# MenuBar

## Metadata

- Component: menu-bar
- PascalCase: MenuBar
- Description: a horizontal bar of menu triggers
- HTML tag: <div>
- CSS class: .menu-bar
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Children: menu-bar-button

## Key Behaviors

- Renders a `<div>` with `role="menubar"` and an accessible label.
- Uses reactive state to track the `barRef` element reference for querying child items.
- Keyboard navigation queries all child elements with `[role='menuitem']` to build the navigable item list.
- Uses ArrowLeft/ArrowRight (horizontal) instead of ArrowUp/ArrowDown (vertical) to match the horizontal orientation.
- Arrow keys wrap around: pressing ArrowRight on the last item moves focus to the first, and vice versa.
- Home and End keys jump to the first and last menu bar item respectively.
- Spreads `restProps` onto the container for consumer customization.
- This is a compound component -- pair with MenuBarItem for individual menu bar entries.

## ARIA

- `role="menubar"` -- identifies the container as a horizontal menu bar widget.
- `aria-label` -- provides an accessible name describing the purpose of the menu bar.
- Child elements should use `role="menuitem"` with `tabindex="-1"` for focusable menu bar items.

## Keyboard

- ArrowRight: Moves focus to the next menu bar item, wrapping to the first item from the last.
- ArrowLeft: Moves focus to the previous menu bar item, wrapping to the last item from the first.
- Home: Moves focus to the first menu bar item.
- End: Moves focus to the last menu bar item.

## Props

- `label`: string (required) -- accessible name applied via `aria-label`.
- `children`: slot (required) -- menu bar item elements to render (should have `role="menuitem"` and `tabindex="-1"`).
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Acceptance Criteria

- [ ] Renders <div> element with class="menu-bar"
- [ ] Has aria-label attribute
- [ ] Has role="menubar"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .menu-bar in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/menu-bar.html
- WAI-ARIA Menu Bar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
