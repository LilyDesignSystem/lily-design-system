# ActionGroup

## Metadata

- Component: action-group
- PascalCase: ActionGroup
- Description: a group of action buttons that can collapse to an overflow menu when space is constrained
- HTML tag: <div> with role="group"
- CSS class: .action-group
- Interactive: yes (when overflow is used)

## Key Behaviors

- Renders a <div role="group"> with required aria-label
- Renders visible action buttons as children
- Renders an overflow trigger only when the `overflow` slot/prop is provided
- Overflow trigger has aria-haspopup="menu" and aria-expanded reflecting `overflowOpen`
- Overflow panel is hidden via the `hidden` attribute when `overflowOpen` is false
- Calls `onOverflowToggle` when the overflow trigger is activated

## ARIA

- `role="group"` on the container
- `aria-label` is the accessible name (required)
- Overflow trigger: `aria-haspopup="menu"`, `aria-expanded`, optional `aria-label` via `overflowLabel`
- Overflow panel uses the `hidden` attribute when closed

## Keyboard

- Tab: Move focus into and out of the group
- Arrow keys: (Consumer-provided) recommended roving tabindex among buttons
- Enter / Space: Activate focused button or toggle overflow
- Escape: (Consumer-provided) close the overflow menu when open

## Props

- `label`: string (REQUIRED) -- aria-label for the group
- `overflowOpen`: boolean (default false)
- `overflowLabel`: string (optional)
- `onOverflowToggle` / `onoverflowtoggle`: callback (optional)
- `children`: slot -- visible action buttons
- `overflow`: slot/snippet/ReactNode (optional) -- overflow menu content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with role="group" and class="action-group"
- [ ] aria-label is present and equals the label prop
- [ ] Visible children render inside the group
- [ ] Overflow trigger renders only when `overflow` is provided
- [ ] aria-expanded on the overflow trigger reflects `overflowOpen`
- [ ] Overflow panel uses the hidden attribute when `overflowOpen` is false
- [ ] onOverflowToggle fires when the overflow trigger is activated
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .action-group in css-style-sheet-template.css
- Adobe Spectrum Action Group: https://spectrum.adobe.com/page/action-group/
- WAI-ARIA Group: https://www.w3.org/TR/wai-aria-1.2/#group
