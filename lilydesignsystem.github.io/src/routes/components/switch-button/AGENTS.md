# SwitchButton

## Metadata

- Component: switch-button
- PascalCase: SwitchButton
- Description: a toggle switch for turning a setting on or off
- HTML tag: <button>
- CSS class: .switch-button
- Interactive: yes

## Key Behaviors

- Renders a `<button type="button">` element with `role="switch"` for switch semantics
- Supports two-way binding for the `checked` prop enabling two-way data binding with two-way `checked` binding
- Click handler toggles `checked` when not disabled
- Custom `onkeydown` handler processes the Space key to toggle state, with `preventDefault()` to avoid scrolling
- The `type="button"` prevents accidental form submission
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)

## ARIA

- `role="switch"` -- identifies the element as a two-state toggle switch
- `aria-checked={checked}` -- communicates whether the switch is currently on (`true`) or off (`false`)
- `aria-label={label}` -- provides the accessible name for the switch control

## Keyboard

- Space: toggles the switch between on and off states (custom handler with `preventDefault`)
- Enter: activates the button (native button behavior)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `checked`: boolean (default: false) -- whether the switch is on, bindable with two-way `checked` binding
- `disabled`: boolean (default: false) -- whether the switch is disabled
- `...restProps`: spread onto the `<button>` element

## Acceptance Criteria

- [ ] Renders <button> element with class="switch-button"
- [ ] Has aria-label attribute
- [ ] Has role="switch"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .switch-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/switch-button.html
- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch
