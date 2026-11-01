# WarningText — Specification

Single source of truth for the WarningText component: a short warning shown as an icon and a bold line of text, with a visually hidden prefix supplied by the consumer.

## Goal

The GOV.UK and DHCW warning-text pattern, headless: an optional consumer-supplied icon, hidden from assistive technology, and one `<strong>` line whose visually hidden prefix the consumer writes in their own language (tasks.md P18-T4; `spec/dhcw-design-system-lessons` catalog gaps).

## HTML Tag and CSS Class

- HTML tag: <div> (no `-text` suffix rule exists; the decision is recorded in `AGENTS.md`)
- CSS class: .warning-text; sub-classes `.warning-text-icon`, `.warning-text-text`

## Requirements

1. Root is `<div>` with first attribute `class="warning-text {class}"`.
2. When an icon is supplied it renders inside `<span class="warning-text-icon" aria-hidden="true">`, before the text; with no icon, no wrapper (Angular: the wrapper is always present, empty).
3. Children render inside `<strong class="warning-text-text">`; the hidden prefix is part of the children, never a prop or default.
4. `restProps` spread onto the root.
5. No role, no live region, no CSS, no inline styles and no hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries and the Alpine snippet, with tests for the requirements above
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
