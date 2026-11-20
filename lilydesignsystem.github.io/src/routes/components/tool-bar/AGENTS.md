# ToolBar

## Metadata

- Component: tool-bar
- PascalCase: ToolBar
- Description: a horizontal bar of tool actions
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .tool-bar
- Interactive: yes

## Composition

- Pattern: Bar/BarButton
- Children: tool-bar-button

## Key Behaviors

- Renders as a `<div>` with `role="toolbar"` and built-in keyboard navigation
- Arrow keys (Left/Right) move focus between toolbar items using roving focus
- Home/End keys jump to first/last toolbar item
- Focus wraps around from last item to first and vice versa
- Queries focusable items via `button`, `[role='button']`, and `[tabindex]` selectors
- Uses reactive state for the toolbar element reference and two-way `this` binding for DOM access
- Accessible name is set via `aria-label` from the `label` prop

## ARIA

- `role="toolbar"` -- identifies the container as a toolbar widget
- `aria-label` -- provides the accessible name for the toolbar

## Keyboard

- ArrowRight: Move focus to the next enabled item (wraps to first); ArrowLeft in right-to-left
- ArrowLeft: Move focus to the previous enabled item (wraps to last); ArrowRight in right-to-left
- ArrowDown / ArrowUp: the same, instead of the left and right arrows, with `aria-orientation="vertical"`
- Home: Move focus to first item
- End: Move focus to last item
- Tab: Enter/exit the toolbar; one item at a time is the tab stop, and it follows focus
- A text field, select or textarea inside the toolbar keeps its own arrows, Home and End

## Props

- `label`: string (required) -- accessible name for the toolbar via `aria-label`
- `children`: slot (required) -- toolbar item elements
- `...restProps`: Any additional HTML attributes passed to the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="tool-bar"
- [ ] Has aria-label attribute
- [ ] Has role="toolbar"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .tool-bar in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tool-bar.html
- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
