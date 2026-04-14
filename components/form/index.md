# Form

A form component wraps a native HTML `<form>` element with accessible labeling, automatic submit default prevention, and reset support. It simplifies form handling by intercepting the submit event and calling `preventDefault()` before passing it to the consumer's callback, which is the most common pattern in single-page applications.

## Implementation Notes

- Renders a native `<form>` element with `aria-label` for accessible naming
- Automatically calls `event.preventDefault()` on submit before invoking the `onsubmit` callback
- Passes the raw `onreset` callback directly to the form (no default prevention)
- Accepts a `children` slot for form content (inputs, buttons, etc.)
- Spreads `restProps` for consumer customization

## Props

- `label`: string (required) -- accessible name for the form via `aria-label`
- `onsubmit`: function (default: `undefined`) -- callback receiving `SubmitEvent` (default already prevented)
- `onreset`: function (default: `undefined`) -- callback receiving `Event` on form reset
- `children`: slot (required) -- form content to render inside
- `...restProps`: unknown -- additional attributes spread onto the `<form>`

## Usage

Login form with email and password fields:

```html
<Form label="Sign in" onsubmit={handleLogin}>
  <Field label="Email" required>
    <EmailInput label="Email" value={email} required />
  </Field>
  <Field label="Password" required>
    <PasswordInput label="Password" value={password} required />
  </Field>
  <Button type="submit">Sign in</Button>
</Form>
```

Contact form with reset support:

```html
<Form label="Contact us" onsubmit={handleSubmit} onreset={handleReset}>
  <Field label="Name" required>
    <TextInput label="Name" value={name} required />
  </Field>
  <Field label="Message" required>
    <Textarea label="Message" value={message} required />
  </Field>
  <SubmitInput value="Send message" />
  <ResetInput value="Clear form" />
</Form>
```

## Keyboard Interactions

None beyond native form behavior -- Enter key submits the form when a text input is focused (browser default).

## ARIA

- `aria-label="..."` -- provides an accessible name for the form, helping screen readers identify its purpose

## When to Use

- Use as the top-level form element for collecting and submitting user data.
- Use with Field components for structured form layout.
- Use when you need automatic `preventDefault()` on submit, which is standard in single-page applications.
- Use to wrap any collection of form inputs that are submitted together as a unit.

## When Not to Use

- Do not use for read-only data display -- use SummaryList instead.
- Do not use for inline editing -- use EditableForm instead.
- Do not use to wrap unrelated input groups; use separate Form components for distinct submission actions.

## Headless

This headless component provides a native `<form>` element with `aria-label`, automatic submit default prevention, and reset support. The consumer provides all visual styling including layout, spacing, and button placement.


## Styles

The consumer provides all CSS styling. The component renders with a `.form` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<form>` element with class `form`
- Verify aria-label="..."` -- provides an accessible name for the form, helping screen readers identify its purpose
- Verify pass-through attributes are applied

## Advice

- **Designers**: Group related fields visually using spacing or Fieldset components. Place the primary submit button in a predictable location.
- **Developers**: Use the Form composition pattern: Form wraps Field components, which in turn wrap input components. Pair with ErrorSummary for validation feedback.

## Composition

Form uses the Form composition pattern: Form contains Field components, which wrap input components (TextInput, EmailInput, Select, etc.). Add ErrorSummary for validation errors and Button for submission actions.

## References

- MDN `<form>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
