# MeasurementInstanceView

## Metadata

- Component: measurement-instance-view
- PascalCase: MeasurementInstanceView
- Description: a read-only display of a measurement value and unit
- HTML tag: <div>
- CSS class: .measurement-instance-view
- Interactive: no

## Companion

- measurement-instance-input

## Key Behaviors

- Renders as a `<span>` element displaying the measurement value as text content
- A measurement instance is a specific measured value (e.g., "72 kg", "98.6 F", "120/80 mmHg")
- Optional `label` prop maps to `aria-label` for additional accessible context
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## ARIA

- `aria-label` -- optionally set from the `label` prop to provide additional context beyond the displayed value

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: string (required) -- the measurement instance value to display
- `label`: string (optional) -- accessible name via aria-label for additional context

## Acceptance Criteria

- [ ] Renders <div> element with class="measurement-instance-view"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .measurement-instance-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/measurement-instance-view.html
