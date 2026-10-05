# MultiSelect

a native multiple-choice select box exposed as a listbox

## Implementation Notes

- Renders a native `<select multiple>`; native keyboard only
- `v-model` is a `string[]` of selected option values

## Props

- `label`: string (required)
- `modelValue` / `v-model`: string[] (default `[]`)
- `size`: number (optional visible rows)
- `required`, `disabled`
- default slot: option elements

## Usage

```vue
<MultiSelect label="Toppings" v-model="picked"><option value="a">A</option></MultiSelect>
```

## Keyboard Interactions

- None beyond native behaviour

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
