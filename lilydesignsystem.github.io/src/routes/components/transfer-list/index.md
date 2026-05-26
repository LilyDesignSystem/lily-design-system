# Transfer List

A transfer list is a dual list box for moving items between two lists.
It groups a source list, optional action buttons, and a target list
into a single labeled region.

Use it for permission assignment, attendee selection, tag picking, or
any workflow where users move items from a candidate list to a chosen
list.

## Implementation Notes

- Renders a `<div class="transfer-list" role="group">` container
- `label` is **required** and sets `aria-label` on the group
- Source content renders inside `<section class="transfer-list-source" aria-label={sourceLabel}>`
- Target content renders inside `<section class="transfer-list-target" aria-label={targetLabel}>`
- Optional `actions` content renders inside `<div class="transfer-list-actions">`
- `sourceLabel` and `targetLabel` are **required** and set `aria-label` on each section
- Consumer typically supplies a Listbox in source and target slots and move buttons in actions

## Props

- `label`: string (**required**) -- aria-label on the outer group
- `sourceLabel`: string (**required**) -- aria-label for the source section
- `targetLabel`: string (**required**) -- aria-label for the target section
- `source`: slot (**required**) -- source list content
- `target`: slot (**required**) -- target list content
- `actions`: slot (optional) -- action buttons between the lists
- `...restProps`: any additional HTML attributes

## Usage

```html
<TransferList
  label="Assign roles"
  sourceLabel="Available roles"
  targetLabel="Selected roles"
>
  <template #source>
    <ul role="listbox">...</ul>
  </template>
  <template #actions>
    <button type="button" aria-label="Move to selected">→</button>
    <button type="button" aria-label="Move to available">←</button>
  </template>
  <template #target>
    <ul role="listbox">...</ul>
  </template>
</TransferList>
```

## Keyboard Interactions

- None at the container level — interactive behavior lives on the consumer-provided listboxes and action buttons.

## ARIA

- `role="group"` on the container with `aria-label` from the `label` prop
- Each `<section>` has `aria-label` from `sourceLabel` / `targetLabel`
- Consumer-supplied listboxes carry their own ARIA roles

## When to Use

- Use to move items between two lists when both lists need to be visible at once.
- Use for assignment workflows: roles, tags, attendees, permissions.

## When Not to Use

- Do not use for picking a single value — use Select or Listbox.
- Do not use when the candidate list is very long without filtering — provide a search input or use a different pattern.

## Headless

Renders semantic group and section markup with no styling. Consumer
provides the listboxes, the action buttons, the move logic, and the
visual layout.

## Styles

Consumer CSS targets `transfer-list`, `transfer-list-source`,
`transfer-list-target`, and `transfer-list-actions`. Use a horizontal
flex layout with the actions column between the two lists.

## Testing

- Verify the component renders a `<div>` element with class `transfer-list`
- Verify `role="group"` is set
- Verify `aria-label` equals the `label` prop
- Verify the source content renders inside `<section class="transfer-list-source">` with `aria-label` from `sourceLabel`
- Verify the target content renders inside `<section class="transfer-list-target">` with `aria-label` from `targetLabel`
- Verify the actions content renders inside `<div class="transfer-list-actions">` only when provided

## Advice

- **Designers**: Show counts and a search field above each list when the option set is large. Use clear directional icons on the move buttons.
- **Developers**: Use a Listbox component in each slot for proper ARIA. Manage the source and target arrays in the consumer.

## Related components

- `listbox` — a list of selectable options with keyboard navigation
- `select` — a dropdown select element for choosing one option
- `checkbox-group` — a group component that manages a collection of checkboxes with shared state

## References

- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- Ant Design Transfer: https://ant.design/components/transfer
