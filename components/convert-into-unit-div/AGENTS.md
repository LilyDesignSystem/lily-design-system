# ConvertIntoUnitDiv

## Metadata

- Component: convert-into-unit-div
- PascalCase: ConvertIntoUnitDiv
- Description: the unit to convert into, such as a select box of currencies or lengths
- Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .convert-into-unit-div
- Interactive: no

## Key Behaviors

- The unit to convert into: a plain wrapper for the consumer's own control, typically a labelled select box.
- Spreads `restProps` onto the root; draws, converts and animates nothing

## ARIA

- No ARIA attributes; the consumer's own label and control carry the name

## Keyboard

- None of its own

## Props

- `class`: string -- Appended to the base class
- `children`: slot -- The content
- `...restProps`: HTML attributes -- Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> with class="convert-into-unit-div"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.convert-into-unit-div` in css-style-sheet-template.css
