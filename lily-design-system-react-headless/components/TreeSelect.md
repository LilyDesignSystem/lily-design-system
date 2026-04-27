# TreeSelect

A select dropdown showing a tree of hierarchical options. The component is a `role="combobox"` container with a trigger button and a panel that holds the tree (typically supplied as `TreeNav`/`TreeList`).

## Implementation Notes

- `label` is non-optional -- the combobox MUST have an accessible name
- `aria-multiselectable` is set when `multiple=true`
- The trigger is a `<button type="button">`
- The panel uses the `hidden` attribute, controlled by `expanded`
- Display text falls back from `value` to `placeholder`

## Props

- `label`: string (**required**) -- aria-label
- `expanded`: boolean (default: `false`)
- `disabled`: boolean (default: `false`)
- `multiple`: boolean (default: `false`) -- sets `aria-multiselectable`
- `placeholder`: string (optional)
- `value`: string (optional) -- display value
- `onClick`: (event: React.MouseEvent) => void (optional)
- `children`: ReactNode (required) -- tree content
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<TreeSelect label="Category" expanded={open} value={selected} onClick={toggle}>
  <TreeNav>…</TreeNav>
</TreeSelect>

<TreeSelect label="Tags" multiple expanded={open} onClick={toggle}>
  <TreeNav>…</TreeNav>
</TreeSelect>
```

## Keyboard Interactions

- Tab: focus the trigger
- Enter / Space on trigger: opens the panel (consumer toggles `expanded`)
- Arrow keys inside the tree: handled by the consumer's tree component

## ARIA

- `role="combobox"` on the root
- `aria-haspopup="tree"`
- `aria-expanded` reflects `expanded`
- `aria-label` from the `label` prop
- `aria-multiselectable` when `multiple=true`
