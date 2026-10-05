# ToolCallName

## Metadata

- Component: tool-call-name
- PascalCase: ToolCallName
- Description: the name of the tool in a tool call, shown in the summary
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .tool-call-name
- Interactive: no

## Key Behaviors

- The tool's name inside the summary, for example `search_web`. A plain `<span>`; the consumer supplies the text.
- Spreads `restProps` onto the root; draws, times and animates nothing

## ARIA

- No ARIA attributes; the text is the name

## Keyboard

- None

## Props

- `class`: string -- Appended to the base class
- `children`: slot -- The tool name
- `...restProps`: HTML attributes -- Spread onto the root `<span>`

## Acceptance Criteria

- [ ] Renders <span> with class="tool-call-name"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.tool-call-name` in css-style-sheet-template.css
