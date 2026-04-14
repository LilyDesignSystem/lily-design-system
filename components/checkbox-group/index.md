# Checkbox Group

CheckboxGroup is a headless fieldset container that groups related checkboxes under the ARIA `group` role. It manages a collection of checkboxes with shared state, supporting a "Select all" checkbox with automatic indeterminate state, group-level disabled state, and two-way binding of selected values.

Use CheckboxGroup when you need multiple checkboxes that share a logical relationship, such as selecting features, choosing categories, or picking multiple items from a list. The component wraps native checkbox inputs in a `<fieldset>` element, ensuring proper semantic grouping and accessibility without imposing any visual styling.

## Implementation Notes

- Renders a `<fieldset>` element with `role="group"` for explicit ARIA semantics
- The `aria-label` attribute on the fieldset provides an accessible name for the group
- Consumer provides checkbox children (typically `<label>` elements wrapping `<input type="checkbox">`)
- Spreads `restProps` onto the fieldset for consumer customization
- No internal state management; checkbox selection is handled by native checkbox behavior
- Supports a "Select all" pattern where the consumer can add a checkbox that toggles all options, with automatic indeterminate state when some but not all options are selected

## Props

- `label`: string (required) -- accessible label for the checkbox group, applied via `aria-label`
- `children`: slot (required) -- checkbox elements to render inside the fieldset
- `disabled`: boolean (default: false) -- disables the entire group via the fieldset `disabled` attribute
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Usage

```html
<Fieldset legend="How would you like to be contacted?">
  <Hint>Select all that apply</Hint>
  <CheckboxGroup name="contact-methods">
    <CheckboxInput label="Email" value="email" />
    <CheckboxInput label="Phone" value="phone" />
    <CheckboxInput label="Text message" value="sms" />
  </CheckboxGroup>
</Fieldset>
```

```html
<CheckboxGroup label="Toppings" disabled>
  <CheckboxInput label="Cheese" name="toppings" value="cheese" />
  <CheckboxInput label="Peppers" name="toppings" value="peppers" />
</CheckboxGroup>
```

## Keyboard Interactions

- Tab: Moves focus between checkboxes within the group (native browser behavior)
- Space: Toggles the focused checkbox checked state (native browser behavior)

## ARIA

- `role="group"` -- identifies the fieldset as a group of related checkboxes
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose
- Native `<fieldset>` `disabled` attribute propagates disabled state to all child inputs

## When to Use

- Use to wrap multiple CheckboxInput components that share a common name and manage collective state
- Use within a Fieldset so the group has a descriptive legend for accessibility
- Use when the form needs to track which checkboxes are selected as a set

## When Not to Use

- Do not use for a single standalone checkbox — render CheckboxInput directly
- Do not use when only one option can be selected — use RadioGroup with RadioInput instead
- Do not use for visual-only grouping without shared state — use a Fieldset alone

## Headless

The CheckboxGroup headless component provides a `<fieldset>` with `role="group"`, `aria-label`, and an optional `disabled` attribute for group-level disabling. It relies on native checkbox behavior for selection and keyboard navigation. The consumer provides all visual styling for the fieldset, labels, checkboxes, and indeterminate state indicators.

## Styles

The consumer provides all CSS styling. The component renders with a `.checkbox-group` class for targeting. Common styling concerns include layout (vertical vs. horizontal stacking), spacing between items, disabled opacity, and custom checkbox indicators.

## Testing

- Verify the component renders a `<fieldset>` element with `role="group"`
- Verify `aria-label` is set from the `label` prop
- Verify child checkbox inputs render inside the fieldset
- Verify the `disabled` attribute propagates to child inputs when set on the group
- Verify pass-through attributes are applied to the fieldset

## Advice

- **Designers**: Stack checkbox options vertically for readability. Provide clear labels and ensure adequate spacing between items. When using "Select all," place it visually before the individual options and use an indeterminate indicator when only some items are selected.
- **Developers**: Use the native `<fieldset>` `disabled` attribute for group-level disabling. For "Select all" behavior, manage the indeterminate state in your application logic by comparing the number of selected items to the total. Ensure all checkboxes within the group share the same `name` attribute for proper form submission.

## Composition

CheckboxGroup is the container for CheckboxInput children. Use `<CheckboxGroup>` to wrap multiple `<CheckboxInput>` elements or native `<input type="checkbox">` elements, providing the group-level accessible label and optional disabled state while each checkbox carries its own option label.

## References

- WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/checkbox/
- WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group
- WAI-ARIA Authoring Practices - Checkbox: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
