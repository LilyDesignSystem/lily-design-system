# StreamingText — Specification

Single source of truth for the StreamingText component: text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete.

## Goal

A headless polite, atomic status region whose busy state tells assistive technology that text is still arriving. Deliberately narrow: no sources, citations, actions, timing or animation.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .streaming-text

## Requirements

1. Root is `<div>` with first attribute `class="streaming-text {class}"`.
2. `role="status"`, `aria-live="polite"`, `aria-atomic="true"` always.
3. `streaming` true adds `aria-busy="true"` and `data-streaming="true"`; false (default) omits both entirely.
4. `label`, when given, sets `aria-label`; when absent no `aria-label`.
5. Children render inside the root.
6. `restProps` spread onto the root.
7. No timers, word splitting, animation, CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
