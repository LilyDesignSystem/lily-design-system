# Quantity Input Div

QuantityInputDiv is a headless input for a quantity: a number and its unit, such as a weight in kilograms or pounds. It renders a labelled group holding a number input and a unit `<select>`, and each unit carries its own limits, so "0 to 300 kg" and "0 to 660 lb" are both enforced by the browser. It converts nothing.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<div class="quantity-input-div" role="group" aria-label>` with a labelled `<input type="number" class="quantity-input-div-magnitude" inputmode="decimal">` and, for more than one unit, a labelled `<select class="quantity-input-div-unit">`
- Each unit has its own `min`, `max` and `step`; the number takes the chosen unit's limits
- With one unit, the unit is text linked to the number by `aria-describedby`, and a hidden field submits it
- Nothing is converted: changing the unit keeps the number as typed
- The fields are `{name}-magnitude` and `{name}-unit`; a form reset restores both

## Props

- `label`: string (required) — the group's name ("Weight")
- `magnitudeLabel`: string (required) — the number input's label ("Amount")
- `unitLabel`: string (required when there is more than one unit) — the unit select's label ("Unit")
- `units`: { value, label, min?, max?, step? }[] (required) — the units offered, in the consumer's words; the first is the default
- `magnitude`: string (default "") — the number as typed; two-way
- `unit`: string (default: the first unit) — the unit chosen; two-way
- `name`: string (optional) — base name for `{name}-magnitude` and `{name}-unit`
- `required`, `disabled`: boolean (default false)
- `id`: string (optional) — base id
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<QuantityInputDiv
  label="Weight"
  magnitudeLabel="Amount"
  unitLabel="Unit"
  name="weight"
  units={[
    { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
    { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
  ]}
/>
```

## Keyboard Interactions

| Key        | Action                                               |
| ---------- | ---------------------------------------------------- |
| Tab        | Moves between the number and the unit                |
| Arrow keys | Change the number by its step, or the unit, natively |

## ARIA

- `role="group"` with `aria-label` names the pair; each control has a visible `<label for>`
- A single unit is linked to the number by `aria-describedby`

## When to Use

- Use for a measured quantity a person enters with its unit: a weight, a height, a dose, a volume.
- Use where the allowed range depends on the unit, so the limits follow the choice.
- Use with one unit to show the unit beside the number and submit it with the form.

## When Not to Use

- Do not use for a plain count with no unit — use `number-input`.
- Do not use to show a measured value — use `observation-view` or `measurement-instance-view`.
- Do not use to choose a unit system for a whole page — use `measurement-system-input`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.quantity-input-div` class hook and its `-magnitude` and `-unit` parts, and every word.

## Styles

`.quantity-input-div`, `.quantity-input-div-magnitude`, `.quantity-input-div-unit`.

## Testing

- The number takes the chosen unit's limits and keeps its value when the unit changes
- One unit is text linked by `aria-describedby`, with a hidden field
- The fields are named from `name`, and a form reset restores both values

## Advice

- Use UCUM codes as unit values (`kg`, `[lb_av]`, `mmol/L`) and the reader's words as labels.
- Lily converts nothing: if the record needs one unit, convert in your code and say so to the reader.
- A browser's `type="number"` does not accept a decimal comma everywhere; for a locale that writes one, see the healthcare guide's formatted-number pattern.

## Related components

- `number-input` — a number with no unit
- `measurement-unit-input` — a unit on its own
- `observation-view` — a measured value shown with its unit and range

## Known limitations

None known.

## References

- openEHR DV_QUANTITY: https://specifications.openehr.org/releases/RM/latest/data_types.html
- UCUM: https://ucum.org/
- WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/
- Spec: spec/lessons/openehr/index.md

---

Lily™ and Lily Design System™ are trademarks.
