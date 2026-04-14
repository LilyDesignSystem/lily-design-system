# Switch Button

A switch input is a UI/UX component that provides a binary toggle control, similar to a physical on/off switch. It uses `role="switch"` with `aria-checked` to communicate the current state to assistive technologies. The component supports both click and keyboard (Space key) activation for accessibility compliance.

Switch inputs are commonly used for settings, preferences, and feature toggles where users need to enable or disable a single option without submitting a form. Unlike checkboxes, switches provide immediate effect and convey an on/off semantic rather than checked/unchecked.

## Implementation Notes

- Renders a `<button type="button">` element with `role="switch"` for switch semantics
- Supports two-way binding for the `checked` prop enabling two-way data binding with two-way `checked` binding
- Click handler toggles `checked` when not disabled
- Custom `onkeydown` handler processes the Space key to toggle state, with `preventDefault()` to avoid scrolling
- The `type="button"` prevents accidental form submission
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `checked`: boolean (default: false) -- whether the switch is on, bindable with two-way `checked` binding
- `disabled`: boolean (default: false) -- whether the switch is disabled
- `...restProps`: spread onto the `<button>` element

## Usage

Notification toggle in a settings panel:

```html
<SwitchButton label="Enable notifications" checked={notificationsEnabled} />
```

Dark mode toggle with disabled state when locked by admin:

```html
<SwitchButton label="Dark mode" checked={darkMode} disabled={locked} />
```

Feature flag toggle in a dashboard:

```html
<SwitchButton label="Enable beta features" checked={betaEnabled} />
```

## Keyboard Interactions

- Space: toggles the switch between on and off states (custom handler with `preventDefault`)
- Enter: activates the button (native button behavior)

## ARIA

- `role="switch"` -- identifies the element as a two-state toggle switch
- `aria-checked={checked}` -- communicates whether the switch is currently on (`true`) or off (`false`)
- `aria-label={label}` -- provides the accessible name for the switch control

## When to Use

- Use for binary settings that take immediate effect, such as enabling or disabling notifications.
- Use for toggling features on and off, such as dark mode, Wi-Fi, or Bluetooth.
- Use when the on/off semantic is more appropriate than a checked/unchecked semantic.
- Use when a single control needs to toggle a preference without a separate save action.
- Use in settings panels, preference screens, and feature flag dashboards.

## When Not to Use

- Do not use for form selections that require submission to take effect -- use CheckboxInput instead.
- Do not use for choosing between two distinct options -- use RadioGroup instead.
- Do not use when the control is part of a group of related options in a form -- use CheckboxGroup instead.
- Do not use for toggling a button's pressed state in a toolbar -- use ToggleButton instead.

## Headless

This headless component renders a `<button>` with `role="switch"` and `aria-checked`, providing proper switch semantics and keyboard activation (Space and Enter keys). The consumer provides all visual styling including the track, thumb, on/off indicators, and transition animations.


## Styles

The consumer provides all CSS styling. The component renders with a `.switch-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `switch-button`
- Verify role="switch"` -- identifies the element as a two-state toggle switch
- Verify aria-label={label}` -- provides the accessible name for the switch control
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the on and off states visually distinct using color, position, and optionally text labels. Ensure the switch is large enough for touch targets (at least 44x44px).
- **Developers**: Use the two-way bindable `checked` prop for reactive state. Remember that switches convey immediate effect -- do not use them for settings that require a separate save action.

## References

- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/switch/
- WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch
