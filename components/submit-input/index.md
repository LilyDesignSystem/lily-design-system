# Submit Input

A submit input is a UI/UX component that provides a form submission button using the native HTML `<input type="submit">` element. When clicked within a form, it triggers the form's submit event. The component supports custom button text through the value prop and can be disabled to prevent premature submission.

Submit inputs provide a simple, semantic way to add form submission capability that works with the browser's built-in form handling. They are the standard mechanism for triggering form validation and submission in HTML forms.

## Implementation Notes

- Renders a single `<input type="submit">` element for native form submission behavior
- The browser automatically triggers the containing form's `submit` event when clicked
- Default button text is "Submit", configurable via the `value` prop
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `class`)
- No ARIA attributes needed beyond the native semantics of `<input type="submit">`
- When used within a form, clicking this input also triggers built-in browser validation

## Props

- `value`: string (default: "Submit") -- the visible button text
- `disabled`: boolean (default: false) -- whether the button is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

Form with a descriptive submit label:

```html
<Form label="Contact us" onsubmit={handleSubmit}>
  <Field label="Message" required>
    <Textarea label="Message" value={message} required />
  </Field>
  <SubmitInput value="Send message" />
</Form>
```

Disabled submit until form is valid:

```html
<SubmitInput value="Save changes" disabled={!formValid} />
```

Simple submit with default label:

```html
<SubmitInput />
```

## Keyboard Interactions

- Enter: activates the submit button
- Space: activates the submit button

Note: keyboard interactions are provided natively by the `<input type="submit">` element.

## ARIA

No additional ARIA attributes are needed. The native `<input type="submit">` element has an implicit `button` role and the `value` attribute serves as its accessible name.

## When to Use

- Use as a form-native submit button via `<input type="submit">`.
- Use when a plain text label is sufficient for the submission action.
- Use as the primary submission trigger inside HTML forms to trigger built-in browser validation.

## When Not to Use

- Do not use when you need rich content inside the button (icons, multiple elements) -- use Button with `type="submit"` instead.
- Do not use for non-form actions -- use Button instead.
- Do not use when the button needs to show a loading spinner or other dynamic content.

## Headless

This headless component renders a native `<input type="submit">` element with configurable `value` text and `disabled` state. It provides built-in form submission and validation behavior with no additional ARIA needed. The consumer provides all visual styling including colors, padding, borders, and hover/focus states.


## Styles

The consumer provides all CSS styling. The component renders with a `.submit-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `submit-input`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use a clear, action-oriented label (e.g., "Save changes", "Send message") rather than generic text like "Submit". Visually distinguish the submit button from other form controls.
- **Developers**: Disable the submit button while the form is processing to prevent duplicate submissions. Place the SubmitInput at the end of the form for a logical tab order.

## References

- MDN input type="submit": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit
