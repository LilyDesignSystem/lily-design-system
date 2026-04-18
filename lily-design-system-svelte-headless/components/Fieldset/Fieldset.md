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
- `children`: Snippet (required) -- grouped form controls

## Usage

```svelte
<Fieldset legend="Contact info">
  <label>Email <input type="email" /></label>
  <label>Phone <input type="tel" /></label>
</Fieldset>
```

```svelte
<Fieldset legend="Shipping address" disabled={usesBillingAddress}>
  <label>Street <input type="text" /></label>
  <label>City <input type="text" /></label>
</Fieldset>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard interactions are determined by the consumer-provided child form controls.

## ARIA

- No custom ARIA attributes required -- native `<fieldset>` and `<legend>` elements provide built-in group semantics and labeling for screen readers

## References

- HTML Specification fieldset: https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element
