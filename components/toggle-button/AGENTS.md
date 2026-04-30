# ToggleButton

## Metadata

- Component: toggle-button
- PascalCase: ToggleButton
- Description: a button that toggles between pressed and unpressed states
- HTML tag: <button>
- CSS class: .toggle-button
- Interactive: yes

## Key Behaviors

- Renders a native `<button type="button">` so keyboard and focus behaviour are inherited
- Reports state via `role="switch"` + `aria-checked` (the WAI-ARIA Switch pattern)
- Supports two-way binding on the `pressed` prop
- Native `disabled` attribute prevents click events automatically
- Spreads `restProps` onto the root `<button>` element

## ARIA

- `role="switch"` -- identifies the element as a two-state toggle switch
- `aria-checked={pressed}` -- communicates whether the toggle is currently on (`true`) or off (`false`)
- `aria-label={label}` -- provides the accessible name for the toggle control

## Keyboard

- Space: Toggles between on and off states (custom handler with `preventDefault`)
- Enter: Activates the button (native button behavior)

## Props

| Prop           | Type            | Default    | Description                                              |
| -------------- | --------------- | ---------- | -------------------------------------------------------- |
| `label`        | `string`        | (required) | Accessible name applied via `aria-label`                 |
| `pressed`      | `boolean`       | `false`    | Whether the toggle is on; bindable with two-way `pressed` binding   |
| `disabled`     | `boolean`       | `false`    | Whether the toggle is disabled                           |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<button>` element |

## Acceptance Criteria

- [ ] Renders <button> element with class="toggle-button"
- [ ] Has aria-label attribute
- [ ] Has role="switch"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .toggle-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/toggle-button.html
- WAI-ARIA Switch Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- WAI-ARIA Switch Role: https://www.w3.org/TR/wai-aria-1.2/#switch
