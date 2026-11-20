# ToolCallOutput — Specification

Single source of truth for the ToolCallOutput component: the output or result returned by a tool in a tool call.

## Goal

The output or result returned by the tool. A `<div>` that becomes a named group when `label` is given.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tool-call-output

## Requirements

1. Root is <div> with first attribute `class="tool-call-output {class}"`.
2. `role="group"` with `aria-label` only when `label` is given
3. `restProps` spread onto the root; children render inside.
4. No CSS, inline styles, animation, timers or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
