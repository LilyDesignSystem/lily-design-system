# Fieldset

A fieldset groups related form elements together using the native `<fieldset>` and `<legend>` HTML elements. This provides both a visual grouping and a semantic association that screen readers announce when users navigate into the group, helping them understand the context of related inputs.

The component supports a `disabled` prop that disables all child form controls at once, making it useful for sections of a form that should be conditionally editable. The legend text describes the purpose of the grouped controls.

## Implementation Notes

- Uses native `<fieldset>` element with a `<legend>` child for semantic form grouping
- The `disabled` attribute on `<fieldset>` natively disables all descendant form controls
- Spreads `restProps` onto the `<fieldset>` element for consumer customization
- No custom ARIA needed because native elements handle group semantics

## Props

- `legend`: string (required) -- text for the `<legend>` element describing the group
- `disabled`: boolean (default: false) -- whether all controls in the fieldset are disabled
- `children`: slot (required) -- grouped form controls

## Usage

```html
<Fieldset legend="What is your address?">
  <Field label="Address line 1">
    <TextInput label="Address line 1" autocomplete="address-line1" />
  </Field>
  <Field label="Address line 2 (optional)">
    <TextInput label="Address line 2" autocomplete="address-line2" />
  </Field>
  <Field label="Town or city">
    <TextInput label="Town or city" autocomplete="address-level2" />
  </Field>
  <Field label="Postcode">
    <TextInput label="Postcode" autocomplete="postal-code" />
  </Field>
</Fieldset>
```

```html
<Fieldset legend="What is your date of birth?">
  <Hint>For example, 15 3 1984</Hint>
  <DateInput label="Date of birth" />
</Fieldset>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard interactions are determined by the consumer-provided child form controls.

## ARIA

- No custom ARIA attributes required -- native `<fieldset>` and `<legend>` elements provide built-in group semantics and labeling for screen readers

## When to Use

- Use to group related form inputs that answer the same question, such as date fields (day, month, year) or address lines.
- Use with a `<legend>` as the first child element to describe the group -- this is essential for screen reader users.
- Use when a question on the page applies to multiple inputs that need to be understood as a set.
- Use with the legend as the page heading (`<h1>` inside `<legend>`) when asking one question per page.
- Use when the `disabled` attribute should cascade to all child form controls at once.

## When Not to Use

- Do not use to group unrelated inputs -- only inputs that share a common question or purpose belong together.
- Do not use for a single input that already has its own label -- use Field with Label instead.
- Do not use for visual-only grouping without semantic meaning -- use a `<div>` or layout component instead.

## Headless

This headless component provides native `<fieldset>` and `<legend>` elements with built-in group semantics for screen readers. The `disabled` attribute natively disables all descendant form controls. The consumer provides all visual styling for the fieldset border, legend appearance, and internal layout.


## Styles

The consumer provides all CSS styling. The component renders with a `.fieldset` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<fieldset>` element with class `fieldset`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style the fieldset border and legend consistently. Use the legend text to clearly describe the purpose of the grouped fields (e.g., "Shipping address").
- **Developers**: Use the `disabled` prop to conditionally disable an entire section of the form (e.g., when "same as billing" is checked). No custom ARIA is needed because native elements handle semantics.

## Composition

Fieldset groups multiple Field components together. Each Field wraps a label and input, and Fieldset provides the semantic group boundary with a legend. Use Fieldset inside a Form for well-structured form layouts.

## References

- HTML Specification fieldset: https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element
