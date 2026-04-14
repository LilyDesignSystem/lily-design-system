# Hidden Input

HiddenInput is a headless component that renders a native `<input type="hidden">` element for passing data in forms that should not be visible or editable by the user. It provides a simple, type-safe way to include hidden form values such as CSRF tokens, record IDs, or other metadata that must be submitted with a form.

This component is useful whenever a form needs to carry data that the user should not see or modify directly. The hidden input participates in form submission but has no visual presence, no keyboard interaction, and no ARIA requirements since it is not perceivable.

## Implementation Notes

- Renders a native `<input type="hidden">` element
- Requires a `name` prop for the form field name
- The `value` prop defaults to an empty string
- Spreads `restProps` onto the input for consumer customization (e.g., `id`, `data-*` attributes)
- No ARIA attributes needed because hidden inputs are not perceivable by any user

## Props

- `name`: string (required) -- the form field name attribute
- `value`: string (default: `""`) -- the hidden input value
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

CSRF token included in a form:

```html
<Form label="Update settings" onsubmit={save}>
  <HiddenInput name="_csrf" value={csrfToken} />
  <Field label="Display name">
    <TextInput label="Display name" value={displayName} />
  </Field>
  <SubmitInput value="Save" />
</Form>
```

Record ID for an update operation:

```html
<HiddenInput name="recordId" value={patient.id} />
```

## Keyboard Interactions

None -- hidden inputs are not visible or focusable and have no keyboard interaction.

## ARIA

None -- hidden inputs are not perceivable by users or assistive technologies, so no ARIA attributes are needed.

## When to Use

- Use to include data in form submission that should not be visible to the user, such as CSRF tokens or record IDs.
- Use when the form needs to carry tracking metadata, session identifiers, or pre-set values.
- Use for any non-visible data that must be submitted with the form.

## When Not to Use

- Do not use for fields that users should see or edit -- use a standard Input component instead.
- Do not use for sensitive data that should not be in the DOM, as hidden inputs can be inspected by users.

## Headless

This headless component provides a native `<input type="hidden">` element with `name` and `value` attributes for form submission. No ARIA or visual styling is needed because hidden inputs are not perceivable by any user or assistive technology.


## Styles

The consumer provides all CSS styling. The component renders with a `.hidden-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `hidden-input`
- Verify pass-through attributes are applied

## Advice

- **Designers**: No visual design is needed -- hidden inputs have no visual presence. Document which hidden values your forms require so developers include them.
- **Developers**: Always set the `name` prop for form submission. Never store sensitive data in hidden inputs that could be inspected or modified by the user.

## References

- HTML hidden input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/hidden
