# Input With Mask

An input with mask is a `<div>` wrapper around a text `<input>` and a
decorative format-mask display (e.g., `(___) ___-____`) that overlays the
input to show the user where to type each character.

Use it for structured fields such as phone numbers, dates, or document
identifiers that have a predictable character pattern.

## Implementation Notes

- Renders a wrapping `<div>` with class `input-with-mask` and `data-mask` attribute
- `label` prop is **required** — it sets `aria-label` on the `<input>`
- `mask` prop is **required** — the format string displayed to the user
- The mask display renders as `<span class="input-with-mask-display" aria-hidden="true">`
- The actual input renders as `<input class="input-with-mask-control" type="text">`
- The mask display is decorative; the input's `aria-label` is the accessible name
- `value`, `placeholder`, `disabled` are forwarded to the input
- `onInput` / `oninput` callback fires on input change

## Props

- `label`: string (**required**) -- aria-label for the input
- `mask`: string (**required**) -- format mask (e.g., `(___) ___-____`)
- `value`: string (default: "") -- input value
- `placeholder`: string (optional) -- input placeholder
- `disabled`: boolean (default: false) -- disabled state
- `onInput` / `oninput`: callback (optional) -- input change handler
- `...restProps`: any additional HTML attributes

## Usage

US phone number mask:

```html
<InputWithMask
  label="Phone number"
  mask="(___) ___-____"
  value={phone}
  oninput={(e) => phone = e.target.value}
/>
```

Date mask:

```html
<InputWithMask
  label="Date of birth"
  mask="MM/DD/YYYY"
  value={dob}
/>
```

## Keyboard Interactions

- Tab: focus the input
- All standard text-input keyboard handling is delegated to the native `<input>`

## ARIA

- The input has the required `aria-label` from the `label` prop
- The mask display has `aria-hidden="true"` so screen readers do not announce the placeholder pattern
- The wrapping `<div>` has a `data-mask` attribute for consumer styling

## When to Use

- Use for phone numbers, social security numbers, dates, and similar structured fields.
- Use when the format is predictable and showing the pattern helps users enter values correctly.

## When Not to Use

- Do not use for free-form text — use a plain `TextInput` instead.
- Do not use for sensitive masked content (passwords) — use `PasswordInput`.
- Do not use as a substitute for proper input types (`<input type="tel">`, `<input type="date">`) when those are appropriate.

## Headless

Renders the structural skeleton — `<div>` with `<span>` mask display
and `<input>` control. The visual overlay technique that aligns the
mask with the input characters is entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `input-with-mask` class plus the inner
`input-with-mask-display` and `input-with-mask-control` classes.
Typical treatments use absolute positioning to overlay the mask on the
input, with monospace typography so the characters align.

## Testing

- Verify the component renders a `<div>` with class `input-with-mask`
- Verify the `data-mask` attribute equals the `mask` prop
- Verify the mask display renders inside `<span class="input-with-mask-display" aria-hidden="true">`
- Verify the mask display text equals the `mask` prop
- Verify the input has class `input-with-mask-control`
- Verify the input has type `text`
- Verify the input has `aria-label` equal to the `label` prop
- Verify the input value reflects the `value` prop
- Verify the input is disabled when `disabled` is true
- Verify the input handler fires on input

## Advice

- **Designers**: Use a monospace font for the input so the mask and the typed characters align. Choose a low-contrast color for the mask so it does not compete with the user's input.
- **Developers**: The mask display is purely visual. The input value remains a plain string — do not parse the mask characters into the value. Use a separate validation component (e.g., `ValidationList`) to verify the format.

## Related components

- `text-input` — a single-line text input field <input type="text">
- `pin-input-div` — a series of single-digit inputs for entering a PIN or OTP code
- `input` — a generic HTML input element

## References

- US Web Design System Input Mask: https://designsystem.digital.gov/components/input-mask/
- HTML `<input type="text">`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text
- WAI-ARIA aria-hidden: https://www.w3.org/TR/wai-aria-1.2/#aria-hidden
- WCAG 1.3.5 Identify Input Purpose: https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose
