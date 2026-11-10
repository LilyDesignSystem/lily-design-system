# WheelPicker

A single-select listbox, vertical by default, where the selection follows the cursor, for choosing one of a short list by scrolling, typing or clicking.

Full documentation: [components/wheel-picker/index.md](../../components/wheel-picker/index.md).

## Props

- `label`: string (required) -- accessible name of the listbox
- `options`: `{ value, label, disabled? }[]` (required)
- `v-model`: string -- the selected option's value
- `loop`: boolean (default `false`), `pageSize`: number (default `5`), `disabled`: boolean (default `false`), `orientation`: `"vertical"` | `"horizontal"` (default `"vertical"`), `name`: string (hidden input for forms, disabled with the picker; a form reset restores the first value), `form`: string (the id of a form elsewhere)
- Attributes (including `class`) fall through onto the root `<div>`

## Usage

```vue
<WheelPicker label="Month" :options="months" v-model="month" />
```

The keyboard model is `wheel-picker.ts`, a copy of `shared/wheel-picker.ts`.
