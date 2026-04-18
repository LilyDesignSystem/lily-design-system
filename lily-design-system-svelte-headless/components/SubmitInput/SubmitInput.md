# SubmitInput

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

```svelte
<SubmitInput />
```

```svelte
<SubmitInput value="Send" />
```

```svelte
<SubmitInput value="Save changes" disabled={!formValid} />
```

## Keyboard Interactions

- Enter: activates the submit button
- Space: activates the submit button

Note: keyboard interactions are provided natively by the `<input type="submit">` element.

## ARIA

No additional ARIA attributes are needed. The native `<input type="submit">` element has an implicit `button` role and the `value` attribute serves as its accessible name.

## References

- MDN input type="submit": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit
