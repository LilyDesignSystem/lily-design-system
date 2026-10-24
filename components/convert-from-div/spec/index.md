# ConvertFromDiv — Specification

Single source of truth for the ConvertFromDiv component: the source side of a conversion, holding the value and unit to convert from.

## Goal

The source side of a converter: a plain wrapper for a `ConvertFromValueDiv` and a `ConvertFromUnitDiv`.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .convert-from-div

## Requirements

1. Root is <div> with first attribute `class="convert-from-div {class}"`.
2. No ARIA attributes; no `aria-label` (a role-less `<div>` may not be named).
3. `restProps` spread onto the root; children render inside.
4. No CSS, inline styles, animation, timers, arithmetic, data fetching or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all nine headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
