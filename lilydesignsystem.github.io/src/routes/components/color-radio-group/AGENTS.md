# ColorRadioGroup

## Metadata

- Component: color-radio-group
- PascalCase: ColorRadioGroup
- Description: a fieldset radio group for selecting a color swatch
- Status: experimental — new (2026-11-15), implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <fieldset>
- CSS class: .color-radio-group
- Interactive: no

## Composition

- Pattern: RadioGroup/RadioInput
- Children: color-radio-input

## Companion

- color-input

## Key Behaviors

- Renders a `<fieldset>` with `role="radiogroup"`, named by `aria-label`
- The consumer supplies the `ColorRadioInput` children, one per colour (any CSS colour), in the order they choose
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
- `children`: slot (required) -- the `ColorRadioInput` elements
- `...restProps`: any additional HTML attributes spread onto the fieldset

## Acceptance Criteria

- [ ] Renders <fieldset> element with class="color-radio-group" and role="radiogroup"
- [ ] Has aria-label attribute
- [ ] Renders the consumer's radios and no option text of its own
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .color-radio-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/color-radio-group.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- MDN CSS custom properties: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
