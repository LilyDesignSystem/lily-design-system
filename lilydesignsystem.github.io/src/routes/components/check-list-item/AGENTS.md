# CheckListItem

## Metadata

- Component: check-list-item
- PascalCase: CheckListItem
- Description: one check list item component with a checkbox
- HTML tag: <li>
- CSS class: .check-list-item
- Interactive: yes

## Key Behaviors

- Uses `<li>` element for proper list semantics within a CheckList
- Contains a checkbox input for toggling completion state
- `aria-checked` reflects the current checked state
- Label text is associated with the checkbox for accessibility

## ARIA

- Implicit `listitem` role from `<li>` element
- `aria-checked` reflects the current state of the checkbox
- Label association via `<label>` element or `aria-label`

## Keyboard

- Tab: Focus the checkbox
- Space: Toggle the checkbox state

## Props

- `checked`: boolean (default: false) -- whether the item is checked
- `disabled`: boolean (default: false) -- whether the checkbox is disabled
- `label`: string (optional) -- accessible label override
- `onchange`: callback (optional) -- change handler
- `children`: slot -- item content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <li> element with class="check-list-item"
- [ ] Has checkbox input
- [ ] Has aria-checked attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .check-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/check-list-item.html
