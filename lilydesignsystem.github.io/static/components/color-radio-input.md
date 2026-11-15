# Color Radio Input

ColorRadioInput is a headless native `<input type="radio">` for one choice of a colour swatch, used inside a [ColorRadioGroup](color-radio-group.md). It is the radio counterpart of [ColorPickerButton](color-picker-button.md): where the picker button is a toggle `<button>` with `aria-pressed`, this is a real radio, so the group gets native arrow keys, form submission and form reset.

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders a native `<input type="radio">` with `aria-label`
- Sets `data-color` and the `--color-radio-input-color` custom property to its colour, so consumer CSS can paint the swatch (`background: var(--color-radio-input-color)`); the component sets no other style
- Submits its colour unless a `value` is given
- No two-way binding: the checked state is the browser's, and `checked` sets where it starts

## Props

- `color`: string (required) -- the CSS colour this option stands for, exposed as `data-color` and the `--color-radio-input-color` custom property
- `label`: string (required) -- accessible name via `aria-label`, the colour's name in words
- `name`: string (default: `undefined`) -- radio group name
- `value`: string (default: the colour) -- the submitted value
- `checked`: boolean (default: `false`) -- whether this radio starts checked
- `disabled`: boolean (default: `false`) -- whether this radio is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```svelte
<ColorRadioGroup label="Highlight colour">
  <ColorRadioInput
    color="#005eb8"
    label="Blue"
    name="colour"
    checked
  />
  <ColorRadioInput
    color="#007f3b"
    label="Green"
    name="colour"
  />
  <ColorRadioInput
    color="#d5281b"
    label="Red"
    name="colour"
  />
</ColorRadioGroup>
```

## Keyboard Interactions

- Tab: focus the checked radio in the group, or the first if none is checked
- ArrowDown / ArrowRight: move to and check the next radio
- ArrowUp / ArrowLeft: move to and check the previous radio
- Space: check the focused radio

## ARIA

- `aria-label={label}` names the radio; the native radio role and checked state need no ARIA
- The colour's name is in the label, so the choice is never colour alone (WCAG 1.4.1)

## When to Use

- Use inside a `ColorRadioGroup`, one radio per colour.
- Use when a form must submit the chosen colour without script.
- Use when consumer CSS should draw each option from `data-color` or `--color-radio-input-color`.

## When Not to Use

- Do not use as a toggle outside a radio group -- use [ColorPickerButton](color-picker-button.md) instead.
- Do not use when a ready-made group is enough -- use [ColorPicker](color-picker.md), which renders its own radios.
- Do not use for an option with no colour meaning -- use [RadioInput](radio-input.md) instead.

## Headless

The ColorRadioInput headless component renders a native radio with `aria-label`, `data-color` and one CSS custom property carrying its colour. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.color-radio-input` class for targeting; paint the swatch from `var(--color-radio-input-color)`. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders an `<input type="radio">` with class `color-radio-input`
- Verify `aria-label`, `name`, `checked` and `disabled`
- Verify `data-color`, the custom property, and the colour as the default value
- Verify Tab reaches it and Space checks it

## Advice

- **Designers**: Pair every swatch with words; colour alone is not enough.
- **Developers**: Give every radio in the group the same `name`, and a visible `<label>` where the layout allows one.

## Related components

- `color-radio-group` — a fieldset radio group for selecting a color swatch
- `color-picker-button` — the toggle-button counterpart
- `radio-input` — the general radio input

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio

---

Lily™ and Lily Design System™ are trademarks.
