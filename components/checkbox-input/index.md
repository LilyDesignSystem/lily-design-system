# Checkbox Input

A checkbox input is a minimal headless wrapper around the native HTML `<input type="checkbox">` element. Unlike a Checkbox component which includes a wrapping `<label>`, CheckboxInput uses `aria-label` for accessibility, giving consumers full control over label placement and visual presentation.

This component is ideal when you need a bare checkbox that you will wrap in your own custom layout, such as placing the label to the left, using a custom indicator, or integrating into a complex form where label positioning must be controlled by the consumer.

## Implementation Notes

- Renders a single `<input type="checkbox">` element with no wrapper
- Uses `aria-label` for accessible naming instead of a wrapping `<label>` element
- Supports two-way binding on the `checked` prop
- Spreads `restProps` onto the input element for consumer extensibility

## Props

- `checked`: boolean (default: false) -- bindable boolean indicating whether the checkbox is checked
- `label`: string (required) -- accessible name applied via `aria-label`
- `disabled`: boolean (default: false) -- whether the checkbox is disabled
- `required`: boolean (default: false) -- whether the checkbox is required for form submission
- `name`: string (default: undefined) -- form field name attribute
- `id`: string (default: undefined) -- element id attribute
- `value`: string (default: undefined) -- value attribute for form submission
- `...restProps`: unknown -- additional attributes spread onto the input element

## Usage

```html
<Fieldset legend="What symptoms are you experiencing?">
  <Hint>Select all that apply</Hint>
  <CheckboxGroup>
    <CheckboxInput label="Headache" name="symptoms" value="headache" />
    <CheckboxInput label="Fever" name="symptoms" value="fever" />
    <CheckboxInput label="Cough" name="symptoms" value="cough" />
    <CheckboxInput label="Fatigue" name="symptoms" value="fatigue" />
  </CheckboxGroup>
</Fieldset>
```

```html
<CheckboxInput label="I agree to the terms and conditions" checked={agreed} required name="terms" value="yes" />
```

```html
<CheckboxInput label="Subscribe to newsletter" checked={subscribed} disabled={!hasEmail} />
```

## Keyboard Interactions

- Space: Toggles the checkbox checked state (native browser behavior)
- Tab: Moves focus to and from the checkbox (native browser behavior)

## ARIA

- `aria-label={label}` -- provides an accessible name for the checkbox since there is no visible `<label>` element

## When to Use

- Use when users need to select one or more options from a list of choices
- Use to toggle a single boolean option on or off, such as agreeing to terms or opting into communications
- Use within a Fieldset with a legend that describes the group as a whole
- Use with Hint text to provide guidance like "Select all options that apply to you"

## When Not to Use

- Do not use when users can only select one option — use RadioInput within a RadioGroup instead
- Do not use for toggling a visible on/off setting — use SwitchButton for immediate-effect toggles
- Do not pre-select checkbox options — users may miss questions or submit wrong answers
- Do not use outside of a CheckboxGroup when managing shared state across multiple checkboxes

## Headless

This headless CheckboxInput component provides a native `<input type="checkbox">` with `aria-label` for accessible naming, two-way binding on the `checked` prop, and support for `disabled`, `required`, and form attributes. The consumer provides all visual styling including custom checkbox indicators, colors, sizes, and label positioning.


## Styles

The consumer provides all CSS styling. The component renders with a `.checkbox-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `checkbox-input`
- Verify aria-label={label}` -- provides an accessible name for the checkbox since there is no visible `<label>` element
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure custom checkbox indicators have sufficient size (at least 24x24px touch target) and clear checked/unchecked states with adequate contrast.
- **Developers**: Use the `aria-label` prop to provide an accessible name. For visible labels, wrap the CheckboxInput in your own `<label>` element or use a separate linked label.

## References

- MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
- WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/checkbox/
