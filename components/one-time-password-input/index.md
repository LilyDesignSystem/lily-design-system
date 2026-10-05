# OneTimePasswordInput

OneTimePasswordInput is a headless field for entering a one-time passcode (OTP) or verification code. It is ONE real native `<input type="text">` with `inputmode="numeric"` and `autocomplete="one-time-code"`, so the platform can offer the code from an SMS and paste works. It is deliberately not a row of segmented boxes (see `pin-input-div` for that pattern).

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Renders a native `<input>`: `type="text"`, `inputmode` (default `numeric`), `autocomplete="one-time-code"`, `maxlength={length}`, `pattern` (default `[0-9]*`), `spellcheck="false"`, `autocapitalize="off"`
- `length` is required with no default: the consumer decides how long its codes are
- Sets `aria-label={label}` and `data-length={length}`
- Two-way `value` binding
- Never validates or submits; the consumer owns verification
- Spreads `restProps` onto the `<input>`

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- accessible name via `aria-label`
- `length`: number (required) -- number of characters in the code; sets `maxlength` and `data-length`
- `value`: string (default: `""`) -- bindable value
- `inputMode`: string (default: `"numeric"`) -- virtual keyboard hint; use `"text"` for alphanumeric codes
- `pattern`: string (default: `"[0-9]*"`) -- allowed characters
- `name`: string (optional) -- form field name
- `required`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `...restProps`: unknown -- additional attributes spread onto the `<input>`

## Usage

```html
<OneTimePasswordInput label="Verification code" length={6} bind:value={code} name="otp" required />
```

Alphanumeric code:

```html
<OneTimePasswordInput label="Backup code" length={8} inputMode="text" pattern="[A-Za-z0-9]*" bind:value={backup} />
```

## Keyboard Interactions

- None beyond native input behaviour -- standard text editing keys; Tab moves focus in and out

## ARIA

- `aria-label={label}` -- provides the accessible name when no visible `<label>` is associated
- `autocomplete="one-time-code"` -- WCAG 1.3.5 input purpose, lets the platform offer the received code

## When to Use

- Use for a short numeric or alphanumeric code sent by SMS, email or an authenticator app.
- Use when platform autofill of the code and paste support matter.
- Use in two-factor sign-in, account verification and confirmation flows.

## When Not to Use

- Do not use for a PIN or password the user memorises -- use `pin-input-div` or `password-input`.
- Do not use for free text -- use `text-input`.
- Do not use for national identifiers -- use the matching `*-input` identifier component.

## Headless

This headless component renders a native `<input>` and decides no visual treatment. The consumer styles the field, including any monospace or letter-spacing look that makes a code easy to read.

## Styles

The consumer provides all CSS styling via the `.one-time-password-input` class. `data-length` is available for width rules.

## Testing

- Verify the root is a single `<input type="text">` with class `one-time-password-input`
- Verify `autocomplete="one-time-code"` and `inputmode="numeric"`
- Verify `maxlength` and `data-length` follow `length`, and typing stops at `length`
- Verify `pattern` default and override
- Verify `label` sets `aria-label`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style one field wide enough for `length` characters; letter-spacing and a monospace font help legibility. Do not fake segmented boxes with a background image, or autofill and paste break.
- **Developers**: Verify the code on the server; `pattern` is a hint, not validation. Auto-submit when `value.length === length` only if the user is told.

## Related components

- `pin-input-div` — a segmented, one-box-per-character PIN entry
- `text-input` — a general single-line text input
- `password-input` — a masked password field

## References

- HTML autocomplete one-time-code: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#one-time-code
- WCAG 1.3.5 Identify Input Purpose: https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html

---

Lily™ and Lily Design System™ are trademarks.
