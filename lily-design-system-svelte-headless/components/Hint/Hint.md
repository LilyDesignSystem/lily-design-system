# Hint

A hint provides subtle, contextual guidance text associated with a form control. It is typically displayed near an input field to clarify expected formats, explain functionality, or offer examples. The component renders a `<p>` element with an optional `id` for linking to a form control via `aria-describedby`.

This component is designed to work alongside form inputs where the consumer links the hint to the input using `aria-describedby` on the input element pointing to the hint's `id`. This ensures screen readers announce the hint text when the user focuses the associated input.

## Implementation Notes

- Renders a `<p>` element containing the children snippet
- Accepts an optional `id` prop for `aria-describedby` linking with form controls
- Spreads `restProps` onto the `<p>` for consumer customization
- The consumer is responsible for adding `aria-describedby` to the associated input

## Props

- `id`: string (default: undefined) -- ID for linking via `aria-describedby` on the associated form control
- `children`: Snippet (required) -- hint text content

## Usage

```svelte
<Hint id="email-hint">Enter your work email</Hint>
<input aria-describedby="email-hint" />
```

```svelte
<Hint id="password-hint">Must be at least 8 characters</Hint>
<input type="password" aria-describedby="password-hint" />
```

## Keyboard Interactions

None -- this component is a passive text element. It is announced by screen readers when the associated form control receives focus.

## ARIA

- `id={id}` -- provides a target for `aria-describedby` on the associated form control

## References

- WAI Forms Tutorial - Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/
