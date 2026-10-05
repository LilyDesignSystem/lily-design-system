# MultiSelect

A native `<select multiple>` for choosing several options. Native keyboard and pointer behaviour only.

## Props

- `className`: string (optional)
- `label`: string (required) -- `aria-label`
- `value`: string[] (default `[]`) -- selected values; `onChange(values: string[])`
- `size`: number (optional) -- visible rows
- `required`, `disabled`
- `children`: `Option` elements
- `...restProps` -- spread onto the `<select>`

## Implementation Notes

The component keeps internal state seeded from `value` and re-syncs when `value` changes, so it works controlled or uncontrolled.

## Usage

```tsx
<MultiSelect label="Fruit" value={picked} onChange={setPicked}>
  <Option value="a">Apple</Option>
  <Option value="b">Banana</Option>
</MultiSelect>
```

## Keyboard Interactions

Native: arrows, Shift/Ctrl + arrows or click, Space.

## ARIA

Native `listbox` role; `aria-label={label}`.

## Related components

`Select`, `MultiSelectWithExtras`, `Option`.
