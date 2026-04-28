# NewsletterSignup

An email subscription form composition with `idle`, `submitting`, `success`, and `error` states. Inspired by the [Mozilla Protocol Design System](https://protocol.mozilla.org).

## Implementation Notes

- Headless: no CSS, no styles
- Renders a `<form>` with optional heading, an email input, a submit button, and conditional success/error messages
- `label`, `emailLabel`, and `submitLabel` are **required**
- Success message uses `role="status"` with `aria-live="polite"`
- Error message uses `role="alert"`
- Both messages render unconditionally and toggle visibility via the `hidden` attribute so screen readers can be set up to track them

## Props

- `label`: string (**required**) — `aria-label` for the form
- `heading`: string (optional) — visible heading inside `<header>`
- `description`: string (optional) — body text below the heading
- `emailLabel`: string (**required**) — visible label for the email input
- `emailPlaceholder`: string (optional) — placeholder for the email input
- `submitLabel`: string (**required**) — submit button text
- `state`: `"idle" | "submitting" | "success" | "error"` (default `"idle"`) — exposed as `data-state`
- `successMessage`: string (optional) — confirmation message shown when state is `"success"`
- `errorMessage`: string (optional) — error message shown when state is `"error"`

## Events

- `submit(event: Event)` — emitted when the form is submitted

## Usage

```vue
<NewsletterSignup
    label="Subscribe to newsletter"
    heading="Stay informed"
    description="Monthly product updates."
    email-label="Email address"
    email-placeholder="you@example.com"
    submit-label="Subscribe"
    :state="state"
    success-message="Thanks for subscribing!"
    error-message="Something went wrong, please try again."
    @submit="onSubmit"
/>
```

## ARIA

- `<form aria-label>` provides an accessible name for the region
- Success: `role="status" aria-live="polite"` for polite announcements
- Error: `role="alert"` for assertive announcements
- The submit button and email input are disabled during the `"submitting"` state

## When to Use

- Email subscription forms in marketing pages, footers, or modals
- Wherever a single email field plus submit button captures opt-ins

## When Not to Use

- Multi-field signup forms — compose `Form`, `Field`, and `TextInput`
- Authenticated profile editing — use `Form` with `EmailInput`

## Headless

The component renders semantic HTML form elements with all required ARIA attributes. Consumers supply all visual styling and the actual subscription request logic via the `submit` event.

## Testing

- Verify the root `newsletter-signup` class and `aria-label`
- Verify `data-state` reflects the `state` prop
- Verify success message has `role="status"` and `aria-live="polite"`, and toggles `hidden`
- Verify error message has `role="alert"` and toggles `hidden`
- Verify input and submit button are disabled when `state === "submitting"`
- Verify the `submit` event fires when the form is submitted

## References

- [Mozilla Protocol Design System](https://protocol.mozilla.org)
- [WAI-ARIA - role status](https://www.w3.org/TR/wai-aria-1.2/#status)
- [WAI-ARIA - role alert](https://www.w3.org/TR/wai-aria-1.2/#alert)
