# ConvertFromDiv

## Metadata

- Component: convert-from-div
- PascalCase: ConvertFromDiv
- Description: the source side of a conversion, holding the value and unit to convert from
- Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .convert-from-div
- Interactive: no

## Key Behaviors

- The source side of a converter: a plain wrapper for a `ConvertFromValueDiv` and a `ConvertFromUnitDiv`.
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

- [ ] Renders <div> with class="convert-from-div"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.convert-from-div` in css-style-sheet-template.css
