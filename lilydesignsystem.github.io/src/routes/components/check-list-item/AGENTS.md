# CheckListItem

## Metadata

- Component: check-list-item
- PascalCase: CheckListItem
- Description: one check list item component with a checkbox
- Purpose: Holds one tickable item of a checklist.
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
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

## Known limitations

Not in the Web Components catalog, by design. A custom element between an `<ol>` or `<ul>` and its `<li>` breaks the
content model, and the only form that avoids it, a customized built-in element, does not work in Safari. Without a
framework, write the native element with this component's class hook, or use the HTML catalog's markup. See
[the Web Components spec](https://github.com/LilyDesignSystem/lily-design-system/blob/main/lily-design-system-web-components-headless/spec/index.md).

## References

- Documentation: index.md
- CSS class: .check-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/check-list-item.html
