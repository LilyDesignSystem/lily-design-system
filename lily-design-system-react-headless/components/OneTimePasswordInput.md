# OneTimePasswordInput

A single native one-time-password (verification code) input: numeric keypad, SMS autofill (`autocomplete="one-time-code"`), paste support, and a fixed length. Deliberately ONE real `<input>`, not segmented boxes like `PinInputDiv`.

## Implementation Notes

- Root is `<input type="text">` with `inputMode="numeric"`, `maxLength={length}`, `pattern="[0-9]*"`, `spellCheck={false}`, `autoCapitalize="off"`.
- `length` is required with no default; the consumer decides.
- Root class `one-time-password-input`; `data-length` mirrors `length`.

## Props

- `className`: string (optional)
- `label`: string (required) -- `aria-label`
- `length`: number (required) -- code length
- `value`: string (default `""`) -- controlled; with `onChange(value)`
- `inputMode`: string (default `"numeric"`), `pattern`: string (default `"[0-9]*"`)
- `name`, `required`, `disabled`
- `...restProps` -- spread onto the `<input>`

## Usage

```tsx
<OneTimePasswordInput label="Verification code" length={6} value={code} onChange={setCode} />
```

## Keyboard Interactions

Native text editing only.

## ARIA

`aria-label={label}`.

## Related components

`TextInput`, `PinInputDiv`.
