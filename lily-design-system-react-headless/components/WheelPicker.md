# WheelPicker

A vertical single-select listbox where the selection follows the cursor, for choosing one of a short list by scrolling, typing or clicking.

Full documentation: [components/wheel-picker/index.md](../../components/wheel-picker/index.md).

## Props

- `className`: string (optional) -- appended to `wheel-picker`
- `label`: string (required) -- accessible name of the listbox
- `options`: `{ value, label, disabled? }[]` (required)
- `value`: string -- the selected option's value (controlled: update it in `onChange`)
- `onChange`: `(value: string) => void` -- called once per change
- `loop`: boolean (default `false`), `pageSize`: number (default `5`), `disabled`: boolean (default `false`), `name`: string (hidden input for forms)
- `...restProps`: spread onto the root `<div>`

## Usage

```tsx
const [month, setMonth] = useState("2");
<WheelPicker label="Month" options={months} value={month} onChange={setMonth} />
```

The keyboard model is `wheel-picker.ts`, a copy of `shared/wheel-picker.ts`.
