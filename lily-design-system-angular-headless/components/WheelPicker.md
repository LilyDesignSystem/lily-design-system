# WheelPicker

A vertical single-select listbox where the selection follows the cursor, for choosing one of a short list by scrolling, typing or clicking.

Full documentation: [components/wheel-picker/index.md](../../components/wheel-picker/index.md).

- Inputs: `label` (required), `options` (required), `value` (two-way `model`), `loop`, `pageSize`, `disabled`, `name`, `className`.
- No rest-props spread (Angular cannot spread onto an inner element).

## Usage

```html
<lily-wheel-picker label="Month" [options]="months" [(value)]="month" />
```

The keyboard model is `wheel-picker.ts`, a copy of `shared/wheel-picker.ts`.
