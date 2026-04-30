# ColorPicker

## Metadata

- Component: color-picker
- PascalCase: ColorPicker
- Description: a two-dimensional board for picking colors by hue and saturation
- HTML tag: <div>
- CSS class: .color-picker
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Children: color-picker-button

## Key Behaviors

- Renders a `<div>` with `role="slider"` for ARIA slider semantics
- Supports two-way binding for both `x` and `y` coordinates (range 0-100)
- Implements `onkeydown` handler for arrow key navigation with step size of 1 (or 10 with Shift)
- Home key resets `x` to 0; End key sets `x` to 100
- Exposes `data-x` and `data-y` attributes for CSS positioning of a visual cursor
- `tabindex` is set to 0 when enabled, -1 when disabled
- `aria-disabled` is set only when disabled (omitted otherwise via `|| undefined`)

## ARIA

- `role="slider"` -- identifies the element as a slider control
- `aria-label="..."` -- provides an accessible name for the slider
- `aria-valuenow` -- current X value (0-100)
- `aria-valuemin="0"` -- minimum slider value
- `aria-valuemax="100"` -- maximum slider value
- `aria-disabled="true"` -- set when the control is disabled

## Keyboard

- ArrowRight: increase X by 1 (Shift: by 10)
- ArrowLeft: decrease X by 1 (Shift: by 10)
- ArrowUp: decrease Y by 1 (Shift: by 10)
- ArrowDown: increase Y by 1 (Shift: by 10)
- Home: set X to 0
- End: set X to 100

## Props

- `x`: number (default: `0`) -- horizontal position (0-100, saturation), two-way bindable via `x`
- `y`: number (default: `0`) -- vertical position (0-100, brightness), two-way bindable via `y`
- `label`: string (required) -- accessible name via `aria-label`
- `disabled`: boolean (default: `false`) -- whether the control is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="color-picker"
- [ ] Has aria-label attribute
- [ ] Has role="slider"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .color-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/color-picker.html
- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
