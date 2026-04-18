# ToggleButton

A toggle is a UI/UX component that provides a binary on/off control using a button with `role="switch"`. It communicates its state through `aria-checked` and supports both click and keyboard (Space key) interaction. The pressed state is bindable for two-way data flow.

Toggles are commonly used for settings like dark mode, notifications, or feature flags where a user needs to switch between two states. While similar to SwitchInput, the ToggleButton component uses a `pressed` prop name rather than `checked`, providing a semantic distinction for use cases where "pressed/unpressed" better describes the interaction than "checked/unchecked".

## Implementation Notes

- Renders a `<button type="button">` element with `role="switch"` for toggle semantics
- Uses `$bindable()` for the `pressed` prop enabling two-way data binding with `bind:pressed`
- Click handler toggles `pressed` when not disabled
- Custom `onkeydown` handler processes the Space key to toggle state, with `preventDefault()` to avoid scrolling
- The `type="button"` prevents accidental form submission
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)
- Functionally similar to SwitchInput but uses `pressed` instead of `checked` for the state prop

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `pressed`: boolean (default: false) -- whether the toggle is on, bindable with `bind:pressed`
- `disabled`: boolean (default: false) -- whether the toggle is disabled
- `...restProps`: spread onto the `<button>` element

## Usage

```svelte
<ToggleButton label="Dark mode" bind:pressed />
```

```svelte
<ToggleButton label="Mute audio" bind:pressed={muted} disabled={locked} />
```

## Keyboard Interactions

- Space: toggles between on and off states (custom handler with `preventDefault`)
- Enter: activates the button (native button behavior)

## ARIA

- `role="switch"` -- identifies the element as a two-state toggle switch
- `aria-checked={pressed}` -- communicates whether the toggle is currently on (`true`) or off (`false`)
- `aria-label={label}` -- provides the accessible name for the toggle control

## References

- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/switch/
- WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch
