# NewsletterSignup

an email subscription form composition with idle, submitting, success,
and error states

## Description

NewsletterSignup composes a `<form>` containing an optional heading,
optional description, an email input with a linked label, a submit
button, and dedicated success/error message regions. The current
state is exposed as `data-state` so consumers can drive visuals
purely from CSS selectors.

The success message uses `role="status"` + `aria-live="polite"` so
screen readers announce confirmation without interrupting; the error
message uses `role="alert"` to interrupt with critical feedback.
Both regions are conditionally `hidden` based on `state`.

## HTML tag

`<form>`

## CSS class

`newsletter-signup`

## Params

- `label` — string. **Required.** `aria-label` for the form.
- `heading` — string. Visible heading rendered as `<h3>`.
- `description` — string. Body text rendered below the heading.
- `emailLabel` — string. **Required.** Visible label for the email
  input.
- `emailPlaceholder` — string.
- `emailName` — string. `name` attribute. Defaults to `"email"`.
- `emailId` — string. `id` for the email input. Defaults to
  `"newsletter-signup-email"`.
- `submitLabel` — string. **Required.** Submit button text.
- `state` — `"idle"` | `"submitting"` | `"success"` | `"error"`.
  Default `"idle"`. Rendered as `data-state`.
- `successMessage` — string.
- `errorMessage` — string.
- `action` — string. Form `action` attribute.
- `method` — string. Form `method`. Defaults to `"post"`.
- `id` — string.
- `classes` — string.
- `attributes` — object.

## Usage

```njk
{% from "components/newsletter-signup/macro.njk" import newsletterSignup %}

{{ newsletterSignup({
  label: "Subscribe to our newsletter",
  heading: "Stay in the loop",
  description: "Monthly updates, no spam.",
  emailLabel: "Email address",
  emailPlaceholder: "you@example.com",
  submitLabel: "Subscribe",
  state: "idle"
}) }}
```

Success state:

```njk
{{ newsletterSignup({
  label: "Subscribe",
  emailLabel: "Email",
  submitLabel: "Subscribe",
  state: "success",
  successMessage: "Thanks! Please confirm via the email we just sent."
}) }}
```

## Accessibility

- The `<form>` is named via `aria-label`.
- The visible email `<label>` is linked to the `<input>` via
  `for`/`id`.
- The success region uses `role="status"` + `aria-live="polite"` —
  appropriate for non-disruptive confirmation.
- The error region uses `role="alert"` — appropriate for
  interrupting feedback.
- During `state="submitting"` both the input and submit button are
  disabled to prevent double submissions.

## When to use

- Email-list opt-in forms.

## When not to use

- For multi-field forms, build with `Form`, `Field`, and inputs
  directly.

## Headless

No CSS or JavaScript bundled. Consumers wire up `submit` handling and
provide all styling.

## Testing

`components/newsletter-signup/macro.test.js` verifies the base class,
form aria-label, label/input linking, default state, disabled
behaviour during submission, success and error message ARIA, and
conditional visibility based on state.

## References

- [WAI-ARIA: form pattern](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/form.html)
- [Mozilla Protocol: Newsletter](https://protocol.mozilla.org/components/detail/newsletter)
