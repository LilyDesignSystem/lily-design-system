# ToolCall — Specification

Single source of truth for the ToolCall component: a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error.

## Goal

The root of a tool-call record: a native `<details>` closed by default. Put `ToolCallName` and `ToolCallStatus` in the summary and `ToolCallInput`, `ToolCallOutput` or `ToolCallError` in the body.

## HTML Tag and CSS Class

- HTML tag: <details>
- CSS class: .tool-call

## Requirements

1. Root is <details> with first attribute `class="tool-call {class}"`.
2. Native `<details>`/`<summary>` semantics; no ARIA role is added
3. `aria-busy="true"` only while `status="running"`
4. `data-status` is for consumer CSS; the visible status word (in `ToolCallStatus`) carries the meaning, never colour alone
5. `restProps` spread onto the root; children render inside.
6. No CSS, inline styles, animation, timers or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
