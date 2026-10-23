# WheelPicker — Specification

Single source of truth for the WheelPicker component: a vertical single-select listbox where the selection follows the cursor.

## Goal

Let a reader choose one of a short list by arrow keys, typing or clicking, with the roles and keys of an APG listbox and the wheel look left to consumer CSS.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .wheel-picker (sub-elements `.wheel-picker-list`, `.wheel-picker-option`)

## Requirements

1. Root is `<div>` with first attribute `class="wheel-picker {class}"`.
2. The list is `role="listbox"` with `aria-label`, `aria-orientation="vertical"`, `tabindex="0"` (`-1` when disabled) and `aria-activedescendant` naming the chosen option.
3. Each option is `role="option"` with `aria-selected` and, when disabled, `aria-disabled="true"`.
4. Selection follows the cursor; there is no commit key.
5. ArrowDown/ArrowUp, Home/End, PageDown/PageUp and type-ahead behave as in `shared/wheel-picker.ts`; disabled options are skipped.
6. Arrow keys wrap only with `loop`; Home, End and the Page keys never wrap.
7. Handled keys call `preventDefault` (Blazor excepted: no JS interop).
8. Choosing the held option is a no-op: no callback, no event.
9. A disabled picker is not focusable and ignores keys and clicks.
10. With `name`, a hidden input carries the value.
11. Only the list scrolls to centre the chosen option, and never with animation.
12. `restProps` spread onto the root. No CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Svelte canonical implemented with tests per requirement, and `shared/wheel-picker.ts` with 15 tests
- [x] Ported to React, Vue, Angular, Blazor, Nunjucks, HTML, Web Components, Alpine (2026-10-23)
- [x] The 57 themes style the wheel (scroll-snap list, filled chosen option, focus ring)
- [ ] Used by `DateTimePicker` for its time columns
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
