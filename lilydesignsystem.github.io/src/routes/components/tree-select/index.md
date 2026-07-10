# Tree Select

A tree select is a select dropdown showing a tree of hierarchical
options. It exposes a trigger button and a panel that holds tree-shaped
options.

Use it for hierarchical selection where the options form a tree (e.g.,
organizational unit, category, file system path) and the user selects
one or many leaves or branches.

## Implementation Notes

- Renders a `<div>` with `role="combobox"`, `aria-haspopup="tree"`, `aria-expanded`, `aria-label`
- Sets `aria-multiselectable` on the container when `multiple` is true
- The trigger is a native `<button class="tree-select-trigger" type="button">`
- The panel is a `<div class="tree-select-panel">` with `hidden` toggled by `expanded`
- `label` is **required** and sets `aria-label` on the combobox
- Children typically include a TreeNav/TreeList component

## Props

- `label`: string (**required**) -- aria-label on the combobox
- `expanded`: boolean (default: false) -- whether the tree panel is open
- `disabled`: boolean (default: false) -- disable the trigger button
- `multiple`: boolean (default: false) -- allow multiple selection (sets aria-multiselectable)
- `placeholder`: string (optional) -- placeholder text on the trigger
- `value`: string (optional) -- formatted display value
- `onclick` / `onClick`: callback (optional) -- trigger click handler
- `children`: slot -- tree content (typically TreeNav/TreeList)
- `...restProps`: any additional HTML attributes

## Usage

```html
<TreeSelect
  label="Select category"
  expanded={isOpen}
  value={selectedLabel}
  placeholder="Choose…"
  onclick={togglePanel}
>
  <ul role="tree">...</ul>
</TreeSelect>
```

```html
<TreeSelect
  label="Select multiple departments"
  multiple
  expanded={isOpen}
  value={selectedNames}
  onclick={togglePanel}
>
  <ul role="tree" aria-multiselectable="true">...</ul>
</TreeSelect>
```

## Keyboard Interactions

- Tab: Focus the trigger
- Enter / Space: Toggle the panel (consumer handler)
- Arrow keys: Consumer-supplied tree navigation inside the panel
- Escape: Consumer should close the panel and return focus to the trigger

## ARIA

- `role="combobox"` on the container
- `aria-haspopup="tree"` indicates the panel contains tree-shaped options
- `aria-expanded` reflects the `expanded` prop
- `aria-label` is the entire accessible name (required)
- `aria-multiselectable="true"` is set on the container only when `multiple` is true

## When to Use

- Use when the option set is naturally hierarchical and benefits from a tree presentation.
- Use when the user must select one or more nodes anywhere in the hierarchy.

## When Not to Use

- Do not use for flat lists — use Select or Combobox.
- Do not use when only path-style selection is needed — use Cascader.

## Headless

Renders semantic combobox markup with no styling. The consumer is
responsible for opening/closing the panel, focus management, keyboard
navigation, and the visual treatment.

## Styles

Consumer CSS targets `tree-select`, `tree-select-trigger`, and
`tree-select-panel`. Provide visible focus rings, disabled state styling,
and a clear distinction between the collapsed and expanded states.

## Testing

- Verify the component renders a `<div>` element with class `tree-select`
- Verify `role="combobox"` and `aria-haspopup="tree"` are set
- Verify `aria-expanded` reflects the `expanded` prop
- Verify `aria-label` equals the `label` prop
- Verify `aria-multiselectable="true"` is set only when `multiple` is true
- Verify the trigger button is disabled when `disabled` is true
- Verify the panel is `hidden` when `expanded` is false
- Verify children render inside the panel

## Advice

- **Designers**: Show selected values clearly on the trigger. For multiple selection, consider a chip/tag list.
- **Developers**: Manage `expanded` state externally. Use a TreeNav/TreeList in the panel to provide proper ARIA tree semantics.

## Related components

- `combobox` — a text input combined with a dropdown list for filtering options
- `tree-nav` — a hierarchical navigation with expandable branches
- `select` — a dropdown select element for choosing one option

## References

- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WAI-ARIA Tree Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- Ant Design TreeSelect: https://ant.design/components/tree-select

---

Lily™ and Lily Design System™ are trademarks.
