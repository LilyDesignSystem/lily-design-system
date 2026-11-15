# Five Star Rating Radio Group

FiveStarRatingRadioGroup is a headless `<fieldset role="radiogroup">` for choosing a 1-5 star rating, holding the `FiveStarRatingRadioInput` radios the consumer composes, with whatever labels and layout the consumer writes. It replaces the earlier `five-star-rating-picker` (removed 2026-11-15).

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` and `aria-label`
- The consumer supplies one `FiveStarRatingRadioInput` per value (`1` to `5`); the group renders no option text of its own
- Selection, the arrow keys, form submission and form reset are native radio behaviour, so the group keeps no state
- Spreads `restProps` onto the fieldset, so `disabled`, `id` or `data-*` pass through

## Props

- `label`: string (required) -- accessible name for the group
- `children`: slot (required) -- the `FiveStarRatingRadioInput` elements
- `...restProps`: any additional HTML attributes spread onto the fieldset

## Usage

```svelte
<FiveStarRatingRadioGroup label="Rate this service">
  <FiveStarRatingRadioInput
    value="1"
    label="1 star"
    name="rating"
  />
  <FiveStarRatingRadioInput
    value="2"
    label="2 stars"
    name="rating"
  />
  <FiveStarRatingRadioInput
    value="3"
    label="3 stars"
    name="rating"
  />
</FiveStarRatingRadioGroup>
```

It renders:

```html
<fieldset
  class="five-star-rating-radio-group"
  role="radiogroup"
  aria-label="Rate this service"
>
  <input
    class="five-star-rating-radio-input"
    type="radio"
    aria-label="1 star"
    name="rating"
    value="1"
    data-value="1"
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

- Do not use when more than one option may be chosen -- use [CheckboxGroup](../checkbox-group/) instead.
- Do not use for a read-only display -- use [FiveStarRatingView](../five-star-rating-view/) instead.
- Do not use for a plain set of choices with no status or rating meaning -- use [RadioGroup](../radio-group/) instead.

## Headless

The FiveStarRatingRadioGroup headless component provides a `<fieldset>` with `role="radiogroup"` and `aria-label`. It relies on native radio behaviour for selection and the keyboard. The consumer provides all visual styling, including any colour coding.

## Styles

The consumer provides all CSS styling. The component renders with a `.five-star-rating-radio-group` class for targeting; each radio carries `.five-star-rating-radio-input` and `data-value`. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `five-star-rating-radio-group` and `role="radiogroup"`
- Verify the group is named by `aria-label`
- Verify the consumer's radios render inside it
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give every option visible text as well as its colour or icon; colour alone fails people with colour vision deficiencies.
- **Developers**: Give every `FiveStarRatingRadioInput` the same `name`, so the browser treats them as one group for the arrow keys and form submission.

## Related components

- `five-star-rating-radio-input` — a radio input for one choice of a 1-5 star rating <input type="radio">
- `five-star-rating-view` — the read-only display
- `radio-group` — the general radio group

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Star rating: https://www.w3.org/WAI/tutorials/forms/custom-controls/

---

Lily™ and Lily Design System™ are trademarks.
