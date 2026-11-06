# MeasurementInstanceView

## Metadata

- Component: measurement-instance-view
- PascalCase: MeasurementInstanceView
- Description: a read-only display of a measurement value and unit
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .measurement-instance-view
- Interactive: no

## Companion

- measurement-instance-input

## Key Behaviors

- Renders as a `<span>` element displaying the measurement value as text content
- A measurement instance is a specific measured value (e.g., "72 kg", "98.6 F", "120/80 mmHg")
- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Text content is inherently accessible to screen readers
- Spreads `...restProps` on the root `<span>` element for consumer customization
- No hardcoded user-facing strings; all text comes through props

## ARIA

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: string (required) -- the measurement instance value to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value

## Acceptance Criteria

- [ ] Renders <div> element with class="measurement-instance-view"
- [ ] Has no `aria-label` on the root
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .measurement-instance-view in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/measurement-instance-view.html
