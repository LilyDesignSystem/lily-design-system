# Numeric Rating Scale Picker

NumericRatingScalePicker is a headless 0 to 10 rating, such as a numeric pain rating scale: a `<fieldset>` whose `<legend>` names the question, one native radio per whole number, and the consumer's words for each end. Lily ships no anchor words and is not a validated instrument; the wording and its validation are the consumer's.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<fieldset class="numeric-rating-scale-picker">` with a `<legend>`, and one radio per number from `min` (default 0) to `max` (default 10)
- `minLabel` and `maxLabel` are shown and linked to the end radios with `aria-describedby`
- `required` makes the group need an answer (on the first radio, as native radio groups do)
- Form reset restores the first value

## Props

- `label`: string (required) — the question, rendered as the `<legend>`
- `min`: number (optional) — the lowest value, default 0
- `max`: number (optional) — the highest value, default 10
- `minLabel`: string (optional) — the words for the lowest value
- `maxLabel`: string (optional) — the words for the highest value
- `value`: string (optional) — the chosen value (bindable or controlled)
- `name`: string (optional) — the radios' form name, default `rating`
- `required`: boolean (optional) — the form needs an answer
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<NumericRatingScalePicker
  label="How bad is your pain now?"
  minLabel="No pain"
  maxLabel="Worst pain imaginable"
  name="pain"
/>
```

## Keyboard Interactions

| Key        | Action                                                 |
| ---------- | ------------------------------------------------------ |
| Tab        | Moves into the group, to the chosen radio or the first |
| Arrow keys | Move to the next or previous number and choose it      |

## ARIA

- A native `<fieldset>` named by its `<legend>`; each radio is named by its number; the end radios are described by the anchor words

## When to Use

- Use for a 0 to 10 numeric rating, such as pain intensity, with anchor words at each end.
- Use where each number must be its own choice, reachable by keyboard.

## When Not to Use

- Do not use for a Net Promoter Score — use `net-promoter-score-picker`.
- Do not use for a face scale — faces need a licensed instrument; `five-face-rating-picker` is a satisfaction scale, not a pain scale.
- Do not use for a free number — use `number-input`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.numeric-rating-scale-picker` class hook, and every word.

## Styles

`.numeric-rating-scale-picker` and its parts.

## Testing

- The legend names the group, and there is one radio per number
- The end radios are described by the anchor words
- The arrow keys move and choose

## Advice

- Use the exact wording of the instrument your service has validated, translated by the people who validated it.
- Do not colour the numbers from green to red; meaning must not be colour alone.

## Related components

- `net-promoter-score-picker` — a picker for selecting a 0-10 Net Promoter Score
- `radio-group` — a group of radio inputs

## References

- Spec: spec/healthcare-ui/index.md

---

Lily™ and Lily Design System™ are trademarks.
