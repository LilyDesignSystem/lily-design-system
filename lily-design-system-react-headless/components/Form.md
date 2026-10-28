# Form

A form component wraps a native HTML `<form>` element with accessible labeling, automatic submit default prevention, and reset support. It simplifies form handling by intercepting the submit event and calling `preventDefault()` before passing it to the consumer's callback, which is the most common pattern in single-page applications.

## Implementation Notes

- Renders a native `<form>` element with `aria-label` for accessible naming
- Automatically calls `event.preventDefault()` on submit before invoking the `onSubmit` callback
- Passes the raw `onReset` callback directly to the form (no default prevention)
- Accepts a `children` ReactNode for form content (inputs, buttons, etc.)
- Spreads `restProps` for consumer customization

## Props

- `label`: string (required) -- accessible name for the form via `aria-label`
- `onSubmit`: function (default: `undefined`) -- callback receiving `SubmitEvent` (default already prevented)
- `onReset`: function (default: `undefined`) -- callback receiving `Event` on form reset
- `children`: ReactNode (required) -- form content to render inside
- `...restProps`: unknown -- additional attributes spread onto the `<form>`

## Usage

```tsx
<Form
  label="Login"
  onSubmit={handleLogin}
>
  <input name="email" />
  <button type="submit">Sign in</button>
</Form>
```

## Keyboard Interactions

None beyond native form behavior -- Enter key submits the form when a text input is focused (browser default).

## ARIA

- `aria-label="..."` -- provides an accessible name for the form, helping screen readers identify its purpose

## References

- MDN `<form>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
