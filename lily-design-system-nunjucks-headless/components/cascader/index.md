# Cascader

a multi-level dropdown for selecting a value from a hierarchy

## Description

Cascader renders a `<div role="combobox" aria-haspopup="tree">` that
wraps a trigger `<button>` and a tree panel. Consumers compose the
hierarchical option list inside the panel (typically a `<ul>` with
`role="tree"` or a `TreeNav`/`TreeList` component).

The headless macro takes care of the ARIA scaffolding and visibility
state; consumers wire interactivity (open/close, navigation,
selection) themselves.

## HTML tag

`<div>` with `role="combobox"`

## CSS class

`cascader`

## Params

- `label` — string. **Required.** `aria-label` for the combobox.
- `expanded` — boolean. Default `false`. Whether the panel is open
  (`aria-expanded`).
- `disabled` — boolean. Disables the trigger button.
- `placeholder` — string. Placeholder text on the trigger when no
  value is selected.
- `value` — string. Display value (consumer formats path).
- `text` — string. Plain text content for the panel (escaped).
- `html` — string. Raw HTML content for the panel (rendered via `| safe`).
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes as key/value pairs.

## Usage

```njk
{% from "components/cascader/macro.njk" import cascader %}

{% call cascader({
  label: "Choose region",
  placeholder: "Select a region",
  expanded: true
}) %}
  <ul role="tree">
    <li role="treeitem" aria-expanded="false">Europe
      <ul role="group">
        <li role="treeitem">France</li>
        <li role="treeitem">Germany</li>
      </ul>
    </li>
  </ul>
{% endcall %}
```

## Keyboard

Cascader is headless. Consumers should follow the
[WAI-ARIA combobox + tree pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
to wire keyboard interaction:

- `Down`/`Up` to navigate options
- `Right` to enter a sub-list
- `Left` to leave a sub-list
- `Enter` to select
- `Escape` to close

## Accessibility

- `role="combobox"` and `aria-haspopup="tree"` describe the
  trigger/panel relationship.
- `aria-expanded` reflects the panel state.
- `aria-label` supplies the accessible name. When the cascader has a
  visible label, link it via `aria-labelledby` (passed through
  `attributes`).

## Headless

No CSS or JavaScript is bundled. Consumers wire open/close state,
selection, and styling.

## Testing

`components/cascader/macro.test.js` verifies the role, aria-label,
expanded state, trigger placeholder/value, hidden panel, and
attribute pass-through.

## References

- [WAI-ARIA: combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Ant Design: Cascader](https://ant.design/components/cascader)
