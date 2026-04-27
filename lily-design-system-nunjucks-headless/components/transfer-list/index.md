# TransferList

a dual list box for moving items between two lists

## Description

TransferList renders a `<div role="group">` containing two
`<section>` regions — the source and the target — and an optional
actions panel between them. Consumers compose the inner lists
(typically `<ul role="listbox">`) and the action buttons (e.g.,
right-arrow and left-arrow icons).

The macro is headless: it provides the structural sections and
labels but does nothing about selection, movement, or filtering.

## HTML tag

`<div>` with `role="group"`

## CSS class

`transfer-list`

## Params

- `label` — string. **Required.** `aria-label` for the outer group.
- `sourceLabel` — string. **Required.** `aria-label` for the source
  `<section>`.
- `targetLabel` — string. **Required.** `aria-label` for the target
  `<section>`.
- `sourceText` — string. Plain text content for the source list
  (escaped).
- `sourceHtml` — string. Raw HTML for the source list (rendered via
  `| safe`).
- `targetText` — string. Plain text content for the target list
  (escaped).
- `targetHtml` — string. Raw HTML for the target list (rendered via
  `| safe`).
- `actionsHtml` — string. Optional raw HTML for action buttons
  rendered between the two lists. Omit to skip the actions container.
- `classes` — string. Consumer-provided extra CSS classes.
- `attributes` — object. Extra HTML attributes on the root element.

## Usage

```njk
{% from "components/transfer-list/macro.njk" import transferList %}

{{ transferList({
  label: "Manage members",
  sourceLabel: "Available members",
  targetLabel: "Selected members",
  sourceHtml: "
    <ul role='listbox'>
      <li role='option'>Alice</li>
      <li role='option'>Bob</li>
    </ul>
  ",
  targetHtml: "
    <ul role='listbox'>
      <li role='option'>Carol</li>
    </ul>
  ",
  actionsHtml: "
    <button type='button' aria-label='Move right'>→</button>
    <button type='button' aria-label='Move left'>←</button>
  "
}) }}
```

## Accessibility

- `role="group"` plus `aria-label` describe the dual-list pattern.
- Each list uses a semantic `<section>` with its own `aria-label`.
- The inner lists should use `role="listbox"` (single-select) or
  `role="listbox" aria-multiselectable="true"` (multi-select),
  following the
  [WAI-ARIA listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).

## Headless

No CSS or JavaScript is bundled. Consumers wire selection, movement,
filtering, and styling.

## Testing

`components/transfer-list/macro.test.js` verifies the role, group
labels, source/target sections, optional actions block, document
order, and pass-through.

## References

- [WAI-ARIA: listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [Ant Design: Transfer](https://ant.design/components/transfer)
