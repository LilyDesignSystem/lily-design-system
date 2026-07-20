# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the select
exposes.

Because the control is a custom listbox rather than a native
`<select>`, the consumer's CSS is doing more work than it used to.
Nothing is styled by the platform, and — most importantly — **the
list is not positioned**. Read [Positioning the list](#positioning-the-list)
before shipping.

## Class hooks

| Selector                                             | Element                                  |
| ---------------------------------------------------- | ---------------------------------------- |
| `.theme-select`                                      | The root `<div>`.                        |
| `.theme-select.{consumerClass}`                      | Both classes when `className` is passed. |
| `.theme-select-button`                               | The trigger `<button>`.                  |
| `.theme-select-icon`                                 | The `<span>` holding the default glyph. Absent when a custom `<ng-template>` is projected. |
| `.theme-select-list`                                 | The `<ul role="listbox">`. Carries `hidden` while closed. |
| `.theme-select-option`                               | Each `<li role="option">`.               |
| `.theme-select-status`                               | The consumer-rendered status line naming the active theme. Not emitted by the component — you render it, per the default pattern in [accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern). |

## State selectors

| Selector                                    | Meaning                                                     |
| ------------------------------------------- | ----------------------------------------------------------- |
| `.theme-select-option[data-active]`         | The option the **keyboard** is currently pointing at.        |
| `.theme-select-option[aria-selected="true"]`| The theme currently **in effect**.                           |
| `.theme-select-button[aria-expanded="true"]`| The listbox is open.                                         |
| `.theme-select-list[hidden]`                | The listbox is closed (the browser hides it; don't override).|

`data-active` and `aria-selected` are different states and are
usually on different options while the user arrows around. Give them
distinct treatments — a highlight for `data-active`, a checkmark or
weight change for `aria-selected`. Styling them identically makes the
list unreadable during keyboard navigation.

Do **not** write `.theme-select-list { display: block }` or similar
unconditionally: that defeats the `hidden` attribute and the list
never closes. If you need a display mode other than the default, scope
it: `.theme-select-list:not([hidden]) { display: grid }`.

The `className` input is the Angular equivalent of Vue's
`inheritAttrs`-driven `class` fall-through. Angular has no
implicit attribute spread; the helper exposes an explicit input.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

## Positioning the list

**The package ships no positioning CSS, and without some the listbox
sits in normal document flow — shoving the rest of the page down every
time it opens.** This is the one piece of CSS the component genuinely
cannot work sensibly without.

The minimum: make the root a positioning context and take the list out
of flow.

```css
.theme-select {
    position: relative;
    display: inline-block;
}

.theme-select-list {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    min-width: 100%;
    max-height: 20rem;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
}
```

`max-height` + `overflow-y` matter for long theme catalogs — the
component calls `scrollIntoView({ block: "nearest" })` on the active
option as the user arrows, which only does anything if the list is
itself scrollable.

For lists that must escape a clipping ancestor (`overflow: hidden`, a
transformed parent), reach for the CSS anchor positioning API where
supported, or the Popover API, and treat the absolute-positioned
version above as the fallback.

## Suggested baseline CSS

Drop into the consumer's app stylesheet, on top of the positioning
rules above:

```css
.theme-select-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* Keep a usable target even if the glyph fails to render. */
    min-width: 2.25rem;
    min-height: 2.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, transparent);
    color: inherit;
    cursor: pointer;
}

.theme-select-icon {
    /* The default glyph is U+25D1; name fonts you know cover it so it
       doesn't arrive from an arbitrary fallback at the wrong weight. */
    font-family: "Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", sans-serif;
    font-size: 1.125em;
    line-height: 1;
}

.theme-select-button:focus-visible,
.theme-select-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

.theme-select-list {
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, canvas);
}

.theme-select-option {
    padding: 0.25rem 0.75rem;
    cursor: pointer;
}

/* Keyboard highlight — where the arrows are pointing. */
.theme-select-option[data-active] {
    background: var(--color-base-200, highlight);
}

/* The theme actually in effect. */
.theme-select-option[aria-selected="true"] {
    font-weight: 600;
}
```

The `.theme-select-list:focus-visible` rule is not optional
decoration: the `<ul>` holds focus for the entire open interaction, so
without it a keyboard user has no on-screen indication that their
keystrokes are going anywhere. See
[accessibility.md](./accessibility.md#visible-focus).

Under forced-colours mode a `<div>`/`<ul>`/`<li>` tree gets none of
the automatic treatment a native `<select>` receives. Add a
`@media (forced-colors: active)` block that restores borders and the
active/selected distinction using system colours.

## Visually-hidden status line

The default pattern renders the active theme as **visible** text (see
[accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern)):

```html
<p class="theme-select-status" aria-live="polite">
    Active theme: {{ themeSelect.labelFor(theme()) }}
</p>
```

Visible is the recommendation — it serves sighted, low-vision, and
cognitively-impaired users, not only screen-reader users. But if a
layout genuinely cannot spare the space, hide it **visually** while
keeping it in the accessibility tree:

```css
.theme-select-status {
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

Do not reach for `display: none` or `visibility: hidden`: both remove
the element from the accessibility tree, which kills the live-region
announcements and leaves you with no compensation at all. Removing the
element entirely is worse still — prefer this recipe over deleting it.

## Don'ts

- Don't hide the root with `display: none`. It removes the whole
  control from the accessibility tree. Use `clip-path` or a
  `.sr-only` recipe if you need to visually hide it.
- Don't force `.theme-select-list` visible with an unconditional
  `display` rule — it overrides the `hidden` attribute and the list
  never closes. Scope it with `:not([hidden])`.
- Don't style `[data-active]` and `[aria-selected="true"]` the same.
  They are different states on usually-different options.
- Don't remove the focus ring from `.theme-select-list`. It holds
  focus while the list is open.
- Don't add `styles` / `styleUrls` to a wrapping component that
  imports the select if the goal is to style the select — Angular
  view encapsulation (`Emulated`) prefixes the styles with a
  scoping attribute, so they won't reach the select. Use a global
  stylesheet (or `ViewEncapsulation.None` on a wrapper component)
  instead.

## Angular view encapsulation

Angular's default `ViewEncapsulation.Emulated` rewrites CSS
selectors to include a unique scoping attribute (`_nghost-xyz`).
This means styles declared in a component's `styles` field don't
reach child components by default.

The select is a standalone component with no `styles`, so emulation
doesn't bite the helper itself. But a consumer wrapping the select
in another component must publish their theme-select-targeting styles
either globally or with `ViewEncapsulation.None`:

```ts
import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "my-settings",
    standalone: true,
    imports: [ThemeSelect],
    encapsulation: ViewEncapsulation.None,  // styles reach .theme-select
    template: `
        <lily-theme-select label="Theme" themesUrl="/t/" [themes]="themes" />
    `,
    styles: `
        .theme-select {
            border: 1px solid var(--brand);
        }
    `,
})
export class MySettings { /* … */ }
```

Or, more idiomatically, put the select CSS in a global stylesheet
referenced from `angular.json`'s `styles` array.

## `:host` pseudo-class

If you wrap the select in your own component, the outer host element
is a `<my-settings>` tag, not the select's root `<div>`. To style
the host:

```css
:host {
    display: block;
    padding: 1rem;
}
```

This styles the wrapping `<my-settings>`, not the inner
`.theme-select` div.

Note also that `<lily-theme-select>` itself is an element in the DOM,
sitting between your wrapper and `.theme-select`. If your positioning
context needs to be that element rather than the root div, style
`lily-theme-select { position: relative }` instead — but prefer
`.theme-select`, which is the documented hook.

## `::ng-deep` (deprecated but useful)

For reaching into child component styles from a parent's component
styles, `::ng-deep` still works (despite being deprecated). It's
brittle — prefer global stylesheets. If you must use it:

```css
::ng-deep .theme-select-option {
    /* applies to descendants regardless of scope */
}
```

A safer alternative is to drop the styles into the global stylesheet
referenced from `angular.json`.

---

Lily™ and Lily Design System™ are trademarks.
