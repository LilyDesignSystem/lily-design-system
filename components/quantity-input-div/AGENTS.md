# QuantityInputDiv

## Metadata

- Component: quantity-input-div
- PascalCase: QuantityInputDiv
- Description: a quantity entered as a number and a unit, each unit with its own limits
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <div>
- CSS class: .quantity-input-div
- Interactive: yes

## Key Behaviors

- Renders `<div class="quantity-input-div" role="group" aria-label>` holding a labelled `<input type="number" class="quantity-input-div-magnitude">` and, for more than one unit, a labelled `<select class="quantity-input-div-unit">`
- Each unit has its own `min`, `max` and `step`; the number takes the limits of the unit chosen, so the browser's own validation enforces them
- With one unit, the unit is text (`<span class="quantity-input-div-unit">`) linked to the number by `aria-describedby`, and a hidden field submits it when `name` is given
- Nothing is converted: changing the unit keeps the number as typed
- The fields are `{name}-magnitude` and `{name}-unit`, so a form submits without script; a form reset restores both

## ARIA

- `role="group"` with `aria-label` names the pair; each control has a visible `<label for>`
- A single unit is linked by `aria-describedby`

## Keyboard

- Tab moves between the number and the unit; each is a native control

## Props

- `label`: string (required) — the group's name ("Weight")
- `magnitudeLabel`: string (required) — the number input's label ("Amount")
- `unitLabel`: string (required when there is more than one unit) — the unit select's label ("Unit")
- `units`: { value, label, min?, max?, step? }[] (required) — the units offered, in the consumer's words; the first is the default
- `magnitude`: string (default "") — the number as typed; two-way
- `unit`: string (default: the first unit) — the unit chosen; two-way
- `name`: string (optional) — base name for `{name}-magnitude` and `{name}-unit`
- `required`, `disabled`: boolean (default false)
- `id`: string (optional) — base id
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <div role="group"> with class="quantity-input-div"
- [x] The number takes the chosen unit's limits, and keeps its value when the unit changes
- [x] One unit is text linked by `aria-describedby`, with a hidden field
- [x] A form reset restores both values (Svelte test)
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .quantity-input-div in css-style-sheet-template.css
- openEHR DV_QUANTITY: https://specifications.openehr.org/releases/RM/latest/data_types.html
- Spec: spec/lessons/openehr/index.md
