# NetPromoterScoreRadioGroup

## Metadata

- Component: net-promoter-score-radio-group
- PascalCase: NetPromoterScoreRadioGroup
- Description: a fieldset radio group for selecting a 0-10 Net Promoter Score
- Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <fieldset>
- CSS class: .net-promoter-score-radio-group
- Interactive: no

## Composition

- Pattern: RadioGroup/RadioInput
- Children: net-promoter-score-radio-input

## Companion

- net-promoter-score-view

## Key Behaviors

- Renders a `<fieldset>` with `role="radiogroup"`, named by `aria-label`
- The consumer supplies the `NetPromoterScoreRadioInput` children, one per value (`0` to `10`), in the order they choose
- Selection, keyboard, form submission and form reset are the native radios'
- A `disabled` attribute on the fieldset (through rest props) disables every radio in it
- Spreads `...restProps` onto the fieldset

## ARIA

- `role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- `aria-label={label}` -- the group's accessible name

## Keyboard

- Tab: focus the checked radio, or the first if none is checked
- ArrowDown / ArrowRight: move to and check the next radio
- ArrowUp / ArrowLeft: move to and check the previous radio
- Space: check the focused radio

## Props

- `label`: string (required) -- accessible name for the group, applied via `aria-label`
- `children`: slot (required) -- the `NetPromoterScoreRadioInput` elements
- `...restProps`: any additional HTML attributes spread onto the fieldset

## Acceptance Criteria

- [ ] Renders <fieldset> element with class="net-promoter-score-radio-group" and role="radiogroup"
- [ ] Has aria-label attribute
- [ ] Renders the consumer's radios and no option text of its own
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .net-promoter-score-radio-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/net-promoter-score-radio-group.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
