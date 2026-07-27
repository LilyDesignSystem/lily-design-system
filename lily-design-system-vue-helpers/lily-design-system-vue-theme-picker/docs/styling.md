# Styling

The chooser is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the chooser
exposes.

**The package ships no positioning either.** The listbox is a plain
`<ul>` in normal document flow, so without CSS it pushes the page
around when it opens. Giving it a position is not optional polish; it
is part of wiring the component up. See
[Positioning the listbox](#positioning-the-listbox) below.

## Class hooks

| Selector                  | Element                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `.theme-chooser`           | The root `<div>`.                                                |
| `.theme-chooser.{consumerClass}` | Both classes when `class` is passed.                       |
| `.theme-chooser-button`    | The trigger `<button type="button">`.                            |
| `.theme-chooser-icon`      | The `<span>` wrapping the default `◑` glyph. **Absent** when you pass a default slot — the slot replaces it. |
| `.theme-chooser-list`      | The `<ul role="listbox">`. Carries `hidden` while closed.        |
| `.theme-chooser-option`    | Each `<li role="option">`.                                       |
| `.theme-chooser-status`    | The consumer-rendered live region that announces the active theme. Not emitted by the component — you render it next to the chooser, as every example does. See [accessibility.md](./accessibility.md). |

The hidden `<input type="hidden">` carries no class hook: it is never
rendered and exists only for form participation.

If you pass a default slot, everything except `.theme-chooser-icon` is
unchanged — the slot only replaces the glyph inside the button, not
the button, the listbox, or the options.

## Attribute hooks

| Attribute                         | On                          | Purpose                                              |
| --------------------------------- | --------------------------- | ---------------------------------------------------- |
| `aria-expanded="true"`            | `.theme-chooser-button`      | Style the trigger's open state.                      |
| `hidden`                          | `.theme-chooser-list`        | Present while closed. Prefer `[hidden]` over a class. |
| `aria-selected="true"`            | `.theme-chooser-option`      | The **committed** selection — the active theme.      |
| `data-active`                     | `.theme-chooser-option`      | The **keyboard-active** option while the listbox is open. |
| `data-theme="<slug>"`             | `target` (default `<html>`) | Active theme indicator for theme CSS files.          |
| `data-lily-theme-chooser="<name>"` | the managed `<link>`        | Discriminator for multiple choosers.                  |

`aria-selected` and `data-active` are different things and both need
styling. `aria-selected` marks the theme currently applied;
`data-active` marks the option the arrow keys are currently on. While
a keyboard user arrows through the list, only `data-active` moves —
so an implementation that styles `aria-selected` alone looks frozen.
Because focus is on the `<ul>` rather than on the option, `[data-active]`
is the *only* visible cue that keyboard navigation is working.

## Positioning the listbox

The component sets no layout. The conventional overlay pattern is
`position: relative` on the root and `position: absolute` on the list:

```css
.theme-chooser {
    position: relative;
    display: inline-block;
}

.theme-chooser-list {
    position: absolute;
    z-index: 10;
    inset-block-start: 100%;
    inset-inline-start: 0;
    min-width: 100%;
    max-height: 20rem;
    overflow-y: auto;

    margin: 0;
    padding: 0;
    list-style: none;

    background: var(--color-base-100, Canvas);
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-box, 0.25rem);
}
```

Use `inset-inline-start` rather than `left` so the overlay follows the
document's writing direction in RTL locales.

`max-height` plus `overflow-y: auto` matters for long catalogs — the
Lily themes directory ships 45 stylesheets. The component calls
`scrollIntoView({ block: "nearest" })` on the active option as it
moves, so a scrollable list keeps the active option visible for
keyboard and typeahead navigation automatically.

Nothing here requires a `[hidden]` rule: `hidden` is honoured by the
UA stylesheet as `display: none`. But if you set `display` on
`.theme-chooser-list` (for example `display: flex`), you override that
and the list will show while closed. Restore it explicitly:

```css
.theme-chooser-list[hidden] {
    display: none;
}
```

## Suggested baseline CSS

Drop into the consumer's app stylesheet, alongside the positioning
block above:

```css
.theme-chooser-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, transparent);
    color: inherit;
    cursor: pointer;
    line-height: 1;
}

.theme-chooser-button:focus-visible,
.theme-chooser-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

.theme-chooser-icon {
    font-size: 1rem;
    line-height: 1;
}

.theme-chooser-option {
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
}

/* The keyboard-active option — the only cue while focus is on the <ul>. */
.theme-chooser-option[data-active] {
    background: var(--color-base-200, Highlight);
    color: var(--color-base-content, HighlightText);
}

/* The committed selection. */
.theme-chooser-option[aria-selected="true"] {
    font-weight: 600;
}

.theme-chooser-option:hover {
    background: var(--color-base-200, transparent);
}
```

Style `.theme-chooser-list:focus-visible` as well as the button: the
`<ul>` is what actually holds focus while the listbox is open, and a
list with no focus ring reads as though focus vanished.

## Styling the status region

`.theme-chooser-status` is the sibling element that carries the active
theme (`<p class="theme-chooser-status" aria-live="polite">`). It is
**visible by default** — that is the shipped pattern, because an
icon-only control never shows the active theme's name.

```css
.theme-chooser-status {
    margin-block-start: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-base-content, inherit);
}
```

### Visually-hidden variant

If the design genuinely cannot spare the line, **hide it — do not
delete it.** This keeps the polite announcement for screen-reader
users while removing the visual line:

```css
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

Use `clip-path`, not `display: none` or `visibility: hidden` — the
latter two remove the element from the accessibility tree, which
silences the live region and defeats the point.

## Don'ts

- Don't hide the `.theme-chooser-button` with `display: none`. It is
  the accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to visually replace it.
- Don't override the component's `aria-*` attributes from CSS or from
  a wrapper. They are part of the accessibility contract.
- Don't style only `[aria-selected]`. Keyboard users navigate by
  `[data-active]`; without a rule for it the listbox looks inert.
- Don't set `display` on `.theme-chooser-list` without restoring
  `[hidden] { display: none }`, or the list stays visible while closed.
- Don't add scoped styles (`<style scoped>`) inside `ThemeChooser.vue`
  — the helper is headless. Style from the consumer side.

## Vue scoped styles in consumer wrappers

If a consumer wraps `ThemeChooser` in their own SFC and uses
`<style scoped>`, the scoped attribute selector applies to the root
`<div>` because Vue forwards data-attributes to the root. The inner
button, list, and options are **not** tagged with the scope id, so
plain selectors for them will not match. Use `:deep()`:

```vue
<template>
    <ThemeChooser class="my-theme-chooser" ... />
</template>

<style scoped>
.my-theme-chooser {
    /* matches: the root <div> carries the scope id */
}
.my-theme-chooser :deep(.theme-chooser-button) {
    /* :deep targets descendants regardless of the scoped boundary */
}
.my-theme-chooser :deep(.theme-chooser-option[data-active]) {
    /* … */
}
</style>
```

`:deep()` is the Vue 3 scoped-styles way to reach into the inner
markup without breaking encapsulation for other components. Because
the listbox and its options live inside the component, every hook
except `.theme-chooser` itself needs it.

---

Lily™ and Lily Design System™ are trademarks.
