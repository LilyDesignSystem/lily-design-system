# Red Orange Yellow Green Blue Radio Group

RedOrangeYellowGreenBlueRadioGroup is a headless `<fieldset role="radiogroup">` for choosing a five-level colour status, holding the `RedOrangeYellowGreenBlueRadioInput` radios the consumer composes. It is the composable sibling of [RedOrangeYellowGreenBluePicker](red-orange-yellow-green-blue-picker.md): the picker renders its own labelled radios, while this group takes whatever radios, labels and layout the consumer writes.

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` and `aria-label`
- The consumer supplies one `RedOrangeYellowGreenBlueRadioInput` per value (`red`, `orange`, `yellow`, `green`, `blue`); the group renders no option text of its own
- Selection, the arrow keys, form submission and form reset are native radio behaviour, so the group keeps no state
- Spreads `restProps` onto the fieldset, so `disabled`, `id` or `data-*` pass through

## Props

- `label`: string (required) -- accessible name for the group
- `children`: slot (required) -- the `RedOrangeYellowGreenBlueRadioInput` elements
- `...restProps`: any additional HTML attributes spread onto the fieldset

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

It renders:

```html
<fieldset
  class="red-orange-yellow-green-blue-radio-group"
  role="radiogroup"
  aria-label="Risk level"
>
  <input
    class="red-orange-yellow-green-blue-radio-input"
    type="radio"
    aria-label="Severe"
    name="status"
    value="red"
    data-value="red"
  />
  …
</fieldset>
```

## Keyboard Interactions

- Tab: focus the checked radio, or the first if none is checked
- ArrowDown / ArrowRight: move to and check the next radio
- ArrowUp / ArrowLeft: move to and check the previous radio
- Space: check the focused radio

## ARIA

- `role="radiogroup"` on the `<fieldset>`, named by `aria-label`
- Each radio is named by its own `label`, so a status or rating is never shown by colour alone (WCAG 1.4.1)

## When to Use

- Use when the consumer wants to lay out, order or label the options themselves, for example with a visible `<label>` beside each radio.
- Use inside a form, where the native radios submit the chosen value under one `name`.
- Use when a form reset must restore the starting choice without any script.
- Use when the options need extra content between them, such as a description under each one.

## When Not to Use

- Do not use when the group should render its own options -- use [RedOrangeYellowGreenBluePicker](red-orange-yellow-green-blue-picker.md), which draws one labelled radio per value itself.
- Do not use for a read-only display -- use [RedOrangeYellowGreenBlueView](red-orange-yellow-green-blue-view.md) instead.
- Do not use for a plain set of choices with no status or rating meaning -- use [RadioGroup](radio-group.md) instead.

## Headless

The RedOrangeYellowGreenBlueRadioGroup headless component provides a `<fieldset>` with `role="radiogroup"` and `aria-label`. It relies on native radio behaviour for selection and the keyboard. The consumer provides all visual styling, including any colour coding.

## Styles

The consumer provides all CSS styling. The component renders with a `.red-orange-yellow-green-blue-radio-group` class for targeting; each radio carries `.red-orange-yellow-green-blue-radio-input` and `data-value`. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `red-orange-yellow-green-blue-radio-group` and `role="radiogroup"`
- Verify the group is named by `aria-label`
- Verify the consumer's radios render inside it
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give every option visible text as well as its colour or icon; colour alone fails people with colour vision deficiencies.
- **Developers**: Give every `RedOrangeYellowGreenBlueRadioInput` the same `name`, so the browser treats them as one group for the arrow keys and form submission.

## Related components

- `red-orange-yellow-green-blue-radio-input` — a radio input for one choice of a five-level color status <input type="radio">
- `red-orange-yellow-green-blue-picker` — the picker that renders its own radios
- `radio-group` — the general radio group

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Traffic Light Rating System: https://en.wikipedia.org/wiki/Traffic_light_rating_system

---

Lily™ and Lily Design System™ are trademarks.
