# ColorRadioInput

## Metadata

- Component: color-radio-input
- PascalCase: ColorRadioInput
- Description: a radio input for one choice of a color swatch <input type="radio">
- Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .color-radio-input
- Interactive: no

## Composition

- Pattern: RadioGroup/RadioInput
- Parent: color-radio-group

## Key Behaviors

- Renders a native `<input type="radio">`, named by `aria-label`
- Sets `data-color` and the `--color-radio-input-color` custom property to its colour, so consumer CSS can paint the swatch (`background: var(--color-radio-input-color)`); the component sets no other style
- Submits its colour unless a `value` is given
- Supports `name`, `checked` and `disabled`; a form reset restores `checked` natively
- One radio in a radio group; it replaces the earlier `color-picker-button` toggle button where there was one (removed 2026-11-15)
- Spreads `restProps` onto the input (e.g. `onchange`, `id`)

## ARIA

- `aria-label={label}` -- the radio's accessible name, the colour's name, so meaning is never colour alone

## Keyboard

- **Tab**: Moves focus to the checked radio in the group (or the first if none is checked)
- **Arrow Up / Arrow Left**: Moves to and checks the previous radio in the group
- **Arrow Down / Arrow Right**: Moves to and checks the next radio in the group
- **Space**: Checks the focused radio

## Props

- `color`: string (required) -- the CSS colour this option stands for, exposed as `data-color` and the `--color-radio-input-color` custom property
- `label`: string (required) -- accessible name via `aria-label`, the colour's name in words
- `name`: string (default: `undefined`) -- radio group name
- `value`: string (default: the colour) -- the submitted value
- `checked`: boolean (default: `false`) -- whether this radio starts checked
- `disabled`: boolean (default: `false`) -- whether this radio is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input type="radio"> element with class="color-radio-input"
- [ ] Has aria-label attribute
- [ ] Exposes data-color and --color-radio-input-color
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .color-radio-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/color-radio-input.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
