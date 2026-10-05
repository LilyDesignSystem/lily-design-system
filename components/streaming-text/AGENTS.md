# StreamingText

## Metadata

- Component: streaming-text
- PascalCase: StreamingText
- Description: text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .streaming-text
- Interactive: no

## Key Behaviors

- Renders a `<div role="status" aria-live="polite" aria-atomic="true">` containing the children
- `streaming` adds `aria-busy="true"` and `data-streaming="true"`; absent when false
- `label` (optional) sets `aria-label`
- Draws, times and animates nothing; spreads `restProps` onto the root

## ARIA

- `role="status"`, `aria-live="polite"`, `aria-atomic="true"`
- `aria-busy="true"` while streaming

## Keyboard

- No keyboard interactions

## Props

- `class`: string (default: `""`) -- appended to the base class
- `label`: string (optional) -- accessible name
- `streaming`: boolean (default: `false`) -- true while chunks are still arriving
- `children`: slot -- the text so far
- `...restProps`: HTML attributes -- spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="streaming-text" and role="status"
- [ ] aria-live="polite" and aria-atomic="true"
- [ ] aria-busy and data-streaming only while streaming
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.streaming-text` in css-style-sheet-template.css
- [WAI-ARIA status role](https://www.w3.org/TR/wai-aria-1.2/#status)
