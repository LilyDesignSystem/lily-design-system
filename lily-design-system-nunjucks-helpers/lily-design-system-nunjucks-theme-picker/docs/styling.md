# Styling

The control is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the macro
exposes.

**The package ships no positioning.** The listbox is a plain `<ul>` in
normal flow, so without CSS it pushes the page around when it opens.
Positioning it is the consumer's job — see
[Positioning the listbox](#positioning-the-listbox) below. This is not
an oversight; a headless helper cannot know whether your list should
drop down, drop up, anchor right, or render in a popover.

## Class hooks

| Selector                        | Element                              |
| ------------------------------- | ------------------------------------ |
| `.theme-chooser`                 | The root `<div>`.                    |
| `.theme-chooser.{classes}`       | Both classes when `opts.classes` is set. |
| `.theme-chooser-button`          | The icon `<button>` that opens the listbox. |
| `.theme-chooser-icon`            | The `<span>` wrapping the default glyph. Absent when a `{% call %}` block overrides it. |
| `.theme-chooser-list`            | The `<ul role="listbox">`.           |
| `.theme-chooser-option`          | Each `<li role="option">`.           |
| `.theme-chooser-status`          | The consumer-rendered status region announcing the active theme (see [accessibility.md](./accessibility.md)). Ships in the examples; not emitted by the macro. |

The `.theme-chooser-placeholder` hook is **gone**. There is no
placeholder option any more.

### State hooks

| Selector                                    | Meaning                                   |
| ------------------------------------------- | ----------------------------------------- |
| `.theme-chooser-list:not([hidden])`          | The listbox is open.                      |
| `.theme-chooser-button[aria-expanded="true"]`| The button while its listbox is open.     |
| `.theme-chooser-option[aria-selected="true"]`| The applied theme.                        |
| `.theme-chooser-option[data-active]`         | The keyboard-active option (roving highlight). Distinct from selected. |

Style `[data-active]` and `[aria-selected]` differently: the first is
"where the keyboard cursor is", the second is "what is in effect". A
user arrowing through the list expects to see both at once.

### The status region

The closed button shows only a glyph, so the pattern pairs it with a
visible `aria-live="polite"` status line. Style it as ordinary body
text next to the control:

```css
.theme-chooser-status {
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
.theme-chooser-status {
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

If you use the `{% call %}` caller block, the block body replaces the
glyph only. `.theme-chooser-icon` disappears; every other hook — root,
button, list, options — is still emitted by the macro.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-chooser="<name>"`  | the managed `<link>`        | Discriminator for multiple controls. |
| `data-lily-theme-chooser-root`      | the root `<div>`            | `autoInit()` selector.            |
| `data-lily-theme-chooser-button`    | the `<button>`              | Client lookup hook.               |
| `data-lily-theme-chooser-list`      | the `<ul>`                  | Client lookup hook.               |
| `data-lily-theme-chooser-input`     | the hidden `<input>`        | Client lookup hook.               |
| `data-active`                      | the active `<li>`           | Roving keyboard highlight.        |

## Positioning the listbox

The macro emits no positioning. The minimum viable pattern is an
absolutely-positioned list inside a relatively-positioned root:

```css
.theme-chooser {
    position: relative;
    display: inline-block;
}

.theme-chooser-list {
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

The `max-height` plus `overflow-y` matter: the client calls
`scrollIntoView({block: "nearest"})` on the active option as the
keyboard moves through the list, which only does anything if the list
is a scroll container.

Use `inset-inline-start` rather than `left` so the list anchors
correctly under RTL.

## Suggested baseline CSS

Drop into the consumer's app stylesheet, after the positioning rules
above:

```css
.theme-chooser-button {
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

.theme-chooser-icon {
    font-size: 1.25rem;
}

/* The list takes DOM focus while open, so give it a visible ring too. */
.theme-chooser-button:focus-visible,
.theme-chooser-list:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}

.theme-chooser-list {
    border: 1px solid var(--theme-color-base-300, currentColor);
    border-radius: var(--theme-radius-selector, 0.25rem);
    background: var(--theme-color-base-background, white);
    color: var(--theme-color-base-content, currentColor);
}

.theme-chooser-option {
    padding: 0.375rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
}

/* Where the keyboard cursor is. */
.theme-chooser-option[data-active] {
    background: var(--theme-color-base-200, #e5e7eb);
}

/* What is actually applied. Not colour-only: add a mark. */
.theme-chooser-option[aria-selected="true"] {
    font-weight: 600;
}

.theme-chooser-option[aria-selected="true"]::before {
    content: "\2713\00a0"; /* check mark + nbsp */
}

.theme-chooser-option:not([aria-selected="true"])::before {
    content: "\00a0\00a0"; /* keep the labels aligned */
}
```

## NHS-style banner CSS

For an NHS UK-aligned utility banner look:

```css
.utility-banner .theme-chooser-button {
    border: 2px solid transparent;
}

.utility-banner .theme-chooser-button:focus-visible {
    border-color: #005eb8; /* NHS blue */
}
```

## Don'ts

- **Don't override `hidden` with a `display` rule.** A bare
  `.theme-chooser-list { display: block }` beats the `hidden`
  attribute and pins the list permanently open, out of sync with
  `aria-expanded`. Scope open-state styling to
  `.theme-chooser-list:not([hidden])`.
- Don't hide the button with `display: none`. It is the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to render only a custom trigger.
- Don't rely on colour alone to mark the selected option (WCAG 1.4.1).
  Pair it with a check mark, weight, or icon, as above.
- Don't override the control's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't write CSS inside the macro file. The helper is headless.

## CSS scoped to themes

Each theme CSS file scopes its rules to its `data-theme` slug:

```css
/* assets/themes/light.css */
:root[data-theme="light"] {
    --theme-color-primary: #2563eb;
    --theme-color-base-background: #ffffff;
    --theme-color-base-content: #1f2937;
}

/* assets/themes/dark.css */
:root[data-theme="dark"] {
    --theme-color-primary: #60a5fa;
    --theme-color-base-background: #0b1220;
    --theme-color-base-content: #f9fafb;
}
```

The control's role is to swap which file is loaded (via the
managed `<link>`) and which slug is active (via the `data-theme`
attribute). The rules above ensure only the active theme's
properties apply, regardless of how many theme files are
preloaded.

## A starter rule that uses CSS custom properties

```css
body {
    background: var(--theme-color-base-background, white);
    color: var(--theme-color-base-content, black);
    font-family: var(--theme-font-body, system-ui, sans-serif);
}

a {
    color: var(--theme-color-primary, #2563eb);
}

button {
    background: var(--theme-color-primary, #2563eb);
    color: var(--theme-color-primary-content, white);
    border: 0;
    padding: 0.5rem 1rem;
    border-radius: var(--theme-radius-md, 0.25rem);
    cursor: pointer;
}
```

With the control active, switching themes swaps every variable in
one tick — no JavaScript involvement beyond the `data-theme`
attribute write.

---

Lily™ and Lily Design System™ are trademarks.
