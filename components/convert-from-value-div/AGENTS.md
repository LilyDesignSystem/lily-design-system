# ConvertFromValueDiv

## Metadata

- Component: convert-from-value-div
- PascalCase: ConvertFromValueDiv
- Description: the value to convert from, such as a text input holding the number of dollars
- Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .convert-from-value-div
- Interactive: no

## Key Behaviors

- The value to convert from: a plain wrapper for the consumer's own control, typically a labelled text input (`inputmode="decimal"`).
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

- [ ] Renders <div> with class="convert-from-value-div"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.convert-from-value-div` in css-style-sheet-template.css
