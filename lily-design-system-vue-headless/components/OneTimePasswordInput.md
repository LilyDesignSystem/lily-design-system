# OneTimePasswordInput

a single one-time-password input with a numeric keypad, SMS autofill, and a fixed length

## Implementation Notes

- Renders ONE native `<input type="text">` (not segmented boxes), so SMS autofill and paste work
- `autocomplete="one-time-code"`, `inputmode` (default `numeric`), `maxlength={length}`, `pattern` (default `[0-9]*`), `spellcheck="false"`, `autocapitalize="off"`
- `data-length` mirrors `length`
- `defineModel()` for the value (`v-model`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `length`: number (required, no default) -- code length
- `modelValue` / `v-model`: string (default `""`)
- `inputMode`: string (default `"numeric"`)
- `pattern`: string (default `"[0-9]*"`)
- `name`, `required`, `disabled`
- attributes fall through onto the `<input>`

## Usage

```vue
<OneTimePasswordInput label="Verification code" :length="6" v-model="code" />
```

## Keyboard Interactions

- None beyond native behaviour

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
