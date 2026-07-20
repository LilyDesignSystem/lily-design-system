# Styling

The package ships **no CSS**. Everything below is a starting point you
own and adapt.

## Class hooks

| Hook                             | Element                                        |
| -------------------------------- | ---------------------------------------------- |
| `.text-size-select`              | Root `<div>`. Also carries `CssClass`.         |
| `.text-size-select-button`       | The icon `<button>`.                           |
| `.text-size-select-icon`         | The `<span>` wrapping the `A` glyph.           |
| `.text-size-select-list`         | The `<ul role="listbox">`.                     |
| `.text-size-select-option`       | Each `<li role="option">`.                     |
| `.text-size-select-option[data-active]`   | The keyboard cursor's option.         |
| `.text-size-select-option[aria-selected="true"]` | The applied size.              |

The list carries `hidden` while closed — the browser's default
`display: none` handles that, so you do not need a rule for it. Do not
add a competing `display` on `.text-size-select-list` or you will
override `hidden` and leave the list permanently visible.

## Positioning is not optional

An unpositioned open list participates in normal flow and shoves the
page around.

```css
.text-size-select {
    position: relative;
    display: inline-block;
}

.text-size-select-list {
    position: absolute;
    inset-inline-start: 0;
    top: 100%;
    z-index: 10;
    margin: 0;
    padding: 0;
    list-style: none;
    min-width: max-content;
    background: var(--color-surface, Canvas);
    border: 1px solid var(--color-border, currentColor);
}
```

`inset-inline-start` rather than `left` keeps the dropdown anchored
correctly under RTL.

## The button and glyph

```css
.text-size-select-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* Keep the target stable across text-size slugs. */
    min-inline-size: 2.5rem;
    min-block-size: 2.5rem;
    background: none;
    border: 1px solid var(--color-border, currentColor);
    color: inherit;
    cursor: pointer;
}

.text-size-select-icon {
    /* The glyph is a letter in the page font; pin it so it does not
       grow along with the very setting this control adjusts. */
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1;
}
```

## Options

```css
.text-size-select-option {
    padding: 0.375em 0.75em;
    cursor: pointer;
    white-space: nowrap;
}

.text-size-select-option:hover {
    background: var(--color-surface-hover, Highlight);
    color: var(--color-on-surface-hover, HighlightText);
}

/* The keyboard cursor. Focus is on the <ul>, so this is the only
   visual signal of where the arrow keys have moved. Required. */
.text-size-select-option[data-active] {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: -2px;
}

/* The applied size. Not colour-only — add a mark. */
.text-size-select-option[aria-selected="true"] {
    font-weight: 700;
}

.text-size-select-option[aria-selected="true"]::after {
    content: " ✓";
}
```

## Previewing the size in the option

A nice touch specific to this helper: render each option at the size it
represents, so the list previews the choice.

```css
.text-size-select-option[data-size="small"]   { font-size: 0.875rem; }
.text-size-select-option[data-size="medium"]  { font-size: 1rem; }
.text-size-select-option[data-size="large"]   { font-size: 1.125rem; }
.text-size-select-option[data-size="x-large"] { font-size: 1.25rem; }
```

The component does not emit `data-size`, so scope this by nth-child or
supply your own wrapper if you need it. Keep the hit target at or above
your minimum regardless of the rendered text size.

## Focus

```css
.text-size-select-button:focus-visible,
.text-size-select-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

Never remove these. The `<ul>` takes focus while the list is open, so
it needs a ring of its own.

## The status region

The recommended companion to the control (see
[accessibility.md](./accessibility.md#the-status-region-is-still-the-recommended-pattern)).
Keep it visible if you can:

```css
.text-size-select-status {
    margin-block-start: 0.5rem;
}
```

If the design truly cannot spare the space, hide it visually but keep
it in the accessibility tree — never `display: none`:

```css
.text-size-select-status {
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

## Mapping slugs to typography

This is the part that actually resizes the page, and it belongs to you.
Use relative units on `:root` so every descendant inherits:

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }
```

Then size everything downstream in `rem` / `em`. Any `px` font size in
your stylesheet is a subtree that silently ignores the user's choice —
see [accessibility.md](./accessibility.md#wcag-144-resize-text--this-helpers-specific-concern).

## Forced Colors Mode

```css
@media (forced-colors: active) {
    .text-size-select-button {
        border-color: ButtonText;
    }
    .text-size-select-list {
        border-color: CanvasText;
    }
    .text-size-select-option[data-active] {
        outline-color: Highlight;
    }
}
```

---

Lily™ and Lily Design System™ are trademarks.
