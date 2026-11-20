# ToolCallInput — Specification

Single source of truth for the ToolCallInput component: the input or arguments passed to a tool in a tool call.

## Goal

The input or arguments passed to the tool. A `<div>` that becomes a named group when `label` is given; the consumer puts a `<pre>` or formatted arguments inside.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tool-call-input

## Requirements

1. Root is <div> with first attribute `class="tool-call-input {class}"`.
2. `role="group"` with `aria-label` only when `label` is given
3. `restProps` spread onto the root; children render inside.
4. No CSS, inline styles, animation, timers or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
