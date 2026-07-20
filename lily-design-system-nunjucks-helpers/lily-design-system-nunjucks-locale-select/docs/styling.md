# Styling

The control is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the macro
exposes. For RTL-specific layout guidance see [rtl.md](./rtl.md).

**The package ships no positioning.** The listbox is a plain `<ul>` in
normal flow, so without CSS it pushes the page around when it opens.
Positioning it is the consumer's job — see
[Positioning the listbox](#positioning-the-listbox) below. This is not
an oversight; a headless helper cannot know whether your list should
drop down, drop up, anchor to the inline start or end, or render in a
popover.

## Class hooks

| Selector                       | Element                                  |
| ------------------------------ | ---------------------------------------- |
| `.locale-select`               | The root `<div>`.                        |
| `.locale-select.{classes}`     | Both classes when `opts.classes` is set. |
| `.locale-select-button`        | The icon `<button>` that opens the listbox. |
| `.locale-select-icon`          | The `<span>` wrapping the default globe glyph. Absent when a `{% call %}` block overrides it. |
| `.locale-select-list`          | The `<ul role="listbox">`.               |
| `.locale-select-option`        | Each `<li role="option">`.               |
| `.locale-select-status`        | The consumer-rendered status region announcing the active locale (see [accessibility.md](./accessibility.md)). Ships in the examples; not emitted by the macro. |

The `.locale-select-placeholder` hook is **gone**. There is no
placeholder option any more.

### State hooks

| Selector                                     | Meaning                                   |
| -------------------------------------------- | ----------------------------------------- |
| `.locale-select-list:not([hidden])`          | The listbox is open.                      |
| `.locale-select-button[aria-expanded="true"]`| The button while its listbox is open.     |
| `.locale-select-option[aria-selected="true"]`| The applied locale.                       |
| `.locale-select-option[data-active]`         | The keyboard-active option (roving highlight). Distinct from selected. |

Style `[data-active]` and `[aria-selected]` differently: the first is
"where the keyboard cursor is", the second is "what is in effect". A
user arrowing through the list expects to see both at once.

### The status region

The closed button shows only a glyph, so the pattern pairs it with a
visible `aria-live="polite"` status line. Style it as ordinary body
text next to the control:

```css
.locale-select-status {
    margin: 0;
    font-size: 0.875rem;
    color: var(--theme-color-text-muted, #4b5563);
}
```

Keep it **visible** by default — it helps sighted and
cognitive-accessibility users too. Where a design genuinely cannot
spare the space, make it visually hidden rather than removing it, so
screen-reader users still get the announcement:

```css
/* Visually hidden, still announced. Prefer the visible variant. */
.locale-select-status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
}
```

The region inherits the document's `dir`, so it flips with an RTL
locale automatically. If the message text is written in the newly
selected language, set the element's own `lang` alongside its
`textContent`.

## Attribute hooks

| Attribute                          | On                          | Purpose                                |
| ---------------------------------- | --------------------------- | -------------------------------------- |
| `lang="<bcp47>"`                   | `target` (default `<html>`) | Active locale, BCP 47 hyphen form.     |
| `dir="ltr\|rtl"`                   | `target` (default `<html>`) | Script direction; skipped when `applyDir` is false. |
| `lang="<bcp47>"`                   | each `<li role="option">`   | WCAG 3.1.2 Language of Parts.          |
| `data-lily-locale-select-root`     | the root `<div>`            | `autoInit()` selector.                 |
| `data-lily-locale-select-button`   | the `<button>`              | Client lookup hook.                    |
| `data-lily-locale-select-list`     | the `<ul>`                  | Client lookup hook.                    |
| `data-lily-locale-select-input`    | the hidden `<input>`        | Client lookup hook.                    |
| `data-active`                      | the active `<li>`           | Roving keyboard highlight.             |

Per-option `lang` is also a styling hook: `:lang()` lets you set a
script-appropriate font per option.

```css
.locale-select-option:lang(ar) { font-family: var(--font-arabic, serif); }
.locale-select-option:lang(ja) { font-family: var(--font-japanese, sans-serif); }
```

## Positioning the listbox

The macro emits no positioning. The minimum viable pattern is an
absolutely-positioned list inside a relatively-positioned root:

```css
.locale-select {
    position: relative;
    display: inline-block;
}

.locale-select-list {
    position: absolute;
    inset-inline-start: 0;
    top: 100%;
    z-index: 10;
    min-width: max-content;
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
    max-height: 60vh;
    overflow-y: auto;
}
```

Use `inset-inline-start` rather than `left`. This matters more here
than for most controls: choosing an RTL locale flips the document's
`dir` under the control itself, and a `left`-anchored list will jump
to the wrong edge the moment the user picks Arabic or Hebrew. See
[rtl.md](./rtl.md).

The `max-height` plus `overflow-y` matter too: the client calls
`scrollIntoView({block: "nearest"})` on the active option as the
keyboard moves through the list, which only does anything if the list
is a scroll container. With a long locale list this is the difference
between a usable keyboard experience and one where the active option
disappears off-screen.

## Suggested baseline CSS

Drop into the consumer's app stylesheet, after the positioning rules
above:

```css
.locale-select-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* Icon-only: keep the hit target at least 44x44 (WCAG 2.5.8 AAA). */
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding: 0.25rem;
    border: 1px solid var(--theme-color-base-300, currentColor);
    border-radius: var(--theme-radius-selector, 0.25rem);
    background: var(--theme-color-base-background, white);
    color: var(--theme-color-base-content, currentColor);
    cursor: pointer;
    line-height: 1;
}

.locale-select-icon {
    font-size: 1.25rem;
}

/* The list takes DOM focus while open, so give it a visible ring too. */
.locale-select-button:focus-visible,
.locale-select-list:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}

.locale-select-list {
    border: 1px solid var(--theme-color-base-300, currentColor);
    border-radius: var(--theme-radius-selector, 0.25rem);
    background: var(--theme-color-base-background, white);
    color: var(--theme-color-base-content, currentColor);
}

.locale-select-option {
    padding: 0.375rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    /* Locale names are content, not chrome: let bidi resolve per option. */
    unicode-bidi: isolate;
}

/* Where the keyboard cursor is. */
.locale-select-option[data-active] {
    background: var(--theme-color-base-200, #e5e7eb);
}

/* What is actually applied. Not colour-only: add a mark. */
.locale-select-option[aria-selected="true"] {
    font-weight: 600;
}

.locale-select-option[aria-selected="true"]::before {
    content: "\2713\00a0"; /* check mark + nbsp */
}

.locale-select-option:not([aria-selected="true"])::before {
    content: "\00a0\00a0"; /* keep the labels aligned */
}
```

`unicode-bidi: isolate` on the options is worth keeping: a list mixing
"English", "العربية", and "עברית" will otherwise reorder punctuation
across option boundaries in confusing ways.

## Sizing

The old width recipe (`field-sizing: content` plus a `max-width` cap on
a `<select>`) is obsolete — there is no `<select>`, and the closed
control is a fixed-size icon button that does not grow with the locale
list at all. Size the button for its glyph and its 44×44 minimum
target; size the list with `min-width: max-content` so long locale
names are not truncated while it is open.

## Don'ts

- **Don't override `hidden` with a `display` rule.** A bare
  `.locale-select-list { display: block }` beats the `hidden`
  attribute and pins the list permanently open, out of sync with
  `aria-expanded`. Scope open-state styling to
  `.locale-select-list:not([hidden])`.
- Don't position the list with `left` / `right`; use
  `inset-inline-start` / `inset-inline-end` so it survives an RTL
  locale change.
- Don't hide the button with `display: none`. It is the accessibility
  tree's anchor point. Use `clip-path` or an `.sr-only` recipe.
- Don't rely on colour alone to mark the selected option (WCAG 1.4.1).
- Don't rely on the control alone to communicate the active locale;
  see [accessibility.md](./accessibility.md).

---

Lily™ and Lily Design System™ are trademarks.
