# Vital Sign Belly Circumference As Cm Input

VitalSignBellyCircumferenceAsCmInput is a headless numeric input for entering a belly circumference value in centimetres. It wraps a native `<input type="number">` with accessible labelling and sensible defaults (min 0, max 300, step 1). It is the editable companion to VitalSignBellyCircumferenceAsCmView.

This component is useful for patient intake forms, health assessments, fitness trackers, and medical records.

## Implementation Notes

- Renders a bare `<input type="number">` element with no wrapper
- Uses `aria-label` for accessible naming
- Default min=0, max=300, step=1
- Supports two-way binding on the `value` prop
- Spreads `restProps` onto the `<input>` element

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `value`: number | undefined (default: undefined) -- bindable belly circumference value
- `min`: number (default: 0) -- minimum allowed value
- `max`: number (default: 300) -- maximum allowed value
- `step`: number (default: 1) -- increment/decrement step size
- `required`: boolean (default: false) -- whether the input is required
- `disabled`: boolean (default: false) -- whether the input is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Usage

```html
<!-- Basic belly circumference input in a clinical form -->
<VitalSignBellyCircumferenceAsCmInput label="Belly circumference (cm)" value={90} />

<!-- Required field in a patient intake form -->
<VitalSignBellyCircumferenceAsCmInput label="Belly circumference" value={bellyCircumference} required />

<!-- Within a vital signs group -->
<VitalSignBellyCircumferenceAsCmInput label="Belly circumference (cm)" value={value} min={30} max={200} />
```

## Keyboard Interactions

- Up Arrow: increment value by step (native browser behavior)
- Down Arrow: decrement value by step (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name
- Implicit spinbutton role from `<input type="number">`

## When to Use

- Use in clinical forms to record a patient's belly circumference measurement in centimetres.
- Use with the default min/max/step constraints (0-300, step 1) for standard integer centimetre entry.
- Use within a vital signs group or patient intake workflow where belly circumference needs to be captured.
- Use in health assessments, fitness trackers, and metabolic risk screening forms.

## When Not to Use

- Do not use for displaying recorded values -- use VitalSignBellyCircumferenceAsCmView instead.
- Do not use for general number input -- use NumberInput for non-clinical numeric values.
- Do not use for measurements outside the vital sign domain -- use MeasurementInstanceInput for generic measurements.

## Headless

This headless component provides a bare `<input type="number">` with `aria-label` and domain-specific min/max/step. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.vital-sign-belly-circumference-as-cm-input` class for targeting.

## Testing

- Verify renders an `<input>` with class and type="number"
- Verify `aria-label` is set from the label prop
- Verify min, max, step defaults
- Verify value binding works

## References

- HTML number input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number
- WAI-ARIA spinbutton role: https://www.w3.org/TR/wai-aria-1.2/#spinbutton
