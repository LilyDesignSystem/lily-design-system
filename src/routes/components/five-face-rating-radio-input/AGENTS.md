# FiveFaceRatingRadioInput

## Metadata

- Component: five-face-rating-radio-input
- PascalCase: FiveFaceRatingRadioInput
- Description: a radio input for one choice of a 1-5 satisfaction rating <input type="radio">
- Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .five-face-rating-radio-input
- Interactive: no

## Composition

- Pattern: RadioGroup/RadioInput
- Parent: five-face-rating-radio-group

## Key Behaviors

- Renders a native `<input type="radio">`, named by `aria-label`
- Sets `data-value` to its value, so consumer CSS can colour or draw each option (`.five-face-rating-radio-input[data-value="1"]`)
- Supports `name`, `checked` and `disabled`; a form reset restores `checked` natively
- One radio in a radio group; it replaces the earlier `five-face-rating-picker-button` toggle button where there was one (removed 2026-11-15)
- Spreads `restProps` onto the input (e.g. `onchange`, `id`)

## ARIA

- `aria-label={label}` -- the radio's accessible name, the option's words, so meaning is never colour alone

## Keyboard

- **Tab**: Moves focus to the checked radio in the group (or the first if none is checked)
- **Arrow Up / Arrow Left**: Moves to and checks the previous radio in the group
- **Arrow Down / Arrow Right**: Moves to and checks the next radio in the group
- **Space**: Checks the focused radio

## Props

- `value`: string (required) -- the status or rating this radio stands for (`1` to `5`), also exposed as `data-value`
- `label`: string (required) -- accessible name via `aria-label`
- `name`: string (default: `undefined`) -- radio group name
- `checked`: boolean (default: `false`) -- whether this radio starts checked
- `disabled`: boolean (default: `false`) -- whether this radio is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input type="radio"> element with class="five-face-rating-radio-input"
- [ ] Has aria-label attribute
- [ ] Exposes data-value
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .five-face-rating-radio-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/five-face-rating-radio-input.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
