# Meter

## Metadata

- Component: meter
- PascalCase: Meter
- Description: a gauge displaying a scalar value within a known range
- HTML tag: <meter>
- CSS class: .meter
- Interactive: no

## Key Behaviors

- Renders a native `<meter>` element with the value displayed as fallback text content
- Uses `aria-label` for an accessible name describing what the meter measures
- Supports the full set of `<meter>` attributes: `value`, `min`, `max`, `low`, `high`, `optimum`
- The `min` and `max` props default to 0 and 100 respectively
- `low`, `high`, and `optimum` are optional and default to undefined
- Spreads `restProps` onto the meter for consumer customization
- pattern: standard props destructuring with typed props

## ARIA

- `aria-label={label}` -- provides an accessible name describing what the meter measures

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `value`: number (required) -- the current measured value
- `min`: number (default: `0`) -- the minimum bound of the range
- `max`: number (default: `100`) -- the maximum bound of the range
- `low`: number (optional) -- the upper bound of the low range threshold
- `high`: number (optional) -- the lower bound of the high range threshold
- `optimum`: number (optional) -- the optimal value within the range
- `label`: string (required) -- accessible name for the meter via `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the `<meter>` element

## Acceptance Criteria

- [ ] Renders <meter> element with class="meter"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .meter in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/meter.html
- HTML meter element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter
- WAI-ARIA meter role: https://www.w3.org/TR/wai-aria-1.2/#meter
