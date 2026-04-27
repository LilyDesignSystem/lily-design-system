# Cascader

A multi-level dropdown for selecting a value from a hierarchy. The component renders a combobox container, a trigger button, and a panel for nested option lists.

## Implementation Notes

- Headless: no CSS, no styles
- `label` is **required** and non-optional in the TypeScript interface
- Container uses `role="combobox"` with `aria-haspopup="tree"`
- The panel is hidden when `expanded` is `false`

## Props

- `label`: string (**required**) — accessible name (aria-label)
- `expanded`: boolean (default `false`) — whether the panel is open
- `disabled`: boolean (default `false`)
- `placeholder`: string — placeholder text on the trigger
- `value`: string — display value on the trigger
- default slot — panel content (typically nested option lists / tree)
- `...$attrs` — additional HTML attributes

## Events

- `click(event: MouseEvent)` — emitted when the trigger button is activated

## Usage

```vue
<Cascader
    label="Region"
    :expanded="open"
    placeholder="Select region…"
    :value="selected"
    @click="open = !open"
>
    <ul role="tree">
        <li role="treeitem">North America</li>
        <li role="treeitem">Europe</li>
    </ul>
</Cascader>
```

## Keyboard Interactions

- `Tab` — focus the trigger
- `Enter` / `Space` — activate the trigger
- Consumer is responsible for tree-level navigation inside the panel

## ARIA

- `role="combobox"` on the container
- `aria-haspopup="tree"`
- `aria-expanded` reflects panel state
- `aria-label` is required

## When to Use

- Selecting a value from a deep hierarchy (region, category, department)
- When a flat dropdown becomes unwieldy

## When Not to Use

- Flat lists — use `Select`
- Single-level trees — use `TreeSelect`

## Headless

The component renders semantic HTML and ARIA structure. Consumers supply the panel contents (typically a tree) and apply all visual styling.

## Testing

- Verify the root `cascader` class and `role="combobox"`
- Verify `aria-haspopup="tree"`, `aria-expanded`, `aria-label`
- Verify trigger renders `value` or `placeholder`
- Verify panel hidden state
- Verify the click event is emitted

## References

- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Ant Design Cascader](https://ant.design/components/cascader)
