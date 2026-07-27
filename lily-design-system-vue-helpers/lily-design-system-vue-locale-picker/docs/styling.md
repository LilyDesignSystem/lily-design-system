# Styling

The chooser ships **no CSS**. Everything below is yours to write. This
file documents the hooks the component guarantees, plus a baseline
stylesheet you can paste and edit.

The one thing you *must* supply is positioning for the listbox — see
[Positioning the listbox](#positioning-the-listbox). Without it the
open list participates in normal flow and shoves the rest of the page
down.

## Class hooks

Every hook below is a stable contract. They do not change without a
major version.

| Hook                    | Element                          | Notes                                        |
| ----------------------- | -------------------------------- | -------------------------------------------- |
| `.locale-chooser`        | root `<div>`                     | Your `class` prop is appended after this.    |
| `.locale-chooser-button` | the trigger `<button>`           | Icon-only; `aria-label` is its whole name.   |
| `.locale-chooser-icon`   | `<span>` inside the button       | Holds the 🌐 glyph. Absent when you supply a slot. |
| `.locale-chooser-list`   | `<ul role="listbox">`            | `hidden` while closed.                       |
| `.locale-chooser-option` | each `<li role="option">`        | Carries its own `lang`.                      |

Two more hooks are *conventions*, not component output — you render
them yourself:

| Hook                      | What it is                                             |
| ------------------------- | ------------------------------------------------------ |
| `.locale-chooser-status`   | The live region naming the active locale. See [accessibility.md](./accessibility.md). |
| `.locale-chooser-placeholder` | **Gone.** Removed with the native `<select>`.       |

## Attribute hooks

Prefer these over class toggling — the component already maintains
them, and styling the ARIA state keeps the visual and the announced
state from drifting apart.

| Selector                                            | Means                                   |
| --------------------------------------------------- | --------------------------------------- |
| `.locale-chooser-button[aria-expanded="true"]`        | The listbox is open.                    |
| `.locale-chooser-list[hidden]`                        | Closed. Browsers apply `display: none`. |
| `.locale-chooser-option[aria-selected="true"]`        | The active locale — persistent state.   |
| `.locale-chooser-option[data-active]`                 | The keyboard-focused option — transient. |

`aria-selected` and `data-active` are different things and should look
different. `aria-selected` is "this is your language"; `data-active` is
"this is where the arrow keys are right now". A user arrowing through
the list needs to see both at once.

Because focus stays on the `<ul>` (the APG listbox pattern uses
`aria-activedescendant`), the active option never matches `:focus`.
`[data-active]` is the only hook for it.

### Direction-aware selectors

The component writes `dir` on the target, which is usually `<html>`.
That makes direction available to CSS for free:

```css
[dir="rtl"] .locale-chooser-list {
    right: auto;
    left: 0;
}
```

Prefer CSS logical properties where you can — `inset-inline-start`,
`padding-inline`, `margin-block` — and the flip comes for nothing. See
[rtl.md](./rtl.md).

## Positioning the listbox

The component gives the `<ul>` no position. Supply one. The usual
recipe is an absolutely-positioned list inside a relatively-positioned
root:

```css
.locale-chooser {
    position: relative;
    display: inline-block;
}

.locale-chooser-list {
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    z-index: 50;
    min-inline-size: 100%;
    max-block-size: 20rem;
    overflow-y: auto;
}
```

`max-block-size` + `overflow-y` matter more here than on theme-chooser:
a locale list is often long. The component calls `scrollIntoView({
block: "nearest" })` on the active option as you arrow, which does the
right thing only if the list is the scroll container.

For a list that must escape an `overflow: hidden` ancestor, either
render the chooser outside that ancestor or reach for CSS anchor
positioning / a popover library — the component does not portal.

## Suggested baseline CSS

Accessible, unopinionated, and direction-agnostic. Tokens are the Lily
`--theme-*` custom properties; substitute your own.

```css
.locale-chooser {
    position: relative;
    display: inline-block;
}

/* ---- Trigger ---- */

.locale-chooser-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2.75rem;   /* >= 44px: WCAG 2.5.8 target size */
    block-size: 2.75rem;
    padding: 0;
    border: 1px solid var(--theme-color-border, #6b7280);
    border-radius: var(--theme-radius-md, 0.5rem);
    background: var(--theme-color-surface, #fff);
    color: inherit;
    cursor: pointer;
    line-height: 1;
}

.locale-chooser-button:hover {
    background: var(--theme-color-surface-hover, #f3f4f6);
}

.locale-chooser-button:focus-visible {
    outline: 3px solid var(--theme-color-focus, #ffeb3b);
    outline-offset: 2px;
}

.locale-chooser-icon {
    font-size: 1.25rem;
    /* Keep the globe monochrome even where a colour-emoji font wins. */
    font-family: system-ui, "Segoe UI Symbol", sans-serif;
}

/* ---- Listbox ---- */

.locale-chooser-list {
    position: absolute;
    inset-block-start: calc(100% + 0.25rem);
    inset-inline-start: 0;
    z-index: 50;
    min-inline-size: 12rem;
    max-block-size: 20rem;
    overflow-y: auto;
    margin: 0;
    padding: 0.25rem;
    list-style: none;
    border: 1px solid var(--theme-color-border, #6b7280);
    border-radius: var(--theme-radius-md, 0.5rem);
    background: var(--theme-color-surface, #fff);
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.12);
}

.locale-chooser-list:focus-visible {
    outline: 3px solid var(--theme-color-focus, #ffeb3b);
    outline-offset: -3px;
}

/* ---- Options ---- */

.locale-chooser-option {
    padding: 0.5rem 0.75rem;
    border-radius: var(--theme-radius-sm, 0.25rem);
    cursor: pointer;
    /* Endonyms mix scripts; keep the line box tall enough for all. */
    line-height: 1.5;
}

/* Keyboard position. */
.locale-chooser-option[data-active] {
    background: var(--theme-color-surface-hover, #e5e7eb);
}

/* Current language — must not rely on colour alone (WCAG 1.4.1). */
.locale-chooser-option[aria-selected="true"] {
    font-weight: 700;
}

.locale-chooser-option[aria-selected="true"]::after {
    content: " ✓";
}

@media (prefers-reduced-motion: no-preference) {
    .locale-chooser-option {
        transition: background-color 120ms ease;
    }
}
```

### Why the checkmark

`aria-selected="true"` is announced, but a sighted mouse user gets
nothing from it unless you render something. Bold alone is weak when
the label is already in an unfamiliar script. A glyph plus weight
satisfies WCAG 1.4.1 without depending on colour.

If the `::after` content bothers you in RTL rows, use
`content: "✓\00a0"` with `direction: ltr` on the pseudo-element, or
mark the tick with a separate `<span>` in your own wrapper.

## Styling the status region

The documented pattern pairs the chooser with a consumer-rendered live
region, because an icon-only button never announces the current value:

```css
.locale-chooser-status {
    margin-inline-start: 0.5rem;
    font-size: 0.875rem;
    color: var(--theme-color-text-muted, #4b5563);
}
```

### Visually-hidden variant

When the design has no room for visible status text, keep it for
assistive technology only — never delete it:

```css
.locale-chooser-status {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
}
```

Do not use `display: none` or `visibility: hidden` — both remove the
node from the accessibility tree and the announcement is lost.

## Sizing for mixed scripts

A locale list is the one place your UI renders many writing systems at
once. Two practical consequences:

- **Do not set a fixed `block-size` on options.** Devanagari,
  Thai, and Arabic ascenders/descenders need more room than Latin;
  a fixed height clips them.
- **Do not letter-space option labels.** `letter-spacing` breaks
  cursive joining in Arabic and Indic scripts.

```css
.locale-chooser-option {
    letter-spacing: normal; /* never override this here */
}
```

## Don'ts

- **Do not style `:focus` on options.** Focus is on the `<ul>`; use
  `[data-active]`.
- **Do not remove focus outlines** without an equally visible
  replacement.
- **Do not hide the list with `opacity: 0` or `visibility: hidden`
  alone.** The component toggles `hidden`; fighting it leaves an
  invisible list that still takes clicks.
- **Do not depend on colour alone** for `aria-selected`.
- **Do not restyle the root to `display: contents`.** It breaks the
  `position: relative` anchor the listbox needs.

## Vue scoped styles in consumer wrappers

`<style scoped>` adds a data attribute to elements rendered by *that*
component's template. The chooser's internals are rendered by the
chooser, so scoped rules will not reach them. Three options:

```vue
<style scoped>
/* Reaches the root only — the component is the child element. */
.locale-chooser { /* … */ }

/* Reaches internals: :deep() drops the scoping attribute. */
.wrapper :deep(.locale-chooser-option) { /* … */ }
</style>
```

…or put the chooser's CSS in a global stylesheet, which is usually
cleaner since the hooks are a stable public contract anyway.

## See also

- [accessibility.md](./accessibility.md) — the status-region pattern.
- [rtl.md](./rtl.md) — what `dir` changes and logical properties.
- [custom-rendering.md](./custom-rendering.md) — replacing the glyph.
- [troubleshooting.md](./troubleshooting.md) — when the CSS misbehaves.
