# ToolCallInput

## Metadata

- Component: tool-call-input
- PascalCase: ToolCallInput
- Description: the input or arguments passed to a tool in a tool call
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .tool-call-input
- Interactive: no

## Key Behaviors

- The input or arguments passed to the tool. A `<div>` that becomes a named group when `label` is given; the consumer puts a `<pre>` or formatted arguments inside.
- Spreads `restProps` onto the root; draws, times and animates nothing

## ARIA

- `role="group"` with `aria-label` only when `label` is given

## Keyboard

- None. If a long `<pre>` inside scrolls, give it `tabindex="0"` so keyboard users can scroll it

## Props

- `class`: string -- Appended to the base class
- `label`: string (optional) -- Adds `role="group"` and `aria-label`; without it neither is rendered
- `children`: slot -- The arguments
- `...restProps`: HTML attributes -- Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> with class="tool-call-input"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.tool-call-input` in css-style-sheet-template.css
