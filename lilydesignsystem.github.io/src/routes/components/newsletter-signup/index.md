# Newsletter Signup

A newsletter signup is a small `<form>` composition that collects an email
address for subscription. It supports four explicit states — idle,
submitting, success, and error — surfaced as `data-state` and reflected in
the input/button disabled state and live-region messages.

Use it in marketing footers, blog sidebars, splash pages, and dedicated
subscription landing pages.

## Implementation Notes

- Uses a native `<form>` element with `aria-label` describing the form's purpose
- `state` is exposed as `data-state` and gates `disabled` on the email input and submit button (when "submitting")
- Success message uses `role="status"` + `aria-live="polite"` so screen readers announce non-disruptive confirmation
- Error message uses `role="alert"` so screen readers announce errors immediately
- Both messages are conditionally `hidden` based on `state`
- All visible strings (heading, description, email label, submit label, success/error) are provided as props for i18n
- Submit handling is delegated to the consumer via `onSubmit` / `onsubmit`

## Props

- `label`: string (**required**) -- aria-label for the form
- `heading`: string (optional) -- visible heading
- `description`: string (optional) -- body text below the heading
- `emailLabel`: string (**required**) -- visible label for the email input
- `emailPlaceholder`: string (optional)
- `submitLabel`: string (**required**) -- submit button text
- `state`: "idle" | "submitting" | "success" | "error" (default: "idle")
- `successMessage`: string (optional) -- confirmation message when state is "success"
- `errorMessage`: string (optional) -- error message when state is "error"
- `onSubmit` / `onsubmit`: callback (optional) -- submit handler
- `...restProps`: any additional HTML attributes

## Usage

Idle state with heading and description:

```html
<NewsletterSignup
  label="Subscribe to the newsletter"
  heading="Stay in the loop"
  description="One email per week, no spam."
  emailLabel="Email address"
  submitLabel="Subscribe"
  onsubmit={handleSubmit}
/>
```

Success state:

```html
<NewsletterSignup
  label="Subscribe to the newsletter"
  emailLabel="Email address"
  submitLabel="Subscribe"
  state="success"
  successMessage="Thanks! Please check your inbox to confirm."
/>
```

## Keyboard Interactions

- Tab: Move focus through the email input and submit button
- Enter inside the email input: Submit the form
- (All handled natively by `<form>`, `<input>`, and `<button>`)

## ARIA

- `aria-label` on the `<form>` provides the form's accessible name
- `data-state` reflects the current state ("idle" | "submitting" | "success" | "error")
- Email input and submit button are `disabled` when state is "submitting"
- Success message: `role="status"` + `aria-live="polite"` (non-disruptive)
- Error message: `role="alert"` (immediately announced)
- Both messages use `hidden` when not in their corresponding state

## When to Use

- Use to collect newsletter subscriptions in marketing surfaces.
- Use whenever you need an explicit submit/loading/success/error progression for a single email field.

## When Not to Use

- Do not use for multi-field signup or registration flows — use Form with multiple Field components.
- Do not use for in-app notification preferences — use a settings UI.

## Headless

Renders a `<form>` with `<label>` + `<input type="email">` + `<button type="submit">`,
plus conditional success/error message paragraphs. Visual styling, layout
direction (row/column), inline placement of messages, and submit logic are
the consumer's responsibility.

## Styles

Consumer CSS targets the `newsletter-signup` class on the form. Use the
`data-state` attribute selector to style the form per state. Style the
inner `newsletter-signup-success` and `newsletter-signup-error` classes
for status messaging.

## Testing

- Verify the component renders a `<form>` element with class `newsletter-signup`
- Verify `aria-label` is present and equals the `label` prop
- Verify `data-state` reflects the `state` prop
- Verify the email input and submit button are `disabled` when state is "submitting"
- Verify the success message renders with `role="status"` + `aria-live="polite"` and is hidden unless state is "success"
- Verify the error message renders with `role="alert"` and is hidden unless state is "error"
- Verify the submit handler fires on form submission

## Advice

- **Designers**: Use a clear, single-line layout where possible. Reserve vertical space for the success and error messages so the layout does not jump.
- **Developers**: Always supply `label`, `emailLabel`, and `submitLabel` (required). Do not announce success with `role="alert"` — that is reserved for errors. Disable the submit while submitting to avoid duplicate calls.

## Related components

- `form` — a form element for collecting and submitting user data
- `email-input` — an input for entering an email address <input type="email">
- `call-to-action` — a prominent prompt encouraging user action

## References

- WAI-ARIA `role="status"`: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA `role="alert"`: https://www.w3.org/TR/wai-aria-1.2/#alert
- MDN `aria-live`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live
- Mozilla Protocol Design System: https://protocol.mozilla.org/

---

Lily™ and Lily Design System™ are trademarks.
