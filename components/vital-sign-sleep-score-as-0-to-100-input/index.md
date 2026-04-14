# Vital Sign Sleep Score As 0 To 100 Input

VitalSignSleepScoreAs0To100Input is a headless component that renders a `<input type="number">` element for entering a sleep score value. The sleep score ranges from 0 to 100, representing overall sleep quality.

Use this component in health record forms, wellness tracking interfaces, or any context where sleep score data entry is needed.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial empty string state
- Default `min` is 0, `max` is 100, `step` is 1 (integers)
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | string (default: `""`) -- current value; bindable with two-way binding
- `min`: number (default: `0`) -- minimum valid value
- `max`: number (default: `100`) -- maximum valid value
- `step`: number (default: `1`) -- step increment (integers)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic sleep score input -->
<VitalSignSleepScoreAs0To100Input label="Sleep score (0-100)" value={82} />

<!-- In a wellness tracking form -->
<VitalSignSleepScoreAs0To100Input label="Sleep score" value={score} required />

<!-- Alongside total sleep time for a complete sleep assessment -->
<VitalSignSleepScoreAs0To100Input label="Sleep score" value={sleepScore} />
<VitalSignTotalSleepTimeAsMinPerDayInput label="Total sleep time (min)" value={sleepMinutes} />
```

## Keyboard Interactions

Standard number input keyboard interactions provided natively by `<input type="number">`.

## ARIA

- `aria-label={label}` -- provides an accessible name for the input

## When to Use

- Use in clinical forms to record a patient's sleep score measurement (0-100 range).
- Use with the default min/max/step constraints (0-100, step 1) for standard integer entry.
- Use within wellness tracking workflows and sleep quality assessments.
- Use alongside VitalSignTotalSleepTimeAsMinPerDayInput for comprehensive sleep evaluation.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignSleepScoreAs0To100View instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for total sleep duration -- use VitalSignTotalSleepTimeAsMinPerDayInput instead.

## Headless

This headless component renders an `<input type="number">` with `aria-label`, two-way bindable value, and domain-specific min/max/step defaults. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-sleep-score-as-0-to-100-input` class for targeting.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify `min` defaults to 0, `max` to 100, `step` to 1
- Verify `disabled` and `required` attributes propagate correctly

## Domain Knowledge

Sleep score is a composite metric (0-100) that represents overall sleep quality, typically derived from sleep duration, efficiency, restfulness, and sleep stages. Higher scores indicate better sleep quality.

## Advice

- **Designers**: Ensure the input clearly indicates the valid range (0-100) through labels or placeholder text.
- **Developers**: Use the companion VitalSignSleepScoreAs0To100View for read-only display.

## References

- MDN input type="number": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
