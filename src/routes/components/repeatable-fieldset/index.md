# Repeatable Fieldset

RepeatableFieldset is the "add another" pattern: a question answered with a list of identical groups of fields, such as each medicine a person takes or each address they have lived at, where the person adds and removes groups. It renders a `<fieldset>` holding one `<fieldset>` per item, each with a legend and a remove button, and an add button. The items are the consumer's data; the component adds, removes, numbers the legends in the consumer's words, and moves focus.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<fieldset class="repeatable-fieldset">` with a `<legend>`, one `<fieldset class="repeatable-fieldset-item">` per item with a `-item-legend` and a `-remove` button, a `-add` button, and an optional `-status` region
- Adding appends `newItem()`; removing takes out that item, so the others keep their values
- Legends and remove labels are functions of the item's number, so the words are always the consumer's
- Focus moves to the new item's first field on add and to the add button on remove; Blazor focuses the new item's fieldset (`tabindex="-1"`) instead, since it uses no JS interop
- `min` and `max` limit the count
- HTML and Nunjucks render the server round trip: the buttons submit the form as `{name}-add` and `{name}-remove` (with the item's index), and the server returns the page one item longer or shorter

## Props

- `legend`: string (required) — names the whole group ("Medicines")
- `items`: T[] (two-way) — the consumer's items
- `newItem`: () => T (required) — makes a new item when the add button is pressed
- `itemLegend`: (number) => string (required) — each item's legend ("Medicine 2"); numbers start at 1
- `addLabel`: string (required) — the add button's text ("Add another medicine")
- `removeLabel`: (number) => string (required) — each remove button's text ("Remove medicine 2")
- `min`: number (default 0) — the fewest items; remove buttons are left out at the minimum
- `max`: number (optional) — the most items; the add button is disabled at the maximum
- `addedLabel`, `removedLabel`: (number) => string (optional) — announced politely after an add or a remove
- `item`: slot (required) — one item's fields, given the item and its index (`renderItem` in React, an `<ng-template>` in Angular, `ItemTemplate` in Blazor, a `<template>` child in Web Components)
- `...restProps`: any — additional HTML attributes spread onto the outer `<fieldset>`

## Usage

```html
<RepeatableFieldset
  legend="Medicines"
  bind:items="{medicines}"
  newItem="{()"
  =""
>
  ({ name: "" })} itemLegend={(n) => `Medicine ${n}`} addLabel="Add another medicine"
  removeLabel={(n) => `Remove medicine ${n}`} min={1} > {#snippet item(medicine, index)}
  <label for="{`medicine-${index}`}">Name</label>
  <input
    id="{`medicine-${index}`}"
    bind:value="{medicine.name}"
  />
  {/snippet}
</RepeatableFieldset>
```

## Keyboard Interactions

| Key          | Action                                                                   |
| ------------ | ------------------------------------------------------------------------ |
| Tab          | Moves through each item's fields, its remove button, then the add button |
| Enter, Space | Press the focused add or remove button                                   |

## ARIA

- The outer `<legend>` names the group; each item's `<legend>` names it, announced with its fields
- `role="status"` announces an add or a remove politely, in the consumer's words

## When to Use

- Use when a question has a list of answers and each answer has several fields: medicines, addresses, previous names, dependants.
- Use for an openEHR or FHIR element that may repeat (occurrences `0..*`).
- Use with `min` when at least one answer is required.

## When Not to Use

- Do not use for a list of single values — use `tag-input-div` or `checkbox-group`.
- Do not use for a fixed number of groups — write the `fieldset`s directly.
- Do not use for editing rows of a table — use the `data-grid` helper.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.repeatable-fieldset` class hook and its parts, and every word.

## Styles

`.repeatable-fieldset`, `.repeatable-fieldset-item`, `.repeatable-fieldset-item-legend`, `.repeatable-fieldset-remove`, `.repeatable-fieldset-add`, `.repeatable-fieldset-status`, and `[data-count]`, `[data-index]`.

## Testing

- Add appends an item, renumbers, announces and focuses the new item's first field
- Remove takes out that item, keeps the others' values and focuses the add button
- `min` and `max` limit the count

## Advice

- Name each remove button for its item ("Remove medicine 2"), not just "Remove".
- Give fields within an item ids from a stable key, not only the index, if items can be removed from the middle.
- With a server round trip, keep the typed values when the page comes back one item longer.

## Related components

- `fieldset` — a group of related fields with a legend
- `field` — one labelled field with its hint and error
- `tag-input-div` — a list of single values a person adds to

## Known limitations

None known.

## References

- Ministry of Justice design patterns, add another: https://design-patterns.service.justice.gov.uk/components/add-another/
- WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/
- Spec: spec/lessons/openehr/index.md

---

Lily™ and Lily Design System™ are trademarks.
