# Toggle Button

A ToggleButton is a UI/UX component that provides a button that stays pressed until pressed again: a native `<button>` with `aria-pressed`, the WAI-ARIA toggle button pattern, announced as "toggle button, pressed" or "not pressed". It supports click and keyboard (Enter and Space) interaction, and the pressed state is bindable for two-way data flow.

**Status:** stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.

Use it for an action that stays on, such as Bold, Italic, Mute or Favourite, often in a toolbar. For a setting that turns on or off, such as dark mode or notifications, use SwitchButton, which has `role="switch"` and is announced as "on" or "off".

## Implementation Notes

- Renders a `<button>` element with class `toggle-button`
- Spreads `restProps` onto the root element for consumer customization

## Help

Use ToggleButton for a pressed or unpressed action, such as Bold in a text toolbar, Mute in a call, or Favourite on an item. For a setting with immediate effect, such as dark mode, use SwitchButton; for a choice in a form, use a checkbox.

## Syntax

```html
<ToggleButton
  label="..."
  pressed="{pressed}"
/>
```

## Usage

Bold formatting toggle in a text editor toolbar:

```html
<ToggleButton
  label="Bold"
  pressed="{isBold}"
/>
```

Mute control in a media player:

```html
<ToggleButton
  label="Mute audio"
  pressed="{muted}"
  disabled="{locked}"
/>
```

Favourite toggle on a content card:

```html
<ToggleButton
  label="Favourite"
  pressed="{isFavourited}"
/>
```

## Props

| Prop           | Type            | Default    | Description                                                       |
| -------------- | --------------- | ---------- | ----------------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name applied via `aria-label`                          |
| `pressed`      | `boolean`       | `false`    | Whether the toggle is on; bindable with two-way `pressed` binding |
| `disabled`     | `boolean`       | `false`    | Whether the toggle is disabled                                    |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<button>` element          |

## Examples

Feature flag control:

```html
<ToggleButton
  label="Enable beta features"
  pressed="{betaFeatures}"
/>
```

## Keyboard Interactions

- Space: Toggles between on and off states (custom handler with `preventDefault`)
- Enter: Activates the button (native button behavior)

## ARIA

- No `role`: a native `<button>` with `aria-pressed` is announced as a toggle button (the WAI-ARIA toggle button pattern)
- `aria-pressed={pressed}` -- communicates whether the button is pressed (`true`) or not (`false`)
- `aria-label={label}` -- provides the accessible name for the toggle control

## When to Use

- Use for a button that toggles between pressed and unpressed states, such as bold or italic formatting.
- Use for mute/unmute or play/pause controls in media applications.
- Use when "pressed/unpressed" better describes the interaction than "checked/unchecked".
- Use inside a ToggleGroup for related multi-toggle options like text alignment or view modes.
- Use for toolbar actions where the button state needs to persist visually.

## When Not to Use

- Do not use for on/off settings with immediate effect -- use SwitchButton instead.
- Do not use for navigation actions -- use ActionLink instead.
- Do not use for form fields where a checkbox is more appropriate -- use CheckboxInput instead.

## Headless

This headless component provides a native `<button>` with `aria-pressed` and `aria-label`, and no `role`, for accessible toggle button behavior. The consumer provides all visual styling, including pressed and unpressed states and any icons or labels.

## Styles

The consumer provides all CSS styling. The component renders with a `.toggle-button` class for targeting. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<button>` element with class `toggle-button`
- Verify the `<button>` has `aria-pressed` and no `role`
- Verify aria-label={label}` -- provides the accessible name for the toggle control
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide distinct visual states for pressed and unpressed (e.g., filled vs. outlined, color change) so the current state is immediately obvious.
- **Developers**: Use two-way binding on the `pressed` prop to keep parent state in sync. ToggleButton can be used standalone or inside a ToggleGroup.

## Composition

ToggleButton works as a standalone component or as a child of ToggleGroup. When used inside a ToggleGroup, multiple ToggleButtons are semantically grouped with `role="group"` for related toggle options (e.g., text formatting: bold, italic, underline).

## Related components

- `switch-button` — a toggle switch for turning a setting on or off
- `button` — a generic clickable button element
- `checkbox-input` — a checkbox input for toggling a boolean value <input type="checkbox">

## References

- WAI-ARIA Button Pattern (toggle button): https://www.w3.org/WAI/ARIA/apg/patterns/button/
- aria-pressed: https://www.w3.org/TR/wai-aria-1.2/#aria-pressed

---

Lily™ and Lily Design System™ are trademarks.
