# TreeSelect

A select dropdown showing a tree of hierarchical options. Renders a `role="combobox"` container, a trigger button, and a tree panel.

## Implementation Notes

- Headless: no CSS, no styles
- `label` is **required** and non-optional in the TypeScript interface
- Container uses `role="combobox"` with `aria-haspopup="tree"`
- When `multiple` is `true`, `aria-multiselectable="true"` is set on the container
- The panel is hidden when `expanded` is `false`

## Props

- `label`: string (**required**) — accessible name (aria-label)
- `expanded`: boolean (default `false`) — whether the panel is open
- `disabled`: boolean (default `false`)
- `multiple`: boolean (default `false`) — sets `aria-multiselectable`
- `placeholder`: string — placeholder text on the trigger
- `value`: string — display value on the trigger
- default slot — tree content (typically `TreeNav` / `TreeList`)
- `...$attrs` — additional HTML attributes

## Events

- `click(event: MouseEvent)` — emitted when the trigger button is activated

## Usage

```vue
<TreeSelect
    label="Department"
    :expanded="open"
    :multiple="true"
    placeholder="Select department…"
    :value="selected"
    @click="open = !open"
>
    <ul role="tree">
        <li role="treeitem">Engineering</li>
        <li role="treeitem">Marketing</li>
    </ul>
</TreeSelect>
```

## Keyboard Interactions

- `Tab` — focus the trigger
- `Enter` / `Space` — activate the trigger
- Consumer is responsible for tree-level navigation inside the panel

## ARIA

- `role="combobox"` on the container
- `aria-haspopup="tree"`
- `aria-expanded` reflects panel state
- `aria-multiselectable` when `multiple` is `true`
- `aria-label` is required

## When to Use

- Selecting from a hierarchical list (departments, categories, taxonomies)
- Single or multi-select tree picking

## When Not to Use

- Linear selection — use `Select`
- Multi-level selection where each level is finalized before the next — use `Cascader`

## Headless

The component renders semantic HTML and ARIA structure. Consumers supply tree content (e.g., `TreeNav` / `TreeList`) and apply all visual styling.

## Testing

- Verify the root `tree-select` class and `role="combobox"`
- Verify `aria-haspopup="tree"`, `aria-expanded`, `aria-label`, and `aria-multiselectable`
- Verify trigger renders `value` or `placeholder`
- Verify panel hidden state
- Verify the click event is emitted

## References

- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Ant Design TreeSelect](https://ant.design/components/tree-select)
