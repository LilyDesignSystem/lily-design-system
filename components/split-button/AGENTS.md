# SplitButton

## Metadata

- Component: split-button
- PascalCase: SplitButton
- Description: a button with a primary action and a dropdown for related actions
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div> with role="group"
- CSS class: .split-button
- Interactive: yes

## Key Behaviors

- Renders `<div role="group" aria-label={label}>` containing two `<button>` elements
- Primary button: `<button class="split-button-primary" type="button">{primaryLabel}</button>`
- Menu trigger: `<button class="split-button-menu-trigger" type="button" aria-haspopup="menu" aria-expanded={menuOpen} aria-label={menuLabel}></button>`
- Menu container: `<div class="split-button-menu" id popover="auto">{children}</div>`; the trigger names it with `command="toggle-popover"` `commandfor` (and `popovertarget`) and `aria-controls`
- No chevron rendered by the headless component
- `menuOpen` is bindable (P18-T11): the browser opens, closes and light-dismisses the menu and its `toggle` event writes `menuOpen` back; where the Popover API is missing the trigger's click toggles `menuOpen` and the menu falls back to `hidden`. `onMenuToggle` still fires on each trigger click; calling `preventDefault()` on its event keeps the menu as it is

## ARIA

- `role="group"` on wrapper
- `aria-label` on group from label prop
- `aria-haspopup="menu"` on menu trigger
- `aria-expanded={menuOpen}` on menu trigger
- `aria-label={menuLabel}` on menu trigger

## Keyboard

- Tab: focus primary, then trigger
- Enter / Space on primary: fires onPrimaryClick
- Enter / Space on trigger: toggles the menu (and fires onMenuToggle)
- Escape and a click outside close the menu (the browser's popover light dismiss)

## Props

- `label`: string (required) -- aria-label for the group
- `primaryLabel`: string (required)
- `menuLabel`: string (required)
- `menuOpen`: boolean (default: false)
- `disabled`: boolean (default: false)
- `onPrimaryClick` / `onprimaryclick`: callback
- `onMenuToggle` / `onmenutoggle`: callback
- `children`: slot -- menu content
- `...restProps`: any additional HTML attributes

## Native platform

- Decision: native
- Uses: popover="auto" menu opened by command="toggle-popover" commandfor (and popovertarget) on the menu trigger; bindable menuOpen synced from the toggle event
- Could use: CSS anchor positioning
- Notes: Escape and light dismiss now come from the browser. Angular and Blazor were bare stubs and were ported from Svelte (P18-T11, 2026-10-30).
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> with class="split-button" and role="group"
- [ ] Group aria-label equals label prop
- [ ] Primary button has class="split-button-primary" and text from primaryLabel
- [ ] Menu trigger has class="split-button-menu-trigger" and aria-label from menuLabel
- [ ] aria-haspopup="menu" on menu trigger
- [ ] aria-expanded matches menuOpen prop
- [ ] Menu container is popover="auto", named by the trigger's command/commandfor and popovertarget; the hidden attribute when menuOpen is false where the Popover API is missing
- [ ] onPrimaryClick fires on primary click
- [ ] onMenuToggle fires on trigger click
- [ ] disabled propagates to both buttons
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .split-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/split-button.html
- WAI-ARIA Menu Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
