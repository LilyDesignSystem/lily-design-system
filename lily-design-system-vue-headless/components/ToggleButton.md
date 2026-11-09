# ToggleButton

A toggle button is a UI/UX component that provides a button that stays pressed until pressed again: a native `<button>` with `aria-pressed`, the WAI-ARIA toggle button pattern, announced as "toggle button, pressed" or "not pressed". It supports click and keyboard (Enter and Space) interaction, and the pressed state is bindable for two-way data flow.

Use it for an action that stays on, such as Bold, Italic, Mute or Favourite, often in a toolbar. For a setting that turns on or off, such as dark mode or notifications, use SwitchButton, which has `role="switch"` and is announced as "on" or "off".

## Implementation Notes

- Renders a `<button type="button">` element with `aria-pressed` for toggle button semantics (no `role`)
- Uses `$bindable()` for the `pressed` prop enabling two-way data binding with `bind:pressed`
- Click handler toggles `pressed` when not disabled
- Custom `onkeydown` handler processes the Space key to toggle state, with `preventDefault()` to avoid scrolling
- The `type="button"` prevents accidental form submission
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)
- Distinct from SwitchButton: this is a toggle button (`aria-pressed`), that is a switch (`role="switch"`)

## Props

- `label`: string (required) -- accessible name applied via `aria-label`
- `pressed`: boolean (default: false) -- whether the toggle is on, bindable with `bind:pressed`
- `disabled`: boolean (default: false) -- whether the toggle is disabled
- `...restProps`: spread onto the `<button>` element

## Usage

```svelte
<ToggleButton
  label="Dark mode"
  bind:pressed
/>
```

```svelte
<ToggleButton
  label="Mute audio"
  bind:pressed={muted}
  disabled={locked}
/>
```

## Keyboard Interactions

- Space: toggles between on and off states (custom handler with `preventDefault`)
- Enter: activates the button (native button behavior)

## ARIA

- No `role`: a native `<button>` with `aria-pressed` is announced as a toggle button (the WAI-ARIA toggle button pattern)
- `aria-pressed={pressed}` -- communicates whether the button is pressed (`true`) or not (`false`)
- `aria-label={label}` -- provides the accessible name for the toggle control

## References

- WAI-ARIA Button Pattern (toggle button): https://www.w3.org/WAI/ARIA/apg/patterns/button/
- aria-pressed: https://www.w3.org/TR/wai-aria-1.2/#aria-pressed
