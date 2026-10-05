# ToolCallError — Specification

Single source of truth for the ToolCallError component: the error shown when a tool call fails.

## Goal

The error shown when a tool call fails. A `<div role="alert">` so the message is announced when it appears.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tool-call-error

## Requirements

1. Root is <div> with first attribute `class="tool-call-error {class}"`.
2. `role="alert"` announces the error when it is added
3. `restProps` spread onto the root; children render inside.
4. No CSS, inline styles, animation, timers or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
