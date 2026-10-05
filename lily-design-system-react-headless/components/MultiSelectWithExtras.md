# MultiSelectWithExtras

A wrapper `<div>` with `before` / `after` content around a native `<select multiple>`.

## Props

- `className`: string (optional) -- on the wrapper
- `label`: string (required) -- `aria-label` on the `<select>`, not the wrapper
- `value`: string[] (default `[]`); `onChange(values: string[])`
- `size`, `required`, `disabled` -- on the select
- `before`, `after`: ReactNode (optional)
- `children`: `Option` elements
- `...restProps` -- spread onto the wrapper

## Usage

```tsx
<MultiSelectWithExtras label="Tags" before={<span>Tags</span>} value={tags} onChange={setTags}>
  <Option value="a">A</Option>
</MultiSelectWithExtras>
```

## Keyboard Interactions

Native `<select multiple>`.

## ARIA

Native listbox on the select; wrapper has no role.

## Related components

`SelectWithExtras`, `MultiSelect`.
