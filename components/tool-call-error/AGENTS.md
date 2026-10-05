# ToolCallError

## Metadata

- Component: tool-call-error
- PascalCase: ToolCallError
- Description: the error shown when a tool call fails
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .tool-call-error
- Interactive: no

## Key Behaviors

- The error shown when a tool call fails. A `<div role="alert">` so the message is announced when it appears.
- Spreads `restProps` onto the root; draws, times and animates nothing

## ARIA

- `role="alert"` announces the error when it is added

## Keyboard

- None

## Props

- `class`: string -- Appended to the base class
- `children`: slot -- The error message
- `...restProps`: HTML attributes -- Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> with class="tool-call-error"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.tool-call-error` in css-style-sheet-template.css
