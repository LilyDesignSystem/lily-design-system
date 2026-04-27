# Cascader

A multi-level dropdown for selecting a value from a hierarchy. The component is a `role="combobox"` container with a trigger button and a panel that holds nested option lists supplied by the consumer.

## Implementation Notes

- `label` is non-optional -- the combobox MUST have an accessible name
- The trigger is a `<button type="button">`
- The panel uses the `hidden` attribute, controlled by `expanded`
- The displayed text falls back from `value` to `placeholder`

## Props

- `label`: string (**required**) -- aria-label
- `expanded`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `placeholder`: string (optional)
- `value`: string (optional) -- display value
- `onClick`: (event: React.MouseEvent) => void (optional)
- `children`: ReactNode (required) -- panel content
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<Cascader label="Region" expanded={open} value={selected} onClick={toggle}>
  <ul role="tree">…</ul>
</Cascader>
```

## Keyboard Interactions

- Tab: focus the trigger
- Enter / Space on trigger: opens the panel (consumer toggles `expanded`)

## ARIA

- `role="combobox"` on the root
- `aria-haspopup="tree"`
- `aria-expanded` reflects `expanded`
- `aria-label` from the `label` prop
