# TransferList

A dual list box for moving items between two lists. Renders a `role="group"` container with two `<section>` sub-regions (source and target) and an optional actions area between them.

## Implementation Notes

- Headless: no CSS, no styles
- `label`, `sourceLabel`, and `targetLabel` are **required** and non-optional in the TypeScript interface
- Each list region is a `<section>` with its own aria-label so screen readers can navigate between them
- The actions area is rendered only when the `actions` slot is supplied

## Props

- `label`: string (**required**) — group aria-label
- `sourceLabel`: string (**required**) — source section aria-label
- `targetLabel`: string (**required**) — target section aria-label
- `source` slot (**required**) — source list content (typically a Listbox)
- `target` slot (**required**) — target list content
- `actions` slot — optional action buttons between the two lists
- `...$attrs` — additional HTML attributes

## Usage

```vue
<TransferList
    label="Move items"
    source-label="Available"
    target-label="Selected"
>
    <template #source>
        <ul role="listbox">
            <li role="option">Apples</li>
            <li role="option">Bananas</li>
        </ul>
    </template>
    <template #actions>
        <button type="button">→</button>
        <button type="button">←</button>
    </template>
    <template #target>
        <ul role="listbox">
            <li role="option">Cherries</li>
        </ul>
    </template>
</TransferList>
```

## ARIA

- `role="group"` on the container with `aria-label`
- Source and target sections each have their own `aria-label`

## When to Use

- Moving items between two lists (permissions, tags, recipients)

## When Not to Use

- Single-list selection — use `Listbox`
- Hierarchical selection — use `TreeSelect` or `Cascader`

## Headless

The component renders the structural shell with semantic regions. Consumers supply both lists, action buttons, and all visual styling.

## Testing

- Verify the root `transfer-list` class and `role="group"`
- Verify source and target are `<section>` with their respective aria-labels
- Verify slot rendering for source/target/actions
- Verify the actions container is omitted when the slot is empty

## References

- [Ant Design Transfer](https://ant.design/components/transfer)
