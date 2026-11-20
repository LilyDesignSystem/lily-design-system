# ToolCallName — Specification

Single source of truth for the ToolCallName component: the name of the tool in a tool call, shown in the summary.

## Goal

The tool's name inside the summary, for example `search_web`. A plain `<span>`; the consumer supplies the text.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .tool-call-name

## Requirements

1. Root is <span> with first attribute `class="tool-call-name {class}"`.
2. No ARIA attributes; the text is the name
3. `restProps` spread onto the root; children render inside.
4. No CSS, inline styles, animation, timers or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
