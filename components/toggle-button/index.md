# Toggle Button

A ToggleButton is a UI/UX component that provides a binary on/off control using a button with `role="switch"`. It communicates its state through `aria-checked` and supports both click and keyboard (Space key) interaction. The pressed state is bindable for two-way data flow.

ToggleButtons are commonly used for settings like dark mode, notifications, or feature flags where a user needs to switch between two states. While similar to SwitchInput, the ToggleButton component uses a `pressed` prop name rather than `checked`, providing a semantic distinction for use cases where "pressed/unpressed" better describes the interaction than "checked/unchecked".

## Help

Use ToggleButton when you need a binary on/off control with button semantics. Common scenarios include dark mode toggles, mute controls, notification switches, and feature flags. For checkbox-style toggles, consider SwitchInput instead.

## Syntax

```html
<ToggleButton label="..." pressed={pressed} />
```

## Usage

Bold formatting toggle in a text editor toolbar:

```html
<ToggleButton label="Bold" pressed={isBold} />
```

Mute control in a media player:

```html
<ToggleButton label="Mute audio" pressed={muted} disabled={locked} />
```

Favourite toggle on a content card:

```html
<ToggleButton label="Favourite" pressed={isFavourited} />
```

## Props

| Prop           | Type            | Default    | Description                                              |
| -------------- | --------------- | ---------- | -------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name applied via `aria-label`                 |
| `pressed`      | `boolean`       | `false`    | Whether the toggle is on; bindable with two-way `pressed` binding   |
| `disabled`     | `boolean`       | `false`    | Whether the toggle is disabled                           |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<button>` element |

## Examples

Feature flag control:

```html
<ToggleButton label="Enable beta features" pressed={betaFeatures} />
```

## Keyboard Interactions

- Space: Toggles between on and off states (custom handler with `preventDefault`)
- Enter: Activates the button (native button behavior)

## ARIA

- `role="switch"` -- identifies the element as a two-state toggle switch
- `aria-checked={pressed}` -- communicates whether the toggle is currently on (`true`) or off (`false`)
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

This headless component provides a `<button>` with `role="switch"`, `aria-checked`, and `aria-label` for accessible two-state toggle behavior. It handles Space key toggling with `preventDefault`. The consumer provides all visual styling, including pressed/unpressed states and any icons or labels.


## Styles

The consumer provides all CSS styling. The component renders with a `.toggle-button` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<button>` element with class `toggle-button`
- Verify role="switch"` -- identifies the element as a two-state toggle switch
- Verify aria-label={label}` -- provides the accessible name for the toggle control
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide distinct visual states for pressed and unpressed (e.g., filled vs. outlined, color change) so the current state is immediately obvious.
- **Developers**: Use two-way binding on the `pressed` prop to keep parent state in sync. ToggleButton can be used standalone or inside a ToggleGroup.

## Composition

ToggleButton works as a standalone component or as a child of ToggleGroup. When used inside a ToggleGroup, multiple ToggleButtons are semantically grouped with `role="group"` for related toggle options (e.g., text formatting: bold, italic, underline).

## References

- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/switch/
- WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch
