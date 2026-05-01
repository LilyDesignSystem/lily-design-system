# ThemeSelectOption

## Metadata

- Component: theme-select-option
- PascalCase: ThemeSelectOption
- Description: one option in a theme select dropdown
- HTML tag: <option>
- CSS class: .theme-select-option
- Interactive: yes

## Composition

- Pattern: Select/SelectOption
- Parent: theme-select

## Key Behaviors

- Renders a native `<option>` element with `value` and visible text from children
- Used inside a `ThemeSelect` (or any `<select>`) to represent one available theme
- Native `<option>` styling is limited; the parent `<select>` controls dropdown appearance
- Spreads `restProps` onto the `<option>`

## ARIA

- Native `<option>` element provides built-in accessibility semantics
- `disabled` attribute communicates disabled state to assistive technology

## Keyboard

- Arrow Up/Down: Navigates between options within the parent select (native browser behavior)
- Enter/Space: Selects the focused option (native browser behavior)

## Props

| Prop           | Type            | Default    | Description                                              |
| -------------- | --------------- | ---------- | -------------------------------------------------------- |
| `value`        | `string`        | `""`       | The value submitted when this option is selected         |
| `disabled`     | `boolean`       | `false`    | Whether this option is disabled                          |
| `children`     | `slot`       | (required) | Display text for the option                              |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<option>` element |

## Acceptance Criteria

- [ ] Renders <option> element with class="theme-select-option"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .theme-select-option in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/theme-select-option.html
- MDN option element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
- MDN select element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
