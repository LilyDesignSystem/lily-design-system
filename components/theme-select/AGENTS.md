# ThemeSelect

## Metadata

- Component: theme-select
- PascalCase: ThemeSelect
- Description: a select dropdown for choosing a theme
- HTML tag: <select>
- CSS class: .theme-select
- Interactive: yes

## Composition

- Pattern: Select/SelectOption
- Children: theme-select-option

## ARIA

- `aria-label={label}` -- provides an accessible name for the theme select since there is no visible `<label>` element

## Keyboard

- Tab: Moves focus to and from the select element (native browser behavior)
- Space/Enter: Opens the dropdown list when focused (native browser behavior)
- Arrow Up/Down: Navigates through theme options (native browser behavior)
- Escape: Closes the dropdown list (native browser behavior)

## Props

| Prop           | Type            | Default    | Description                                               |
| -------------- | --------------- | ---------- | --------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name applied via `aria-label`                  |
| `value`        | `string`        | `""`       | Bindable string representing the currently selected theme |
| `children`     | `slot`       | (required) | `<option>` elements representing available themes         |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<select>` element  |

## Acceptance Criteria

- [ ] Renders <select> element with class="theme-select"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .theme-select in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/theme-select.html
- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
- WCAG 1.4.12 Text Spacing (theme customization): https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
