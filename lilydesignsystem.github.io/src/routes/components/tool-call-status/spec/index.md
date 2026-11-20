# ToolCallStatus — Specification

Single source of truth for the ToolCallStatus component: the status of a tool call as a word, such as pending, running, done or error.

## Goal

The status of a tool call as a visible word (pending, running, done, error), in the consumer's language. `status` only sets `data-status` for styling.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .tool-call-status

## Requirements

1. Root is <span> with first attribute `class="tool-call-status {class}"`.
2. No role: the status is plain text so it is read in order
3. `data-status` is for consumer CSS only
4. `restProps` spread onto the root; children render inside.
5. No CSS, inline styles, animation, timers or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
