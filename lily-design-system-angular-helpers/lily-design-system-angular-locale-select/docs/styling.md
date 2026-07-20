# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the select
exposes.

Two things make styling this control different from styling an
ordinary dropdown. First, because it is a custom listbox rather than a
native `<select>`, nothing is styled by the platform and — most
importantly — **the list is not positioned**. Second, this component
writes `dir="rtl"` onto the document root for RTL locales, so its own
CSS is among the first things that has to survive a direction flip.
Read [Positioning the list](#positioning-the-list) and
[Write it in logical properties](#write-it-in-logical-properties)
before shipping.

## Class hooks

| Selector                              | Element                                  |
| ------------------------------------- | ---------------------------------------- |
| `.locale-select`                      | The root `<div>`.                        |
| `.locale-select.{consumerClass}`      | Both classes when `className` is passed. |
| `.locale-select-button`               | The trigger `<button>`. Icon-only by default. |
| `.locale-select-icon`                 | The `<span aria-hidden="true">` holding the default globe glyph. Absent when a custom `<ng-template>` is projected. |
| `.locale-select-list`                 | The `<ul role="listbox">`. Carries `hidden` while closed. |
| `.locale-select-option`               | Each `<li role="option">`. Carries its own `lang`. |
| `.locale-select-status`               | The consumer-rendered status line naming the active locale. Not emitted by the component — you render it, per the default pattern in [accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern). |

## State selectors

| Selector                                      | Meaning                                                     |
| --------------------------------------------- | ----------------------------------------------------------- |
| `.locale-select-option[data-active]`          | The option the **keyboard** is currently pointing at.        |
| `.locale-select-option[aria-selected="true"]` | The locale currently **in effect**.                          |
| `.locale-select-button[aria-expanded="true"]` | The listbox is open.                                         |
| `.locale-select-list[hidden]`                 | The listbox is closed (the browser hides it; don't override).|

`data-active` and `aria-selected` are different states and are
usually on different options while the user arrows around: one is
"where my keyboard is", the other is "what the page is currently set
to". Give them distinct treatments — a background highlight for
`data-active`, a checkmark or weight change for `aria-selected`.
Styling them identically makes the list unreadable during keyboard
navigation, and styling only one of them leaves a user with no way to
tell what they are about to change *from*.

Both treatments must survive WCAG 1.4.1 (Use of Colour): a
background-colour swap alone does not convey selection. Pair every
colour cue with a non-colour one — a check glyph, a weight change, a
border, an inline marker. The component itself conveys nothing by
colour; whether the rendered control does is entirely down to this
stylesheet.

Do **not** write `.locale-select-list { display: block }` or similar
unconditionally: that defeats the `hidden` attribute and the list
never closes. If you need a display mode other than the default, scope
it: `.locale-select-list:not([hidden]) { display: grid }`.

The `className` input is the Angular equivalent of Vue's
`inheritAttrs`-driven `class` fall-through. Angular has no
implicit attribute spread; the helper exposes an explicit input.

## Attribute hooks

| Attribute      | On                          | Purpose                                                      |
| -------------- | --------------------------- | ------------------------------------------------------------ |
| `lang="<tag>"` | `target` (default `<html>`) | BCP 47 tag of the active locale. See [bcp47.md](./bcp47.md).  |
| `dir="ltr\|rtl"` | `target` (default `<html>`) | Auto-detected from the locale unless `[applyDir]="false"`.   |
| `lang="<tag>"` | each `<li role="option">`   | The locale that option names — style per-script if you need to. |

Those first two are the hooks your **whole page** stylesheet keys off,
not just this control: `html[dir="rtl"] …`, or the newer `:dir(rtl)`
selector. What `dir` does and does not change is catalogued in
[rtl.md](./rtl.md#what-dirrtl-actually-changes).

## Positioning the list

**The package ships no positioning CSS, and without some the listbox
sits in normal document flow — shoving the rest of the page down every
time it opens.** This is the one piece of CSS the component genuinely
cannot work sensibly without.

The minimum: make the root a positioning context and take the list out
of flow.

```css
.locale-select {
    position: relative;
    display: inline-block;
}

.locale-select-list {
    position: absolute;
    top: 100%;
    inset-inline-start: 0;
    z-index: 10;
    min-width: 100%;
    max-height: 20rem;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
}
```

`inset-inline-start`, not `left` — see below.

`max-height` + `overflow-y` are not optional polish here. Locale lists
are long: the built-in table carries 436 codes, and even a modest
public-service language menu runs to a dozen. The component calls
`scrollIntoView({ block: "nearest" })` on the active option as the user
arrows, which only does anything if the list is itself scrollable.
Without a `max-height` a long list runs off the viewport and the
keyboard-active option can end up somewhere the user cannot see.

For lists that must escape a clipping ancestor (`overflow: hidden`, a
transformed parent), reach for the CSS anchor positioning API where
supported, or the Popover API, and treat the absolute-positioned
version above as the fallback.

## Write it in logical properties

This is the headline concern for this particular helper. The select
**sets `dir="rtl"` on the document root** whenever the user picks
Arabic, Hebrew, Persian, Urdu, Pashto, or any other RTL locale — so
the moment the control does its job, every physical-direction rule in
your stylesheet is pointing the wrong way. A `left: 0` on the listbox
anchors it to the left of a right-anchored button; a
`padding-left` on the options indents the wrong edge; a
`text-align: left` ragged-rights text that should be ragged-left.

Use the logical equivalents throughout:

| Physical                    | Logical                          |
| --------------------------- | -------------------------------- |
| `left` / `right` (inset)    | `inset-inline-start` / `inset-inline-end` |
| `margin-left` / `-right`    | `margin-inline-start` / `-end`, or `margin-inline` |
| `padding-left` / `-right`   | `padding-inline-start` / `-end`, or `padding-inline` |
| `border-left` / `-right`    | `border-inline-start` / `-end`   |
| `text-align: left`          | `text-align: start`              |
| `width`                     | `inline-size`                    |

Worked example — the same control, written so it needs no RTL
override at all:

```css
.locale-select {
    position: relative;
    display: inline-block;
}

.locale-select-button {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    /* Symmetric here, but written logically so an asymmetric
       redesign doesn't silently break RTL later. */
    padding-block: 0.25rem;
    padding-inline: 0.5rem;
    text-align: start;
}

.locale-select-list {
    position: absolute;
    top: 100%;
    /* Anchors to the button's *start* edge in both directions. */
    inset-inline-start: 0;
    margin-block-start: 0.25rem;
    margin-inline: 0;
    padding-inline: 0;
}

.locale-select-option {
    padding-block: 0.25rem;
    padding-inline: 0.75rem;
    text-align: start;
}

/* A selection marker on the start edge — follows the direction too. */
.locale-select-option[aria-selected="true"] {
    font-weight: 600;
    border-inline-start: 3px solid var(--color-primary, currentColor);
    /* Compensate so the text doesn't shift when selection moves. */
    padding-inline-start: calc(0.75rem - 3px);
}
```

Nothing in that block needs a `[dir="rtl"]` counterpart. If you find
yourself writing one, that is the signal you reached for a physical
property somewhere above it. More on authoring for both directions,
including mirrored iconography, is in
[rtl.md](./rtl.md#authoring-css-that-survives-both-directions).

## Mixed scripts in one list

A locale menu is, almost by definition, multilingual: the list may
carry "English", "Français", "العربية", and "עברית" as siblings. The
component helps here — each `<li>` carries its own `lang`, which is
what lets a screen reader switch voice (WCAG 3.1.2) and what gives the
browser's bidi algorithm the hint it needs.

Practical consequences for your CSS:

- **Don't set a direction on the options.** The Unicode Bidirectional
  Algorithm already renders each label correctly inside an LTR list.
  Forcing `direction: ltr` on `.locale-select-option` will visually
  mangle Arabic and Hebrew endonyms.
- **Do isolate labels if you compose them.** As long as the `<li>`
  contains nothing but the label, the default is fine. The moment you
  add a sibling — a code, a checkmark, a count — the runs can
  reorder around each other. `unicode-bidi: isolate` on the label span
  (or a `<bdi>` element, or `dir="auto"`) contains each run:

  ```css
  .locale-select-option > .label {
      unicode-bidi: isolate;
  }
  ```

  `dir="auto"` on a wrapper achieves the same by first-strong-character
  detection, and is the better choice when the text is user-supplied
  rather than drawn from your own label map.
- **Don't right-align "because it's RTL".** `text-align: start`
  aligns the whole list to the reading edge of the *page*, which is
  what you want; individual RTL labels still lay out right-to-left
  within their own box.
- **Mind the font stack.** A stack chosen for Latin text may drop to
  an ugly fallback for Arabic, Hebrew, Devanagari, or CJK endonyms.
  Either name coverage fonts in the stack, or scope per-script with
  the `lang` attribute the component already provides:

  ```css
  .locale-select-option:lang(ar) {
      font-family: "Noto Sans Arabic", system-ui, sans-serif;
      /* Arabic scripts often need more leading at the same size. */
      line-height: 1.8;
  }
  ```

More on mixing directions on one page:
[rtl.md](./rtl.md#mixing-ltr-and-rtl-on-one-page).

## Focus rings

**Focus lands on the `<ul>`, not on the option.** The list has
`tabindex="-1"` and takes DOM focus for the entire open interaction;
the active option is conveyed to assistive technology through
`aria-activedescendant`, and it never receives focus itself. So the
two indicators are separate jobs:

```css
.locale-select-button:focus-visible,
.locale-select-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

/* Not a focus ring — the "you are here" marker inside the list. */
.locale-select-option[data-active] {
    background: var(--color-base-200, highlight);
    outline: 2px solid transparent; /* visible under forced colours */
    outline-offset: -2px;
}
```

The `.locale-select-list:focus-visible` rule is not optional
decoration: without it a keyboard user has no on-screen indication
that their keystrokes are going anywhere at all. Putting a
`:focus-visible` style on `.locale-select-option` instead is the
common mistake — it will never match, because options are never
focused. See
[accessibility.md](./accessibility.md#focus-management-on-locale-change).

Under forced-colours mode a `<div>`/`<ul>`/`<li>` tree gets none of
the automatic treatment a native `<select>` receives. Add a
`@media (forced-colors: active)` block that restores borders and the
active/selected distinction using system colours; the transparent
outline above is the standard trick for making a background-only
highlight survive.

## The globe glyph

The default button content is U+1F310 GLOBE WITH MERIDIANS followed by
U+FE0E VARIATION SELECTOR-15, exported as `GLOBE_WITH_MERIDIANS`. VS15
requests **text presentation**, so the glyph renders monochrome and
inherits `color` like ordinary text rather than arriving as a blue
colour-emoji bitmap. That is deliberate: this control usually sits
beside theme-select's `◑` in a page header, and the two should read as
one set.

Two things follow for consumers:

```css
.locale-select-icon {
    /* Recolour it like text — VS15 makes this work. */
    color: var(--color-base-content, currentColor);
    /* Name fonts you know cover the text-presentation form, so it
       doesn't arrive from an arbitrary fallback at the wrong weight. */
    font-family: "Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", sans-serif;
    font-size: 1.125em;
    line-height: 1;
}
```

If you override the font stack on the button or on the page, keep a
family that carries the text-presentation glyph. Drop to a stack whose
only match is a colour-emoji font and the VS15 request is ignored — you
get a blue globe back, out of step with the sibling controls. Platform
coverage for this glyph is genuinely uneven (it can render as tofu);
the fallback story, and when to project your own `<ng-template>`
instead, is in
[accessibility.md](./accessibility.md#what-this-control-costs).

## Sizing the button

The button is icon-only by default, so give it a target size that does
not depend on the glyph rendering at all:

```css
.locale-select-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* Usable target even if the glyph fails to render. */
    min-width: 2.25rem;
    min-height: 2.25rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, transparent);
    color: inherit;
    cursor: pointer;
}
```

If you project a template that shows the locale name instead of the
glyph, the button's width becomes content-dependent — and locale names
vary enormously in length ("Welsh" against
"Chinese (Traditional, Hong Kong SAR China)"). Either set a
`min-inline-size` and let it grow, or clamp it:

```css
.locale-select-button {
    min-inline-size: 6rem;
    max-inline-size: 14rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

Clamping the **button** is fine — the full name is still in the list
and in the status line. Clamping the **options** is not: truncating
the name is the only place a user can read what they are choosing.
Prefer wrapping the option text over an ellipsis.

## Theme tokens

The examples above use bare custom properties with fallbacks, so they
work standalone. Inside a Lily app the same hooks take the design
system's `--theme-*` custom properties directly:

```css
.locale-select-button {
    padding-block: var(--theme-space-xs);
    padding-inline: var(--theme-space-sm);
    border-radius: var(--theme-radius-sm);
    font-family: var(--theme-font-body);
}

.locale-select-option[aria-selected="true"] {
    border-inline-start: 3px solid var(--theme-color-primary);
}
```

Those come from the Lily `ThemeProvider` (a flat token object
flattened into `--theme-{path}` properties) or from whichever
stylesheet the sibling theme-select helper has loaded. Because both
helpers are pure class hooks, one theme swap restyles this control
along with everything else on the page.

## Visually-hidden status line

The default pattern renders the active locale as **visible** text (see
[accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern)),
because the closed button shows a globe and nothing else — on its own
it never tells any user which locale is in effect:

```html
<p class="locale-select-status" aria-live="polite">
    Active language:
    <span [attr.lang]="tagFor(locale())">{{ nameFor(locale()) }}</span>
</p>
```

Visible is the recommendation — it serves sighted, low-vision, and
cognitively-impaired users, not only screen-reader users. But if a
layout genuinely cannot spare the space, hide it **visually** while
keeping it in the accessibility tree:

```css
.locale-select-status {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
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

- Don't use physical direction properties. `left`, `padding-left`,
  `text-align: left` and friends break the instant this control does
  what it exists to do. Logical properties throughout.
- Don't hide the root with `display: none`. It removes the whole
  control from the accessibility tree. Use `clip-path` or a
  `.sr-only` recipe if you need to visually hide it.
- Don't force `.locale-select-list` visible with an unconditional
  `display` rule — it overrides the `hidden` attribute and the list
  never closes. Scope it with `:not([hidden])`.
- Don't style `[data-active]` and `[aria-selected="true"]` the same.
  They are different states on usually-different options.
- Don't convey either state by colour alone (WCAG 1.4.1).
- Don't put `:focus-visible` styles on `.locale-select-option`. The
  option never receives focus; the `<ul>` does.
- Don't set `direction` on the options — the bidi algorithm already
  handles mixed-script labels.
- Don't truncate option labels. Clamp the button if you must; the
  list is where the user reads what they're choosing.
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
in another component must publish their locale-select-targeting styles
either globally or with `ViewEncapsulation.None`:

```ts
import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "my-settings",
    standalone: true,
    imports: [LocaleSelect],
    encapsulation: ViewEncapsulation.None,  // styles reach .locale-select
    template: `
        <lily-locale-select label="Language" [locales]="locales" [(value)]="locale" />
    `,
    styles: `
        .locale-select {
            position: relative;
            border-inline-start: 1px solid var(--brand);
        }
    `,
})
export class MySettings { /* … */ }
```

Or, more idiomatically, put the select CSS in a global stylesheet
referenced from `angular.json`'s `styles` array. That is also the only
place `html[dir="rtl"]`-scoped rules can live — the document root is
outside every component's scope by definition.

## `:host` pseudo-class

If you wrap the select in your own component, the outer host element
is a `<my-settings>` tag, not the select's root `<div>`. To style
the host:

```css
:host {
    display: block;
    padding-inline: 1rem;
}
```

This styles the wrapping `<my-settings>`, not the inner
`.locale-select` div.

Note also that `<lily-locale-select>` itself is an element in the DOM,
sitting between your wrapper and `.locale-select`. If your positioning
context needs to be that element rather than the root div, style
`lily-locale-select { position: relative }` instead — but prefer
`.locale-select`, which is the documented hook.

Angular also supports `:host-context()`, which is the tidy way to
react to the document direction from inside an encapsulated component:

```css
:host-context([dir="rtl"]) .chevron {
    transform: scaleX(-1);
}
```

## `::ng-deep` (deprecated but useful)

For reaching into child component styles from a parent's component
styles, `::ng-deep` still works (despite being deprecated). It's
brittle — prefer global stylesheets. If you must use it:

```css
::ng-deep .locale-select-option {
    /* applies to descendants regardless of scope */
}
```

A safer alternative is to drop the styles into the global stylesheet
referenced from `angular.json`.

## Related

| Guide                                                  | Covers                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| [rtl.md](./rtl.md)                                     | What's auto-detected, what `dir="rtl"` changes, mirrored assets. |
| [accessibility.md](./accessibility.md)                 | Focus management, the status region, forced colours, contrast.   |
| [concepts.md](./concepts.md)                           | Why an icon button and a custom listbox at all.                  |
| [bcp47.md](./bcp47.md)                                 | The tag syntax behind the `lang` values you can style with.      |
| [i18n-integration.md](./i18n-integration.md)           | Wiring the locale change to a translation library.               |
| [ssr.md](./ssr.md)                                     | Getting `lang` / `dir` right on the first paint, before CSS runs. |
| [../index.md](../index.md#styling-hooks)               | The short hook table in the package guide.                       |
| [../spec/index.md](../spec/index.md)                   | The canonical contract the hooks are drawn from.                 |
| [../examples/](../examples/)                           | Runnable components, including a live RTL preview and an NHS-style banner. |

---

Lily™ and Lily Design System™ are trademarks.
