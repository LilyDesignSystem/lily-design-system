# MeasurementUnitView

## Metadata

- Component: measurement-unit-view
- PascalCase: MeasurementUnitView
- Description: a read-only display of a measurement unit
- HTML tag: <div>
- CSS class: .measurement-unit-view
- Interactive: no

## Companion

- measurement-unit-input

## Key Behaviors

- Renders as a `<span>` element displaying the measurement unit as text content
- A measurement unit is a standard quantity for expressing measurements (e.g., "kg", "lb", "cm", "inch")
- Optional `label` prop maps to `aria-label` for additional accessible context
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed unit abbreviation

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: string (required) -- the measurement unit to display
- `label`: string (optional) -- accessible name via aria-label for additional context

## Acceptance Criteria

- [ ] Renders <div> element with class="measurement-unit-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .measurement-unit-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/measurement-unit-view.html
