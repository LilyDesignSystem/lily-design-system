# Radio Group

RadioGroup is a headless fieldset container that groups related radio buttons under the ARIA `radiogroup` role. It provides an accessible label for the entire group, enabling screen readers and assistive technologies to communicate the relationship between individual radio buttons.

Use RadioGroup when you need a set of mutually exclusive options, such as selecting a size, choosing a shipping method, or picking a preference. The component wraps native radio inputs in a `<fieldset>` element, ensuring proper semantic grouping and accessibility without imposing any visual styling.

## Implementation Notes

- Renders a `<fieldset>` element with `role="radiogroup"` for explicit ARIA semantics
- The `aria-label` attribute on the fieldset provides an accessible name for the group
- Consumer provides radio button children (typically `<label>` elements wrapping `<input type="radio">`)
- Spreads `restProps` onto the fieldset for consumer customization
- No internal state management; radio selection is handled by native radio input behavior

## Props

- `label`: string (required) -- accessible label for the radio group, applied via `aria-label`
- `children`: slot (required) -- radio button elements to render inside the fieldset
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Usage

```html
<Fieldset legend="Do you know your NHS number?">
  <RadioGroup name="nhs-number-known">
    <RadioInput label="Yes, I know my NHS number" value="yes" />
    <RadioInput label="No, I do not know my NHS number" value="no" />
    <RadioInput label="I am not sure" value="unsure" />
  </RadioGroup>
</Fieldset>
```

## Keyboard Interactions

- Tab: Moves focus into the radio group; within the group, arrow keys move between radio buttons (native browser behavior)
- Arrow Up / Arrow Down: Moves selection between radio buttons within the group (native radio behavior)
- Space: Selects the focused radio button (native radio behavior)

## ARIA

- `role="radiogroup"` -- identifies the fieldset as a group of radio buttons
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose

## When to Use

- Use to wrap multiple RadioInput components that share a common name and enforce single-selection behaviour
- Use within a Fieldset so the group has a descriptive legend for accessibility
- Use when the form needs to track which single option is selected from the set
- Use when all options should be visible at once so users can compare them

## When Not to Use

- Do not use when users may select more than one option -- use CheckboxGroup with CheckboxInput instead
- Do not use for visual-only grouping -- use Fieldset alone if no shared selection state is needed
- Do not use with only one radio -- a single option is not a meaningful choice

## Headless

The RadioGroup headless component provides a `<fieldset>` with `role="radiogroup"` and `aria-label` for accessible group naming. It relies on native radio input behavior for selection and keyboard navigation. The consumer provides all visual styling for the fieldset, labels, and radio buttons.


## Styles

The consumer provides all CSS styling. The component renders with a `.radio-group` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `radio-group`
- Verify role="radiogroup"` -- identifies the fieldset as a group of radio buttons
- Verify aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Stack radio options vertically for readability, and use clear labels that distinguish each choice without ambiguity.
- **Developers**: Ensure all radio inputs within the group share the same `name` attribute for proper mutual exclusion, and pre-select a sensible default when appropriate.

## Composition

RadioGroup is the container for RadioInput children. Use `<RadioGroup>` to wrap multiple `<RadioInput>` elements, providing the group-level accessible label while each RadioInput carries its own option label.

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
- WAI-ARIA Authoring Practices - Radio Group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
