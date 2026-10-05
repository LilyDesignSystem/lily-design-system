# ToolCallOutput

## Metadata

- Component: tool-call-output
- PascalCase: ToolCallOutput
- Description: the output or result returned by a tool in a tool call
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .tool-call-output
- Interactive: no

## Key Behaviors

- The output or result returned by the tool. A `<div>` that becomes a named group when `label` is given.
- Spreads `restProps` onto the root; draws, times and animates nothing

## ARIA

- `role="group"` with `aria-label` only when `label` is given

## Keyboard

- None. If a long `<pre>` inside scrolls, give it `tabindex="0"`

## Props

- `class`: string -- Appended to the base class
- `label`: string (optional) -- Adds `role="group"` and `aria-label`; without it neither is rendered
- `children`: slot -- The result
- `...restProps`: HTML attributes -- Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> with class="tool-call-output"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.tool-call-output` in css-style-sheet-template.css
