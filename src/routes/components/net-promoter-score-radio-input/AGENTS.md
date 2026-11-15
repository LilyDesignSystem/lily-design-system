# NetPromoterScoreRadioInput

## Metadata

- Component: net-promoter-score-radio-input
- PascalCase: NetPromoterScoreRadioInput
- Description: a radio input for one choice of a 0-10 Net Promoter Score <input type="radio">
- Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .net-promoter-score-radio-input
- Interactive: no

## Composition

- Pattern: RadioGroup/RadioInput
- Parent: net-promoter-score-radio-group

## Key Behaviors

- Renders a native `<input type="radio">`, named by `aria-label`
- Sets `data-value` to its value, so consumer CSS can colour or draw each option (`.net-promoter-score-radio-input[data-value="0"]`)
- Supports `name`, `checked` and `disabled`; a form reset restores `checked` natively
- The radio counterpart of `net-promoter-score-picker-button`: a radio in a radio group, not a toggle button
- Spreads `restProps` onto the input (e.g. `onchange`, `id`)

## ARIA

- `aria-label={label}` -- the radio's accessible name, the option's words, so meaning is never colour alone

## Keyboard

- **Tab**: Moves focus to the checked radio in the group (or the first if none is checked)
- **Arrow Up / Arrow Left**: Moves to and checks the previous radio in the group
- **Arrow Down / Arrow Right**: Moves to and checks the next radio in the group
- **Space**: Checks the focused radio

## Props

- `value`: string (required) -- the status or rating this radio stands for (`0` to `10`), also exposed as `data-value`
- `label`: string (required) -- accessible name via `aria-label`
- `name`: string (default: `undefined`) -- radio group name
- `checked`: boolean (default: `false`) -- whether this radio starts checked
- `disabled`: boolean (default: `false`) -- whether this radio is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input type="radio"> element with class="net-promoter-score-radio-input"
- [ ] Has aria-label attribute
- [ ] Exposes data-value
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .net-promoter-score-radio-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/net-promoter-score-radio-input.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
