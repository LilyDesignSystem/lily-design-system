# Label

A label is a UI component that provides a descriptive name or instruction for an associated form element, such as an input field, checkbox, or radio button. The Label component renders a semantic `<label>` HTML element that can be linked to a form control via the `for` attribute, enabling click-to-focus behavior and improving accessibility for screen reader users.

Properly associated labels are essential for form usability. When a user clicks the label text, the browser focuses or activates the linked form control. Screen readers announce the label when the associated control receives focus, ensuring users understand the purpose of each form field.

## Implementation Notes

- Renders a native `<label>` HTML element
- Uses the `for` prop (mapped from the reserved keyword via `for: forProp`) to associate with a form control by ID
- Content is provided via the `children` slot
- Rest props are spread onto the `<label>` element for consumer customization
- The `for` prop is optional, allowing labels to wrap their associated control directly

## Props

- `for`: string (optional) -- the `id` of the associated form control, rendered as the HTML `for` attribute
- `children`: slot (required) -- the label text content
- `...restProps`: unknown -- additional attributes spread onto the `<label>` element

## Usage

Label linked to a form control by ID:

```html
<Label for="patient-name">Patient name</Label>
<input id="patient-name" type="text" />
```

Label wrapping a checkbox (no `for` attribute needed):

```html
<Label>
  <input type="checkbox" /> I agree to the terms and conditions
</Label>
```

Label for a select dropdown:

```html
<Label for="country-select">Country</Label>
<select id="country-select">
  <option>United Kingdom</option>
  <option>Ireland</option>
</select>
```

## Keyboard Interactions

None -- this component is a passive form label. Clicking the label focuses or activates its associated form control via native browser behavior.

## ARIA

- The native `<label>` element with `for` attribute provides an implicit accessible name for the linked form control
- No additional ARIA attributes are needed because the semantic HTML `<label>` element is fully recognized by assistive technology

## When to Use

- Use to associate descriptive text with a form input via the `for` attribute.
- Use on every visible form field to provide a visible, accessible name.
- Use when you need click-to-focus behavior so clicking the label text activates the associated control.
- Use when building custom form layouts outside of the Field component.

## When Not to Use

- Do not use as a substitute for Hint -- labels name the field, hints explain how to fill it.
- Do not use for non-form text -- use a heading or paragraph instead.
- Do not use when the Field component already provides label rendering.

## Headless

This headless component renders a native `<label>` element with optional `for` attribute linking, providing built-in browser accessibility and click-to-focus behavior. The consumer provides all visual styling, including typography, spacing, required-field indicators, and layout relative to the associated control.


## Styles

The consumer provides all CSS styling. The component renders with a `.label` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<label>` element with class `label`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Position labels consistently relative to their controls (typically above or to the left) and visually indicate required fields with a marker such as an asterisk.
- **Developers**: Use the `for` prop to link the label to its control by ID, or wrap the control inside the label element. Avoid using `aria-label` as a substitute for a visible label.

## References

- WAI Forms Tutorial - Labels: https://www.w3.org/WAI/tutorials/forms/labels/
- HTML label element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
