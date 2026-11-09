# MeasurementUnitView

## Metadata

- Component: measurement-unit-view
- PascalCase: MeasurementUnitView
- Description: a read-only display of a measurement unit
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .measurement-unit-view
- Interactive: no

## Companion

- measurement-unit-input

## Key Behaviors

- Renders as a `<span>` element displaying the measurement unit as text content
- A measurement unit is a standard quantity for expressing measurements (e.g., "kg", "lb", "cm", "inch")
- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## ARIA

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: string (required) -- the measurement unit to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value

## Acceptance Criteria

- [ ] Renders <span> element with class="measurement-unit-view"
- [ ] Has no `aria-label` on the root
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .measurement-unit-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/measurement-unit-view.html
