# TreeSelect

a select dropdown showing a tree of hierarchical options

## Description

TreeSelect renders a `<div role="combobox" aria-haspopup="tree">`
that wraps a trigger `<button>` and a panel containing a tree of
options. Consumers compose the inner tree (typically `<ul role="tree">`
or a `TreeNav`/`TreeList` component).

When `multiple` is `true`, the container reports
`aria-multiselectable="true"` so assistive technology announces the
multi-select behaviour.

## HTML tag

`<div>` with `role="combobox"`

## CSS class

`tree-select`

## Params

- `label` — string. **Required.** `aria-label` for the combobox.
- `expanded` — boolean. Default `false`. Whether the tree panel is
  open (`aria-expanded`).
- `disabled` — boolean. Disables the trigger button.
- `multiple` — boolean. Default `false`. Sets
  `aria-multiselectable="true"` on the container.
- `placeholder` — string. Placeholder text on the trigger when no
  value is selected.
- `value` — string. Display value (consumer formats label).
- `text` — string. Plain text panel content (escaped).
- `html` — string. Raw HTML panel content (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes on the root element.

## Usage

```njk
{% from "components/tree-select/macro.njk" import treeSelect %}

{% call treeSelect({
  label: "Choose a category",
  placeholder: "Select…",
  expanded: true,
  multiple: true
}) %}
  <ul role="tree">
    <li role="treeitem" aria-expanded="false">Books
      <ul role="group">
        <li role="treeitem">Fiction</li>
        <li role="treeitem">Non-fiction</li>
      </ul>
    </li>
    <li role="treeitem">Music</li>
  </ul>
{% endcall %}
```

## Keyboard

Follow the
[WAI-ARIA combobox + tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/):

- `Down`/`Up` to navigate options
- `Right` to expand a branch
- `Left` to collapse a branch
- `Enter` to select
- `Space` to toggle in multi-select mode
- `Escape` to close

## Accessibility

- `role="combobox"` and `aria-haspopup="tree"` describe the
  trigger/panel relationship.
- `aria-expanded` reflects the panel state.
- `aria-multiselectable` is added when `multiple` is `true`.
- `aria-label` supplies the accessible name. Use `attributes` to
  pass `aria-labelledby` instead when a visible label exists.

## Headless

No CSS or JavaScript is bundled. Consumers wire open/close, tree
navigation, selection, and styling.

## Testing

`components/tree-select/macro.test.js` verifies the role, aria
attributes including `aria-multiselectable`, expanded/disabled state,
trigger placeholder/value, hidden panel, and pass-through.

## References

- [WAI-ARIA: combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA: tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
- [Ant Design: TreeSelect](https://ant.design/components/tree-select)
