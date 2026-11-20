# ConvertIntoValueDiv — Specification

Single source of truth for the ConvertIntoValueDiv component: the converted value, such as a text input showing the number of euros.

## Goal

The converted value: a plain wrapper for the consumer's own control, typically a labelled text input (read-only, or editable for a two-way converter) or an `<output>`.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .convert-into-value-div

## Requirements

1. Root is <div> with first attribute `class="convert-into-value-div {class}"`.
2. No ARIA attributes; no `aria-label` (a role-less `<div>` may not be named).
3. `restProps` spread onto the root; children render inside.
4. No CSS, inline styles, animation, timers, arithmetic, data fetching or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all nine headless libraries with one test per requirement above
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
