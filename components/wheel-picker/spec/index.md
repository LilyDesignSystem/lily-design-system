# WheelPicker — Specification

Single source of truth for the WheelPicker component: a single-select listbox, vertical by default, where the selection follows the cursor.

## Goal

Let a reader choose one of a short list by arrow keys, typing or clicking, with the roles and keys of an APG listbox and the wheel look left to consumer CSS.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .wheel-picker (sub-elements `.wheel-picker-list`, `.wheel-picker-option`)

## Requirements

1. Root is `<div>` with first attribute `class="wheel-picker {class}"`.
2. The list is `role="listbox"` with `aria-label`, `aria-orientation` (`orientation`, default `"vertical"`), `tabindex="0"` (`-1` when disabled) and `aria-activedescendant` naming the chosen option.
3. Each option is `role="option"` with `aria-selected` and, when disabled, `aria-disabled="true"`.
4. Selection follows the cursor; there is no commit key.
5. ArrowDown/ArrowUp (ArrowRight/ArrowLeft when horizontal, swapped right-to-left), Home/End, PageDown/PageUp and type-ahead behave as in `shared/wheel-picker.ts`; disabled options are skipped.
6. Arrow keys wrap only with `loop`; Home, End and the Page keys never wrap.
7. Handled keys call `preventDefault` (Blazor through `WheelPicker.razor.js`, once interactive).
8. Choosing the held option is a no-op: no callback, no event.
9. A disabled picker is not focusable and ignores keys and clicks.
10. With `name`, a hidden input carries the value. It is disabled while the picker is, takes `form`, and a form reset puts back the first value.
11. Only the list scrolls to centre the chosen option, and never with animation. When the user turns the list and it settles, the enabled option nearest the middle becomes the value, once; a scroll with no gesture chooses nothing (P26-T1, [detent-lessons](../../../spec/detent-lessons/index.md)).
12. `restProps` spread onto the root. No CSS, inline styles or hardcoded strings.

## Acceptance Criteria

- [x] Svelte canonical implemented with tests per requirement, and `shared/wheel-picker.ts` with 15 tests
- [x] Ported to React, Vue, Angular, Blazor, Nunjucks, HTML, Web Components, Alpine (2026-10-23)
- [x] The 63 themes style the wheel (scroll-snap list, filled chosen option, focus ring), and offer an opt-in drum, `.wheel-picker-drum` (P26-T5, 2026-11-10)
- [x] Not used by `DateTimePicker`, which keeps native `<select>` time controls (P26-T6, 2026-11-10: the reason is in [spec/date-time-picker](../../../spec/date-time-picker/index.md)); several wheels compose as the pattern in `AGENTS/components.md`
- [x] Scrolling chooses: when the list settles, the centred enabled option is the value (P26-T1, 2026-11-10; Blazor through its module, P26-T10)
- [x] The first and last options can rest in the centre in every theme (P26-T2, 2026-11-10)
- [x] A disabled picker is not submitted, and form reset restores the first value (P26-T3, 2026-11-10; Blazor through its module, P26-T10)
- [x] Horizontal orientation, with the arrows swapped right-to-left (P26-T4, 2026-11-10; Blazor through its module, P26-T10)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
