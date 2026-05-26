# RadioInput

## Metadata

- Component: radio-input
- PascalCase: RadioInput
- Description: a single radio button input <input type="radio">
- HTML tag: <input>
- CSS class: .radio-input
- Interactive: no

## Key Behaviors

- Renders a native `<input type="radio">` element
- Uses `aria-label` for accessible naming (no visible label element included)
- Supports `name` attribute for grouping radio buttons into a mutually exclusive set
- Supports `value` attribute for identifying which option is selected
- Supports `checked` and `disabled` states
- Does not use two-way binding for checked state; consumers can use event handlers or bind directly
- Spreads `restProps` for consumer customization (e.g., `onchange`, `id`)

## ARIA

- `aria-label={label}` -- provides an accessible name for the radio button since no visible `<label>` element is included

## Keyboard

- **Tab**: Moves focus to the selected radio in the group (or the first if none selected)
- **Arrow Up / Arrow Left**: Moves selection to the previous radio in the group
- **Arrow Down / Arrow Right**: Moves selection to the next radio in the group
- **Space**: Selects the focused radio button (if not already selected)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `name`: string (default: `undefined`) -- radio group name for mutual exclusion
- `value`: string (default: `undefined`) -- the value representing this radio option
- `checked`: boolean (default: `false`) -- whether this radio button is currently selected
- `disabled`: boolean (default: `false`) -- whether the radio button is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Acceptance Criteria

- [ ] Renders <input> element with class="radio-input"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .radio-input in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/radio-input.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
