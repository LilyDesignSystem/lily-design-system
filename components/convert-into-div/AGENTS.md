# ConvertIntoDiv

## Metadata

- Component: convert-into-div
- PascalCase: ConvertIntoDiv
- Description: the target side of a conversion, holding the value and unit to convert into
- Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .convert-into-div
- Interactive: no

## Key Behaviors

- The target side of a converter: a plain wrapper for a `ConvertIntoValueDiv` and a `ConvertIntoUnitDiv`.
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

- [ ] Renders <div> with class="convert-into-div"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.convert-into-div` in css-style-sheet-template.css
