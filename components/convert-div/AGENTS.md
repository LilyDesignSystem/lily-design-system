# ConvertDiv

## Metadata

- Component: convert-div
- PascalCase: ConvertDiv
- Description: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres
- Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .convert-div
- Interactive: no

## Key Behaviors

- The root of a converter: a labelled group holding a `ConvertFromDiv` (the value and unit to convert from) and a `ConvertIntoDiv` (the value and unit to convert into). The consumer does the arithmetic and supplies any rates.
- Spreads `restProps` onto the root; draws, converts and animates nothing

## ARIA

- `role="group"` and `aria-label` from the required `label` prop

## Keyboard

- None of its own

## Props

- `label`: string (required) -- Accessible name of the group (`aria-label`)
- `class`: string -- Appended to the base class
- `children`: slot -- The content
- `...restProps`: HTML attributes -- Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> with class="convert-div"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.convert-div` in css-style-sheet-template.css
