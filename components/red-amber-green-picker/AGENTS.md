# RedAmberGreenPicker

## Metadata

- Component: red-amber-green-picker
- PascalCase: RedAmberGreenPicker
- Description: a picker for selecting a red/amber/green status
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <fieldset>
- Naming exception: a `-picker` root is a `<div>` by the suffix rule, but this one is a `<fieldset role="radiogroup">` of native radios in every library, as `five-star-rating-picker` is, so the group gets native radio keyboard behaviour, form submission and form reset (tasks.md P25-T18)
- CSS class: .red-amber-green-picker
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Children: none rendered; `red-amber-green-picker-button` is a separate part for a consumer composing its own group

## Companion

- red-amber-green-view

## Key Behaviors

- Renders a `<fieldset>` with `role="radiogroup"` holding three `<label>`/`<input type="radio">` pairs, one per status: red, amber, green
- Each option's visible text comes from `statusLabel(status)`, which is required: there is no English default, and without it an option shows its value
- The `value` prop (the checked status, `""` for none) is two-way
- The `name` prop (default `"status"`) groups the radios for form submission; a form reset restores the starting value
- `disabled` on the fieldset disables every radio

## ARIA

- `role="radiogroup"` -- on the `<fieldset>`, identifies the group as a set of radio buttons
- `aria-label={label}` -- the group's accessible name
- Each radio is named by its visible text, so a status is never colour alone (WCAG 1.4.1)

## Keyboard

- Tab: focus the checked radio, or the first if none is checked
- ArrowDown / ArrowRight: move to and check the next radio
- ArrowUp / ArrowLeft: move to and check the previous radio
- Space: check the focused radio

## Props

- `label`: string (required) -- accessible name for the group, applied via `aria-label`
- `statusLabel`: (status: string) => string (required) -- each option's visible text
- `value`: string (default: "") -- the checked status, bindable
- `name`: string (default: "status") -- radio group name for form submission
- `disabled`: boolean (default: false) -- disables the whole group
- `...restProps`: Any additional HTML attributes spread onto the fieldset

## Acceptance Criteria

- [ ] Renders <fieldset> element with class="red-amber-green-picker" and role="radiogroup"
- [ ] Has aria-label attribute
- [ ] One native radio per status, sharing one name
- [ ] No hardcoded option text
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-amber-green-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-amber-green-picker.html
- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- RAG Status: https://en.wikipedia.org/wiki/Traffic_light_rating_system
