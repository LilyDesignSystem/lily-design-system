# MultiSelectWithExtras

a native multiple-choice select with before and after content slots

## Implementation Notes

- Wrapper `<div>` around a native `<select multiple>`; `aria-label` is on the select, attributes fall through onto the wrapper
- `before` / `after` slots sit around the select

## Props

- `label`: string (required)
- `modelValue` / `v-model`: string[] (default `[]`)
- `size`, `required`, `disabled`
- slots: default (options), `before`, `after`

## Usage

```vue
<MultiSelectWithExtras label="Toppings" v-model="picked"><template #before>...</template><option value="a">A</option></MultiSelectWithExtras>
```

## Keyboard Interactions

- None beyond native behaviour

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
