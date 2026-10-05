# ToolCallStatus

## Metadata

- Component: tool-call-status
- PascalCase: ToolCallStatus
- Description: the status of a tool call as a word, such as pending, running, done or error
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .tool-call-status
- Interactive: no

## Key Behaviors

- The status of a tool call as a visible word (pending, running, done, error), in the consumer's language. `status` only sets `data-status` for styling.
- Spreads `restProps` onto the root; draws, times and animates nothing

## ARIA

- No role: the status is plain text so it is read in order
- `data-status` is for consumer CSS only

## Keyboard

- None

## Props

- `class`: string -- Appended to the base class
- `status`: string (optional) -- `pending`, `running`, `done` or `error`; sets `data-status`
- `children`: slot -- The visible status word
- `...restProps`: HTML attributes -- Spread onto the root `<span>`

## Acceptance Criteria

- [ ] Renders <span> with class="tool-call-status"
- [ ] Attribute behaviour as above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.tool-call-status` in css-style-sheet-template.css
