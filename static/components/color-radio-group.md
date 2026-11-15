# Color Radio Group

ColorRadioGroup is a headless `<fieldset role="radiogroup">` for choosing a colour swatch, holding the `ColorRadioInput` radios the consumer composes. It is the composable sibling of [ColorPicker](color-picker.md): the picker renders its own labelled radios, while this group takes whatever radios, labels and layout the consumer writes.

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` and `aria-label`
- The consumer supplies one `ColorRadioInput` per colour (any CSS colour); the group renders no option text of its own
- Selection, the arrow keys, form submission and form reset are native radio behaviour, so the group keeps no state
- Spreads `restProps` onto the fieldset, so `disabled`, `id` or `data-*` pass through

## Props

- `label`: string (required) -- accessible name for the group
- `children`: slot (required) -- the `ColorRadioInput` elements
- `...restProps`: any additional HTML attributes spread onto the fieldset

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

It renders:

```html
<fieldset
  class="color-radio-group"
  role="radiogroup"
  aria-label="Highlight colour"
>
  <input
    class="color-radio-input"
    type="radio"
    aria-label="Blue"
    name="colour"
    value="#005eb8"
    data-color="#005eb8"
    style="--color-radio-input-color: #005eb8"
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
- Each radio is named by its own `label`, so a colour is never shown by colour alone (WCAG 1.4.1)

## When to Use

- Use when the consumer wants to lay out, order or label the colour swatches themselves, for example with a visible `<label>` beside each radio.
- Use inside a form, where the native radios submit the chosen colour under one `name`.
- Use when a form reset must restore the starting choice without any script.
- Use when the options need extra content between them, such as a description under each one.

## When Not to Use

- Do not use when the group should render its own options -- use [ColorPicker](color-picker.md), which draws one labelled radio per colour itself.
- Do not use for a free colour choice -- use [ColorInput](color-input.md) or [ColorPicker](color-picker.md) instead.
- Do not use for a plain set of choices with no colour meaning -- use [RadioGroup](radio-group.md) instead.

## Headless

The ColorRadioGroup headless component provides a `<fieldset>` with `role="radiogroup"` and `aria-label`. It relies on native radio behaviour for selection and the keyboard. The consumer provides all visual styling, including any swatch.

## Styles

The consumer provides all CSS styling. The component renders with a `.color-radio-group` class for targeting; each radio carries `.color-radio-input` and `data-color`. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `color-radio-group` and `role="radiogroup"`
- Verify the group is named by `aria-label`
- Verify the consumer's radios render inside it
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give every option visible text as well as its swatch; colour alone fails people with colour vision deficiencies.
- **Developers**: Give every `ColorRadioInput` the same `name`, so the browser treats them as one group for the arrow keys and form submission.

## Related components

- `color-radio-input` — a radio input for one choice of a color swatch <input type="radio">
- `color-picker` — the picker that renders its own radios
- `radio-group` — the general radio group

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- MDN CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

---

Lily™ and Lily Design System™ are trademarks.
