# Mark — Specification

Single source of truth for the Mark component: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element.

## Goal

A headless wrapper around the native `<mark>` element, like `kbd` and `code`.

## HTML Tag and CSS Class

- HTML tag: <mark>
- CSS class: .mark

## Requirements

1. Root is `<mark>` with first attribute `class="mark {class}"`.
2. Children render inside the root.
3. `restProps` spread onto the root.
4. No ARIA, CSS, inline styles, animation or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
