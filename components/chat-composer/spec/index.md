# ChatComposer — Specification

Single source of truth for the ChatComposer component: a chat input form with a text area that grows with its content, sends on Enter, and turns its send button into a stop button while a reply is in progress.

## Goal

A narrow headless chat input: keyboard sending, an IME guard, a growing textarea, and one button that is send or stop.

## HTML Tag and CSS Class

- HTML tag: <form>
- CSS class: .chat-composer

## Requirements

1. Root is `<form>` with first attribute `class="chat-composer {class}"`; children render before the textarea.
2. A `<textarea class="chat-composer-input">` named by the required `label`.
3. Exactly one `<button class="chat-composer-button">` whose visible word is `sendLabel`, or `stopLabel` while `busy`.
4. Send: `type="submit"`, `data-state="send"`, disabled when `value.trim()` is empty or `disabled`. Stop: `type="button"`, `data-state="stop"`, enabled unless `disabled`.
5. Enter (no modifier, not composing) prevents the line break and sends when there is text, not `busy`, not `disabled`. Shift+Enter inserts a line break. Enter during IME composition does nothing.
6. Form submit sends under the same conditions. Pressing stop calls the stop handler and never send.
7. `rows` = line count clamped to `minRows` (1) and `maxRows` (8).
8. `disabled` disables the textarea and the button; `placeholder` and `name` reach the textarea.
9. The component never clears `value`. No CSS, inline styles, animation or hardcoded strings.

## Acceptance Criteria

- [x] Implemented in all eight headless libraries with one test per requirement above (Blazor: Ctrl/Cmd+Enter and the button instead of plain Enter; Nunjucks/HTML: markup-only initial state)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

---

Lily™ and Lily Design System™ are trademarks.
