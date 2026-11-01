# ActionGroup

## Metadata

- Component: action-group
- PascalCase: ActionGroup
- Description: a group of action buttons that can collapse to an overflow menu when space is constrained
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div> with role="group"
- CSS class: .action-group
- Interactive: yes (when overflow is used)

## Key Behaviors

- Renders a <div role="group"> with required aria-label
- Renders visible action buttons as children
- Renders an overflow trigger only when the `overflow` slot/prop is provided
- Overflow trigger has aria-haspopup="menu" and aria-expanded reflecting `overflowOpen`
- Overflow panel is `popover="auto"`, named by the trigger's `command="toggle-popover"` `commandfor` (and `popovertarget`) and `aria-controls`; the browser opens, closes and light-dismisses it, and its `toggle` event writes the bindable `overflowOpen` back. Where the Popover API is missing it falls back to the `hidden` attribute when `overflowOpen` is false (P18-T11)
- Calls `onOverflowToggle` when the overflow trigger is activated

## ARIA

- `role="group"` on the container
- `aria-label` is the accessible name (required)
- Overflow trigger: `aria-haspopup="menu"`, `aria-expanded`, optional `aria-label` via `overflowLabel`
- Overflow panel is a closed popover (or `hidden`, without the Popover API) when closed

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

## Native platform

- Decision: native
- Uses: popover="auto" overflow menu opened by command="toggle-popover" commandfor (and popovertarget) on the overflow trigger; bindable overflowOpen synced from the toggle event
- Could use: CSS anchor positioning
- Notes: As split-button. Angular and Blazor were bare stubs and were ported from Svelte (P18-T11, 2026-10-30).
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with role="group" and class="action-group"
- [ ] aria-label is present and equals the label prop
- [ ] Visible children render inside the group
- [ ] Overflow trigger renders only when `overflow` is provided
- [ ] aria-expanded on the overflow trigger reflects `overflowOpen`
- [ ] Overflow panel is popover="auto" named by the trigger; the hidden attribute when `overflowOpen` is false where the Popover API is missing
- [ ] onOverflowToggle fires when the overflow trigger is activated
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .action-group in css-style-sheet-template.css
- Adobe Spectrum Action Group: https://spectrum.adobe.com/page/action-group/
- WAI-ARIA Group: https://www.w3.org/TR/wai-aria-1.2/#group
