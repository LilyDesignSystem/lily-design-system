# ConvertIntoValueDiv

## Metadata

- Component: convert-into-value-div
- PascalCase: ConvertIntoValueDiv
- Description: the converted value, such as a text input showing the number of euros
- Status: beta — implemented and unit-tested in all nine headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .convert-into-value-div
- Interactive: no

## Key Behaviors

- The converted value: a plain wrapper for the consumer's own control, typically a labelled text input (read-only, or editable for a two-way converter) or an `<output>`.
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

- [ ] Renders <div> with class="convert-into-value-div"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.convert-into-value-div` in css-style-sheet-template.css
