# Picture — Specification

Single source of truth for the Picture component: a responsive image wrapper that lets the browser choose among several sources, using the native picture element.

## Goal

A headless wrapper around the native `<picture>` element, like `mark`, `kbd` and `code`.

## HTML Tag and CSS Class

- HTML tag: <picture>
- CSS class: .picture

## Requirements

1. Root is `<picture>` with first attribute `class="picture {class}"`.
2. Children (`<source>` elements and one `<img>`) render inside the root; the `<img>`'s `alt` is the consumer's.
3. `restProps` spread onto the root.
4. No ARIA, CSS, inline styles, animation or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
