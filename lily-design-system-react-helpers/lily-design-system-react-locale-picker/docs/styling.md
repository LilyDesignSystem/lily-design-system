# Styling

The control is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks it exposes.

## Class hooks

| Selector                           | Element                                  |
| ---------------------------------- | ---------------------------------------- |
| `.locale-chooser`                   | The root `<div>`.                        |
| `.locale-chooser.{consumerClass}`   | Both classes when `className` is passed. |
| `.locale-chooser-button`            | The trigger `<button>`.                  |
| `.locale-chooser-icon`              | The `<span>` holding the default globe glyph. Absent when you pass `children`. |
| `.locale-chooser-list`              | The `<ul role="listbox">` dropdown.      |
| `.locale-chooser-option`            | Each `<li role="option">`.               |
| `.locale-chooser-status`            | The consumer-rendered status line naming the active locale. Not emitted by the component — you render it, and the examples always do. |

A `children` render prop replaces the contents of the button only, so
every hook above except `.locale-chooser-icon` is still guaranteed.

### `.locale-chooser-status`

The status line is part of the default pattern, not decoration: the
closed control is an icon button, so this element is the only place the
active locale is stated in visible text. See
[accessibility.md](./accessibility.md). Style it as ordinary body copy:

```css
.locale-chooser-status {
    margin-block-start: 0.5rem;
    font-size: 0.875rem;
    color: var(--theme-color-base-content, currentColor);
}
```

## Attribute hooks

| Attribute                     | On                          | Purpose                          |
| ----------------------------- | --------------------------- | -------------------------------- |
| `aria-expanded="true\|false"` | `.locale-chooser-button`     | Open state — style the trigger, e.g. rotate a caret. |
| `hidden`                      | `.locale-chooser-list`       | Present while closed. This is what opens and closes the dropdown. |
| `aria-selected="true\|false"` | `.locale-chooser-option`     | The locale currently in effect.  |
| `data-active`                 | `.locale-chooser-option`     | The keyboard-active option (present on exactly one, only while open). |
| `lang="<bcp47>"`              | `.locale-chooser-option`     | Each option's own language. Also a styling hook — see below. |
| `lang` / `dir`                | `target` (default `<html>`) | Written by the control on every change. |

`aria-selected` and `data-active` are different things and both need a
style: `aria-selected` is *the locale in effect*, `data-active` is
*what `Enter` would pick right now*. The options never take DOM focus
(the listbox does, and tracks them with `aria-activedescendant`), so
`:focus-visible` will never match an option — `[data-active]` is the
only hook for the moving highlight.

```css
.locale-chooser-option[aria-selected="true"] { font-weight: 600; }
.locale-chooser-option[data-active] { background: Highlight; color: HighlightText; }
```

## Styling per language with `lang`

Because every option carries its own `lang`, CSS can target scripts
directly — useful when one script needs a different face or size to
stay legible next to Latin text:

```css
.locale-chooser-option:lang(ar),
.locale-chooser-option:lang(fa),
.locale-chooser-option:lang(ur) {
    font-family: "Noto Naskh Arabic", serif;
    font-size: 1.0625em;
}

.locale-chooser-option:lang(ja),
.locale-chooser-option:lang(zh) {
    font-family: "Noto Sans CJK", sans-serif;
}
```

Prefer `:lang()` over a class: it matches the inherited language, so it
keeps working if you later render the labels somewhere else.

## Direction inside the list

The list itself is not mirrored per option — the whole page's `dir`
governs it. An RTL label inside an LTR list renders correctly because
of the Unicode bidi algorithm plus the option's `lang`, but punctuation
at the edges can land on the surprising side. If you mix scripts in one
list, isolate each label:

```css
.locale-chooser-option {
    unicode-bidi: isolate;
}
```

See [rtl.md](./rtl.md) for the full picture.

## Positioning is yours

The package ships no CSS at all, which includes no positioning. Left
unstyled, the `<ul>` renders as a block in normal flow and pushes the
page around when it opens. The minimum to make it a dropdown:

```css
.locale-chooser {
    position: relative;
    display: inline-block;
}

.locale-chooser-list {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    z-index: 1;
    min-inline-size: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    max-block-size: 20rem;
    overflow-y: auto;
}
```

Use `inset-inline-start` rather than `left`: this control writes `dir`,
so a hard-coded `left` will anchor the dropdown on the wrong edge the
moment a user picks Arabic.

Long locale lists are the normal case for this control (the built-in
table has 436 rows), so `max-block-size` + `overflow-y: auto` matter
more here than they do for a theme picker. The component calls
`scrollIntoView({ block: "nearest" })` on the active option as the
keyboard cursor moves, which only does something useful if the list is
actually scrollable.

## Keep `hidden` working

The component opens and closes the list by toggling the `hidden`
attribute. Any `display` you set on `.locale-chooser-list` overrides the
UA stylesheet's `[hidden] { display: none }` and the list will never
close. If you need `display: flex` or `display: grid`, re-assert the
rule:

```css
.locale-chooser-list { display: grid; }
.locale-chooser-list[hidden] { display: none; }
```

## A minimal complete example

```css
.locale-chooser { position: relative; display: inline-block; }

.locale-chooser-button {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem;
    background: none;
    border: 1px solid currentColor;
    border-radius: 0.25rem;
    cursor: pointer;
    font: inherit;
}

.locale-chooser-button:focus-visible {
    outline: 3px solid var(--theme-color-focus, #ffeb3b);
    outline-offset: 2px;
}

.locale-chooser-icon { font-size: 1.25em; line-height: 1; }

.locale-chooser-list {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    z-index: 1;
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
    min-inline-size: 12rem;
    max-block-size: 20rem;
    overflow-y: auto;
    background: Canvas;
    border: 1px solid currentColor;
    border-radius: 0.25rem;
}

.locale-chooser-list[hidden] { display: none; }

.locale-chooser-option {
    padding: 0.375rem 0.75rem;
    cursor: pointer;
    unicode-bidi: isolate;
}

.locale-chooser-option[aria-selected="true"] { font-weight: 600; }
.locale-chooser-option[data-active] { background: Highlight; color: HighlightText; }
```

Note the focus style on the button: the package never suppresses focus
rings, but it also never draws them. If your reset removes the default
outline, you must put one back — WCAG 2.4.7 is not optional.

---

Lily™ and Lily Design System™ are trademarks.
