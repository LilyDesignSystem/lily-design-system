# Vital Sign Total Sleep Time As Min Per Day Input

VitalSignTotalSleepTimeAsMinPerDayInput is a headless component that renders a `<input type="number">` element for entering total sleep time in minutes per day. This measures the total duration of sleep within a 24-hour period.

Use this component in health record forms, wellness tracking interfaces, or any context where total sleep time data entry is needed.

## Implementation Notes

- Renders a native `<input type="number">` element
- Uses `aria-label` for an accessible name describing the input purpose
- The `value` prop uses two-way binding with an initial empty string state
- Default `min` is 0, `max` is 1440, `step` is 1 (integers, minutes)
- Supports `required` and `disabled` boolean states
- Spreads `restProps` onto the input for consumer customization

## Props

- `label`: string (required) -- accessible name for the input via `aria-label`
- `value`: number | string (default: `""`) -- current value; bindable with two-way binding
- `min`: number (default: `0`) -- minimum valid value
- `max`: number (default: `1440`) -- maximum valid value (24 hours in minutes)
- `step`: number (default: `1`) -- step increment (integers, minutes)
- `required`: boolean (default: `false`) -- whether the input is required
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<!-- Basic total sleep time input -->
<VitalSignTotalSleepTimeAsMinPerDayInput label="Total sleep time (min/day)" value={480} />

<!-- In a wellness tracking form -->
<VitalSignTotalSleepTimeAsMinPerDayInput label="Total sleep time (minutes)" value={totalSleepTime} required />

<!-- Alongside sleep score for a complete sleep assessment -->
<VitalSignSleepScoreAs0To100Input label="Sleep score" value={sleepScore} />
<VitalSignTotalSleepTimeAsMinPerDayInput label="Total sleep time (min)" value={sleepMinutes} />
```

## Keyboard Interactions

Standard number input keyboard interactions provided natively by `<input type="number">`.

## ARIA

- `aria-label={label}` -- provides an accessible name for the input

## When to Use

- Use in clinical forms to record a patient's total sleep time in minutes per day.
- Use with the default min/max/step constraints (0-1440, step 1) for standard integer minute entry.
- Use within wellness tracking workflows and sleep duration assessments.
- Use alongside VitalSignSleepScoreAs0To100Input for comprehensive sleep evaluation.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignTotalSleepTimeAsMinPerDayView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for sleep quality score -- use VitalSignSleepScoreAs0To100Input instead.

## Headless

This headless component renders an `<input type="number">` with `aria-label`, two-way bindable value, and domain-specific min/max/step defaults. The consumer provides all visual styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-total-sleep-time-as-min-per-day-input` class for targeting.

## Testing

- Verify the component renders an `<input>` element with `type="number"`
- Verify `aria-label` is set from the `label` prop
- Verify `min` defaults to 0, `max` to 1440, `step` to 1
- Verify `disabled` and `required` attributes propagate correctly

## Domain Knowledge

Total sleep time measures the total duration of sleep within a 24-hour period, measured in minutes. Adults typically need 420-540 minutes (7-9 hours) of sleep per day. Values are typically in the range of 0-1440 minutes (0-24 hours).

## Advice

- **Designers**: Ensure the input clearly indicates the unit is minutes per day. Consider adding a helper showing the hours:minutes equivalent.
- **Developers**: Use the companion VitalSignTotalSleepTimeAsMinPerDayView for read-only display.

## References

- MDN input type="number": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
