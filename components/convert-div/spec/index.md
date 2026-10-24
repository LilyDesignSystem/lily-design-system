# ConvertDiv — Specification

Single source of truth for the ConvertDiv component: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres.

## Goal

The root of a converter: a labelled group holding a `ConvertFromDiv` (the value and unit to convert from) and a `ConvertIntoDiv` (the value and unit to convert into). The consumer does the arithmetic and supplies any rates.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .convert-div

## Requirements

1. Root is <div> with first attribute `class="convert-div {class}"`.
2. `role="group"` and `aria-label` from the required `label` prop.
3. `restProps` spread onto the root; children render inside.
4. No CSS, inline styles, animation, timers, arithmetic, data fetching or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all nine headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
