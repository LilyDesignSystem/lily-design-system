# ThemePickerButton

## Metadata

- Component: theme-picker-button
- PascalCase: ThemePickerButton
- Description: a picker button for selecting a visual theme
- HTML tag: <button>
- CSS class: .theme-picker-button
- Interactive: yes

## Key Behaviors

- Uses `<button>` element for native keyboard and accessibility support
- `aria-pressed` indicates whether this theme is currently selected
- `aria-label` describes the theme this button represents

## ARIA

- Implicit `button` role from `<button>` element
- `aria-pressed` -- indicates whether this theme is currently selected
- `aria-label` -- describes the theme this button represents

## Keyboard

- Tab: Focus the button
- Enter: Select the theme
- Space: Select the theme

## Props

- `pressed`: boolean (default: false) -- whether this theme is currently selected
- `label`: string (required) -- accessible label describing the theme
- `disabled`: boolean (default: false) -- whether the button is disabled
- `onclick`: callback (optional) -- click handler
- `children`: slot -- button content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> element with class="theme-picker-button"
- [ ] Has aria-pressed attribute
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .theme-picker-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/theme-picker-button.html
