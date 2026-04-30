# MeasurementSystemView

## Metadata

- Component: measurement-system-view
- PascalCase: MeasurementSystemView
- Description: a read-only display of a measurement system
- HTML tag: <div>
- CSS class: .measurement-system-view
- Interactive: no

## Companion

- measurement-system-input

## Key Behaviors

- Renders as a `<span>` element displaying the measurement system name as text content
- A measurement system is a collection of units and rules (e.g., "metric", "imperial", "SI")
- Optional `label` prop maps to `aria-label` for additional accessible context
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed system name

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: string (required) -- the measurement system name to display
- `label`: string (optional) -- accessible name via aria-label for additional context

## Acceptance Criteria

- [ ] Renders <div> element with class="measurement-system-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .measurement-system-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/measurement-system-view.html
