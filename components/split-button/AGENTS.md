# SplitButton

## Metadata

- Component: split-button
- PascalCase: SplitButton
- Description: a button with a primary action and a dropdown for related actions
- HTML tag: <div> with role="group"
- CSS class: .split-button
- Interactive: yes

## Key Behaviors

- Renders `<div role="group" aria-label={label}>` containing two `<button>` elements
- Primary button: `<button class="split-button-primary" type="button">{primaryLabel}</button>`
- Menu trigger: `<button class="split-button-menu-trigger" type="button" aria-haspopup="menu" aria-expanded={menuOpen} aria-label={menuLabel}></button>`
- Menu container: `<div class="split-button-menu" hidden={!menuOpen}>{children}</div>`
- No chevron rendered by the headless component
- Component does not own menuOpen state — consumer controls via onMenuToggle

## ARIA

- `role="group"` on wrapper
- `aria-label` on group from label prop
- `aria-haspopup="menu"` on menu trigger
- `aria-expanded={menuOpen}` on menu trigger
- `aria-label={menuLabel}` on menu trigger

## Keyboard

- Tab: focus primary, then trigger
- Enter / Space on primary: fires onPrimaryClick
- Enter / Space on trigger: toggles onMenuToggle
- Escape handled by consumer's menu component

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

## Acceptance Criteria

- [ ] Renders <div> with class="split-button" and role="group"
- [ ] Group aria-label equals label prop
- [ ] Primary button has class="split-button-primary" and text from primaryLabel
- [ ] Menu trigger has class="split-button-menu-trigger" and aria-label from menuLabel
- [ ] aria-haspopup="menu" on menu trigger
- [ ] aria-expanded matches menuOpen prop
- [ ] Menu container has hidden attribute when menuOpen is false
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
