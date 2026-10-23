# WheelPicker

A vertical single-select listbox where the selection follows the cursor, for choosing one of a short list by scrolling, typing or clicking.

Full documentation: [components/wheel-picker/index.md](../../components/wheel-picker/index.md).

## Props

- `label`: string (required) -- accessible name of the listbox
- `options`: `{ value, label, disabled? }[]` (required)
- `v-model`: string -- the selected option's value
- `loop`: boolean (default `false`), `pageSize`: number (default `5`), `disabled`: boolean (default `false`), `name`: string (hidden input for forms)
- Attributes (including `class`) fall through onto the root `<div>`

## Usage

```vue
<WheelPicker label="Month" :options="months" v-model="month" />
```

The keyboard model is `wheel-picker.ts`, a copy of `shared/wheel-picker.ts`.
