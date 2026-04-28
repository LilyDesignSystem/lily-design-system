# NewsletterSignup

An email subscription form composition with idle, submitting, success, and error states. Renders a semantic `<form>` with an `aria-label`, an email input, a submit button, and accessible status/alert messages.

## Implementation Notes

- `label`, `emailLabel`, and `submitLabel` are **required**
- `state` is exposed as `data-state` on the `<form>` for consumer styling
- While `state === "submitting"`, the email input and submit button are disabled
- Success message uses `role="status"` + `aria-live="polite"` and is hidden when `state !== "success"`
- Error message uses `role="alert"` and is hidden when `state !== "error"`
- Both status messages are always rendered so screen readers can announce state changes; visibility is toggled via the native `hidden` attribute

## Props

- `label`: string (**required**) -- form `aria-label`
- `emailLabel`: string (**required**)
- `submitLabel`: string (**required**)
- `heading`: string (optional)
- `description`: string (optional)
- `emailPlaceholder`: string (optional)
- `state`: `"idle" | "submitting" | "success" | "error"` (default `"idle"`)
- `successMessage`: string (optional)
- `errorMessage`: string (optional)
- `onSubmit`: (event: React.FormEvent<HTMLFormElement>) => void (optional)
- `className`: string (optional)
- `...restProps`: any additional HTML attributes passed to the `<form>`

## Usage

```tsx
<NewsletterSignup
  label="Newsletter signup"
  heading="Stay in the loop"
  description="Monthly updates, no spam."
  emailLabel="Email address"
  emailPlaceholder="you@example.com"
  submitLabel="Subscribe"
  state={state}
  successMessage="Thanks for subscribing!"
  errorMessage="Something went wrong, please try again."
  onSubmit={handleSubmit}
/>
```

## ARIA

- `<form>` with `aria-label`
- Success message: `role="status"` + `aria-live="polite"`
- Error message: `role="alert"`
