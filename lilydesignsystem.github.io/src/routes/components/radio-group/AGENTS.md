# RadioGroup

## Metadata

- Component: radio-group
- PascalCase: RadioGroup
- Description: a group of radio buttons for selecting one option
- HTML tag: <div>
- CSS class: .radio-group
- Interactive: yes

## Composition

- Pattern: Group
- Children: radio-input

## Key Behaviors

- Renders a `<fieldset>` element with `role="radiogroup"` for explicit ARIA semantics
- The `aria-label` attribute on the fieldset provides an accessible name for the group
- Consumer provides radio button children (typically `<label>` elements wrapping `<input type="radio">`)
- Spreads `restProps` onto the fieldset for consumer customization
- No internal state management; radio selection is handled by native radio input behavior

## ARIA

- `role="radiogroup"` -- identifies the fieldset as a group of radio buttons
- `aria-label={label}` -- provides an accessible name for the group so screen readers announce the purpose

## Keyboard

- Tab: Moves focus into the radio group; within the group, arrow keys move between radio buttons (native browser behavior)
- Arrow Up / Arrow Down: Moves selection between radio buttons within the group (native radio behavior)
- Space: Selects the focused radio button (native radio behavior)

## Props

- `label`: string (required) -- accessible label for the radio group, applied via `aria-label`
- `children`: slot (required) -- radio button elements to render inside the fieldset
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="radio-group"
- [ ] Has aria-label attribute
- [ ] Has role="radiogroup"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .radio-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/radio-group.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
- WAI-ARIA Authoring Practices - Radio Group: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
