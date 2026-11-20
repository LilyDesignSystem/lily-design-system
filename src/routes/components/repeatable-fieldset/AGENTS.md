# RepeatableFieldset

## Metadata

- Component: repeatable-fieldset
- PascalCase: RepeatableFieldset
- Description: a group of identical fieldsets that a person adds to and removes from ("add another")
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <fieldset>
- CSS class: .repeatable-fieldset
- Interactive: yes

## Key Behaviors

- Renders `<fieldset class="repeatable-fieldset">` with its `<legend>`, one `<fieldset class="repeatable-fieldset-item">` per item (each with a `-item-legend` and a `-remove` button), then a `-add` button and, when announcements are given, a `-status` region
- The items are the consumer's data; adding appends `newItem()`, removing takes out that item, so the others keep their values
- Legends and remove labels come from functions of the item's number (Web Components: templates with `{n}`), so no English is built
- Focus moves to the new item's first field on add and to the add button on remove (Blazor focuses the new item's fieldset, which has `tabindex="-1"`)
- `min` leaves out the remove buttons at the minimum; `max` disables the add button at the maximum
- In HTML and Nunjucks the buttons submit the form (`{name}-add`, `{name}-remove` with the index), so the pattern works as a server round trip without script

## ARIA

- The outer `<legend>` names the group, and each item's `<legend>` names it, announced with its fields
- `role="status"` announces the change politely, in the consumer's words

## Keyboard

- Tab moves through each item's fields, its remove button, then the add button; each button is native

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

## Acceptance Criteria

- [x] Renders <fieldset> with class="repeatable-fieldset" and one item fieldset per item
- [x] Add appends, renumbers, announces and focuses the new item's first field
- [x] Remove takes out that item, keeps the others, and focuses the add button
- [x] `min` and `max` limit the count
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .repeatable-fieldset in css-style-sheet-template.css
- Ministry of Justice design patterns, add another: https://design-patterns.service.justice.gov.uk/components/add-another/
- WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/
- Spec: spec/lessons/openehr/index.md
