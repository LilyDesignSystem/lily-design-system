# RedOrangeYellowGreenBlueView

## Metadata

- Component: red-orange-yellow-green-blue-view
- PascalCase: RedOrangeYellowGreenBlueView
- Description: a read-only display of a five-level color status
- HTML tag: <div>
- CSS class: .red-orange-yellow-green-blue-view
- Interactive: no

## Companion

- red-orange-yellow-green-blue-picker

## Key Behaviors

- Renders as `<span aria-label={label}>` displaying a ROYGB status value as text content
- Five-level status scale: red, orange, yellow, green, blue
- Read-only display component, not interactive
- Value defaults to an empty string when not provided
- Uses props rune for prop destructuring
- Spreads `...restProps` on the `<span>` element for consumer extensibility
- No hardcoded user-facing strings; label and value are fully configurable

## ARIA

- `aria-label={label}` -- provides the accessible name for the status display, allowing screen readers to announce the context of the value

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible label for screen readers via `aria-label`
- `value`: string (default: `""`) -- the ROYGB status to display (e.g., "red", "orange", "yellow", "green", "blue")
- `...restProps`: any additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="red-orange-yellow-green-blue-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-orange-yellow-green-blue-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-orange-yellow-green-blue-view.html
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
