# Cascader

A cascader is a multi-level dropdown for selecting a value from a
hierarchy. It exposes a trigger button and a panel that holds nested
option lists.

Use it for hierarchical pickers such as country → region → city,
category → subcategory → leaf, or any tree-shaped selection where the
selected value is a path through the hierarchy.

## Implementation Notes

- Renders a `<div>` with `role="combobox"`, `aria-haspopup="tree"`, `aria-expanded`, `aria-label`
- The trigger is a native `<button class="cascader-trigger" type="button">` showing `value` or `placeholder`
- The panel is a `<div class="cascader-panel">` with `hidden` toggled by the `expanded` prop
- `label` is **required** and sets `aria-label` on the combobox container
- `disabled` disables the trigger button
- Children populate the panel (typically nested option lists or trees)

## Props

- `label`: string (**required**) -- aria-label on the combobox
- `expanded`: boolean (default: false) -- whether the panel is open
- `disabled`: boolean (default: false) -- disable the trigger button
- `placeholder`: string (optional) -- placeholder text for the trigger
- `value`: string (optional) -- formatted display value (consumer formats path)
- `onclick` / `onClick`: callback (optional) -- trigger click handler
- `children`: slot -- panel content (typically nested option lists)
- `...restProps`: any additional HTML attributes

## Usage

```html
<Cascader
  label="Select location"
  expanded={isOpen}
  value={selectedPath}
  placeholder="Choose a region"
  onclick={togglePanel}
>
  <ul role="tree">...</ul>
</Cascader>
```

## Keyboard Interactions

- Tab: Focus the trigger
- Enter / Space: Toggle the panel (consumer handler)
- Arrow keys: Consumer-provided tree navigation inside the panel
- Escape: Consumer should close the panel and return focus to the trigger

## ARIA

- `role="combobox"` on the container
- `aria-haspopup="tree"` indicates the panel contains tree-shaped options
- `aria-expanded` reflects the `expanded` prop
- `aria-label` is the entire accessible name (required)

## When to Use

- Use when selecting a value from a hierarchy where each level depends on the previous one.
- Use when users need to see ancestors of a deeply nested option (e.g., country/region/city).

## When Not to Use

- Do not use for flat lists — use Select or Combobox.
- Do not use for very small hierarchies — use nested radio groups or a TreeSelect.

## Headless

Renders semantic combobox markup with no styling. The consumer is
responsible for opening/closing the panel, focus management, keyboard
navigation, and the visual treatment of the trigger and panel.

## Styles

Consumer CSS targets the `cascader`, `cascader-trigger`, and
`cascader-panel` classes. Provide visible focus indicators, disabled
state styling, and a clear visual distinction between collapsed and
expanded states.

## Testing

- Verify the component renders a `<div>` element with class `cascader`
- Verify `role="combobox"` and `aria-haspopup="tree"` are set
- Verify `aria-expanded` reflects the `expanded` prop
- Verify `aria-label` equals the `label` prop
- Verify the trigger button is disabled when `disabled` is true
- Verify the panel is `hidden` when `expanded` is false
- Verify children render inside the panel

## Advice

- **Designers**: Show the selected path on the trigger so users can verify their choice without reopening the cascader. Keep depth shallow (3-4 levels).
- **Developers**: Manage `expanded` state externally. Pair with a tree or nested listboxes inside the panel for keyboard support.

## Related components

- `combobox` — a text input combined with a dropdown list for filtering options
- `tree-select` — a select dropdown showing a tree of hierarchical options
- `select-with-extras` — a select dropdown with additional features like search or groups

## References

- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Ant Design Cascader: https://ant.design/components/cascader
