# OneTimePasswordInput

a single one-time-password input with a numeric keypad, SMS autofill, and a fixed length

This is the Angular headless implementation. See `components/one-time-password-input/index.md`
for the full canonical documentation.

One real native `<input>` (autocomplete=one-time-code, numeric keypad). `length` is required. Deviation: no rest-props spread; extra attributes land on the `<lily-...>` host.
