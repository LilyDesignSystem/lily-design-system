# Red Orange Yellow Green Blue Radio Input

RedOrangeYellowGreenBlueRadioInput is a headless native `<input type="radio">` for one choice of a five-level colour status, used inside a [RedOrangeYellowGreenBlueRadioGroup](red-orange-yellow-green-blue-radio-group.md). It is the radio counterpart of [RedOrangeYellowGreenBluePickerButton](red-orange-yellow-green-blue-picker-button.md): where the picker button is a toggle `<button>` with `aria-pressed`, this is a real radio, so the group gets native arrow keys, form submission and form reset.

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders a native `<input type="radio">` with `aria-label`
- Sets `data-value` to its value, so consumer CSS can colour or draw each option (`.red-orange-yellow-green-blue-radio-input[data-value="red"]`)
- No two-way binding: the checked state is the browser's, and `checked` sets where it starts

## Props

- `value`: string (required) -- the status or rating this radio stands for (`red`, `orange`, `yellow`, `green`, `blue`), also exposed as `data-value`
- `label`: string (required) -- accessible name via `aria-label`
- `name`: string (default: `undefined`) -- radio group name
- `checked`: boolean (default: `false`) -- whether this radio starts checked
- `disabled`: boolean (default: `false`) -- whether this radio is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```svelte
<RedOrangeYellowGreenBlueRadioGroup label="Risk level">
  <RedOrangeYellowGreenBlueRadioInput
    value="red"
    label="Severe"
    name="status"
  />
  <RedOrangeYellowGreenBlueRadioInput
    value="orange"
    label="High"
    name="status"
  />
  <RedOrangeYellowGreenBlueRadioInput
    value="yellow"
    label="Moderate"
    name="status"
    checked
  />
</RedOrangeYellowGreenBlueRadioGroup>
```

## Keyboard Interactions

- Tab: focus the checked radio in the group, or the first if none is checked
- ArrowDown / ArrowRight: move to and check the next radio
- ArrowUp / ArrowLeft: move to and check the previous radio
- Space: check the focused radio

## ARIA

- `aria-label={label}` names the radio; the native radio role and checked state need no ARIA
- The label carries the option's words, so the choice is never colour or an icon alone (WCAG 1.4.1)

## When to Use

- Use inside a `RedOrangeYellowGreenBlueRadioGroup`, one radio per value.
- Use when a form must submit the chosen value without script.
- Use when consumer CSS should draw each option from `data-value`.

## When Not to Use

- Do not use as a toggle outside a radio group -- use [RedOrangeYellowGreenBluePickerButton](red-orange-yellow-green-blue-picker-button.md) instead.
- Do not use when a ready-made group is enough -- use [RedOrangeYellowGreenBluePicker](red-orange-yellow-green-blue-picker.md), which renders its own radios.
- Do not use for an option with no status or rating meaning -- use [RadioInput](radio-input.md) instead.

## Headless

The RedOrangeYellowGreenBlueRadioInput headless component renders a native radio with `aria-label` and `data-value`. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.red-orange-yellow-green-blue-radio-input` class for targeting; style each option with `[data-value]`. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders an `<input type="radio">` with class `red-orange-yellow-green-blue-radio-input`
- Verify `aria-label`, `name`, `checked` and `disabled`
- Verify `data-value` matches the value
- Verify Tab reaches it and Space checks it

## Advice

- **Designers**: Pair every colour or icon with words; colour alone is not enough.
- **Developers**: Give every radio in the group the same `name`, and a visible `<label>` where the layout allows one.

## Related components

- `red-orange-yellow-green-blue-radio-group` — a fieldset radio group for selecting a five-level color status
- `red-orange-yellow-green-blue-picker-button` — the toggle-button counterpart
- `radio-input` — the general radio input

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio

---

Lily™ and Lily Design System™ are trademarks.
