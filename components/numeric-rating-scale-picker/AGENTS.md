# NumericRatingScalePicker

## Metadata

- Component: numeric-rating-scale-picker
- PascalCase: NumericRatingScalePicker
- Description: a picker for a 0 to 10 rating, such as pain, with the consumer's words at each end
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <fieldset>
- CSS class: .numeric-rating-scale-picker
- Interactive: yes

## Key Behaviors

- Renders `<fieldset class="numeric-rating-scale-picker">` with a `<legend>`, and one radio per number from `min` (default 0) to `max` (default 10)
- `minLabel` and `maxLabel` are shown and linked to the end radios with `aria-describedby`
- `required` makes the group need an answer (on the first radio, as native radio groups do)
- Form reset restores the first value

## ARIA

- A native `<fieldset>` named by its `<legend>`; each radio is named by its number; the end radios are described by the anchor words

## Keyboard

- Tab moves into the group, to the chosen radio or the first; the arrow keys move and choose (native radios)

## Props

- `label`: string (required) — the question, rendered as the `<legend>`
- `min`: number (optional) — the lowest value, default 0
- `max`: number (optional) — the highest value, default 10
- `minLabel`: string (optional) — the words for the lowest value
- `maxLabel`: string (optional) — the words for the highest value
- `value`: string (optional) — the chosen value (bindable or controlled)
- `name`: string (optional) — the radios' form name, default `rating`
- `required`: boolean (optional) — the form needs an answer
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <fieldset> with class="numeric-rating-scale-picker"
- [x] The legend names the group, and there is one radio per number
- [x] The end radios are described by the anchor words
- [x] The arrow keys move and choose
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .numeric-rating-scale-picker in css-style-sheet-template.css
- Spec: spec/healthcare-ui/index.md
