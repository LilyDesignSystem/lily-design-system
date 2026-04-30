# RedAmberGreenView

## Metadata

- Component: red-amber-green-view
- PascalCase: RedAmberGreenView
- Description: a read-only display of a red/amber/green status
- HTML tag: <div>
- CSS class: .red-amber-green-view
- Interactive: no

## Companion

- red-amber-green-picker

## Key Behaviors

- Renders as `<span aria-label={label}>` displaying the RAG status value as text content
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
- `value`: string (default: `""`) -- the RAG status to display (e.g., "red", "amber", "green")
- `...restProps`: any additional HTML attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="red-amber-green-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .red-amber-green-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/red-amber-green-view.html
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
