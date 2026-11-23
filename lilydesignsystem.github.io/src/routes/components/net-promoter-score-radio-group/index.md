# Net Promoter Score Radio Group

NetPromoterScoreRadioGroup is a headless `<fieldset role="radiogroup">` for choosing a 0-10 Net Promoter Score, holding the `NetPromoterScoreRadioInput` radios the consumer composes, with whatever labels and layout the consumer writes. It replaces the earlier `net-promoter-score-picker` (removed 2026-11-15).

**Status:** experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders a `<fieldset>` with `role="radiogroup"` and `aria-label`
- The consumer supplies one `NetPromoterScoreRadioInput` per value (`0` to `10`); the group renders no option text of its own
- Selection, the arrow keys, form submission and form reset are native radio behaviour, so the group keeps no state
- Spreads `restProps` onto the fieldset, so `disabled`, `id` or `data-*` pass through

## Props

- `label`: string (required) -- accessible name for the group
- `children`: slot (required) -- the `NetPromoterScoreRadioInput` elements
- `...restProps`: any additional HTML attributes spread onto the fieldset

## Usage

```svelte
<NetPromoterScoreRadioGroup label="How likely are you to recommend us to a friend?">
  <NetPromoterScoreRadioInput
    value="0"
    label="0"
    name="score"
  />
  <NetPromoterScoreRadioInput
    value="1"
    label="1"
    name="score"
  />
  <NetPromoterScoreRadioInput
    value="2"
    label="2"
    name="score"
  />
</NetPromoterScoreRadioGroup>
```

It renders:

```html
<fieldset
  class="net-promoter-score-radio-group"
  role="radiogroup"
  aria-label="How likely are you to recommend us to a friend?"
>
  <input
    class="net-promoter-score-radio-input"
    type="radio"
    aria-label="0"
    name="score"
    value="0"
    data-value="0"
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
- Do not use for a read-only display -- use [NetPromoterScoreView](../net-promoter-score-view/) instead.
- Do not use for a plain set of choices with no status or rating meaning -- use [RadioGroup](../radio-group/) instead.
- **Misuse:** asking again and again after a "no", blocking the task until it is answered, or showing it at the moment of a failure. The question is optional and dismissable, and never interrupts a task (WCAG 2.2.4 Interruptions).

## Headless

The NetPromoterScoreRadioGroup headless component provides a `<fieldset>` with `role="radiogroup"` and `aria-label`. It relies on native radio behaviour for selection and the keyboard. The consumer provides all visual styling, including any colour coding.

## Styles

The consumer provides all CSS styling. The component renders with a `.net-promoter-score-radio-group` class for targeting; each radio carries `.net-promoter-score-radio-input` and `data-value`. No default styles are included — this is a fully headless component.

## Testing

- Verify the component renders a `<fieldset>` element with class `net-promoter-score-radio-group` and `role="radiogroup"`
- Verify the group is named by `aria-label`
- Verify the consumer's radios render inside it
- Verify pass-through attributes are applied

## Advice

- **Designers**: Give every option visible text as well as its colour or icon; colour alone fails people with colour vision deficiencies.
- **Developers**: Give every `NetPromoterScoreRadioInput` the same `name`, so the browser treats them as one group for the arrow keys and form submission.

## Related components

- `net-promoter-score-radio-input` — a radio input for one choice of a 0-10 Net Promoter Score <input type="radio">
- `net-promoter-score-view` — the read-only display
- `radio-group` — the general radio group

## Known limitations

None known.

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score

---

Lily™ and Lily Design System™ are trademarks.
