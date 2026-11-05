# TagInputDiv

## Metadata

- Component: tag-input-div
- PascalCase: TagInputDiv
- Description: an input for adding and removing tags
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .tag-input-div
- Interactive: yes

## Key Behaviors

- Renders a `<div role="group">` holding the consumer's tags and a native `<input type="text" class="tag-input-div-field">`
- The consumer keeps the tags and renders them as children, with their remove buttons; the component never holds the list
- Uses `aria-label` on both the group and the field
- Handles Enter via a `keydown` handler that calls `onadd` with the trimmed value and clears the field. With no text it stays a normal Enter, which submits a surrounding form; during an IME composition it confirms the composition
- Supports two-way binding on the `value` prop
- Sets `disabled`, `placeholder`, `name` and `required` on the field
- Spreads `restProps` onto the root `<div>` for consumer customization

## ARIA

- `role="group"` with `aria-label={label}` -- names the tags and the field together
- `aria-label={label}` -- names the text field

## Keyboard

- Enter: When the field has a non-empty trimmed value, prevents default form submission, calls `onadd` with the trimmed value, and clears the field. With no text it stays a normal Enter. During an IME composition it confirms the composition

## Props

- `label`: string (required) -- accessible name for the group and the field via `aria-label`
- `value`: string (default: `""`) -- current field text; bindable with two-way `value` binding
- `onadd`: `(value: string) => void` (optional) -- callback fired when Enter is pressed with a non-empty trimmed value (Vue: the `add` event; Angular: the `added` output; Web Components: `lily-add`; HTML and Nunjucks: `tag-input-div-add`)
- `disabled`: boolean (default: `false`) -- whether the field is disabled
- `placeholder`: string (optional) -- the field's placeholder
- `name`: string (optional) -- the field's name
- `required`: boolean (default: `false`) -- whether the field is required
- `children`: slot (optional) -- the tags so far, rendered before the field
- `...restProps`: unknown -- additional attributes spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="tag-input-div"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .tag-input-div in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/tag-input-div.html
- WAI-ARIA textbox role (implicit via input type="text"): https://www.w3.org/TR/wai-aria-1.2/#textbox
