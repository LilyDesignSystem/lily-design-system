# Styling

The control is headless: it ships **no CSS at all**. Every visual
decision belongs to the consumer. This guide lists the hooks the
control exposes.

## The list has no positioning until you give it some

Read this before anything else. The element renders the dropdown as
an ordinary `<ul>` in normal flow and toggles the `hidden` attribute
on it. It sets no `position`, no `z-index`, no offsets — headless
means headless.

So out of the box the list does not overlay the page. It appears
*below the button, in flow*, pushing subsequent content down when it
opens. That is almost never what you want, and it is not a bug.

The minimum fix is two declarations:

```css
.theme-chooser { position: relative; }

.theme-chooser-list {
    position: absolute;
    inset-block-start: 100%;   /* directly under the button */
    inset-inline-start: 0;
    z-index: 10;
}
```

Everything else — width, collision handling, flipping above the
button near the viewport edge, animation — is likewise yours. The
element does no measuring and no repositioning.

## Class hooks

| Selector                                | Element                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `theme-chooser` (the host element tag)   | The custom-element host.                             |
| `.theme-chooser`                         | The rendered `<div>` root.                           |
| `.theme-chooser.{consumerClass}`         | Both classes when `class` is passed.                 |
| `.theme-chooser-button`                  | The trigger `<button>`.                              |
| `.theme-chooser-icon`                    | The `<span>` wrapping the glyph (default content only). |
| `.theme-chooser-list`                    | The `<ul role="listbox">`.                           |
| `.theme-chooser-option`                  | Each `<li role="option">`.                           |
| `.theme-chooser-status`                  | The consumer-rendered status region announcing the active theme. |

`.theme-chooser-status` is not emitted by the element — you render it
yourself, next to the control. It is listed here because it is part
of the default pattern (see
[accessibility.md](./accessibility.md#the-status-region-is-the-default-pattern)),
so the class name is a shared convention worth styling consistently.

The hidden `<input>` carries no class: it is `type="hidden"` and
never rendered.

If you subclass the element and replace its rendering, only the host
tag and the `.theme-chooser` root class are guaranteed; the inner
classes are up to your subclass.

## State hooks

These are what make the control legible without any JS of your own.

| Selector                                     | Meaning                                                        |
| -------------------------------------------- | -------------------------------------------------------------- |
| `.theme-chooser-button[aria-expanded="true"]` | The list is open.                                              |
| `.theme-chooser-list[hidden]`                 | The list is closed. (The UA stylesheet already hides it.)      |
| `.theme-chooser-option[data-active]`          | The **keyboard-highlighted** option — where `Enter` would land. |
| `.theme-chooser-option[aria-selected="true"]` | The **chosen** option — the theme currently applied.           |

`[data-active]` and `[aria-selected]` are different things and often
disagree while the list is open. Style them distinctly: a background
for the active option, a check mark or weight change for the
selected one. If you style them identically, a keyboard user cannot
tell where they are from what they have.

Because focus sits on the `<ul>` while the list is open (not on any
`<li>`), `.theme-chooser-option:focus` never matches. Use
`[data-active]`.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-chooser="<name>"`  | the managed `<link>`        | Discriminator for multiple controls. |

## A minimal worked example

Everything the control needs to look and behave like a normal
dropdown menu. Drop it into the consumer's stylesheet:

```css
/* 1. The root is the positioning context for the dropdown. */
theme-chooser {
    display: inline-block;
}

.theme-chooser {
    position: relative;
    display: inline-block;
}

/* 2. The trigger button. */
.theme-chooser-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, white);
    color: var(--color-base-content, currentColor);
    cursor: pointer;
    line-height: 1;
}

.theme-chooser-button:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

.theme-chooser-icon {
    font-size: 1.125rem;
}

/* 3. The dropdown itself. Without position/z-index it renders in
      flow and pushes the page down when it opens. */
.theme-chooser-list {
    position: absolute;
    inset-block-start: calc(100% + 0.25rem);
    inset-inline-start: 0;
    z-index: 10;
    min-inline-size: 12rem;
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, white);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
}

/* 4. Respect `hidden`. Any `display` rule on the list would
      override the UA stylesheet's `display: none` and leave the
      closed list visible — so scope display to :not([hidden]) or
      re-assert it here. */
.theme-chooser-list[hidden] {
    display: none;
}

/* 5. Focus lives on the <ul> while open, so style its ring too. */
.theme-chooser-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

/* 6. Options. */
.theme-chooser-option {
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    color: var(--color-base-content, currentColor);
}

/* The keyboard-highlighted option — where Enter would land. */
.theme-chooser-option[data-active] {
    background: var(--color-base-200, #eee);
}

/* The chosen option — the theme currently applied. Deliberately a
   different signal from [data-active]: they often disagree. */
.theme-chooser-option[aria-selected="true"] {
    font-weight: 600;
}

.theme-chooser-option[aria-selected="true"]::after {
    content: " ✓";
}

/* Pointer hover mirrors the keyboard highlight. */
.theme-chooser-option:hover {
    background: var(--color-base-200, #eee);
}
```

### The `hidden` trap

This is the one thing that reliably bites. Setting a `display` value
on `.theme-chooser-list` — `display: flex`, `display: grid`, even
`display: block` — overrides the user-agent stylesheet's
`[hidden] { display: none }`, because a class selector outranks it.
The result is a dropdown that is permanently visible.

Two ways out. Either re-assert the hidden rule after your display
rule:

```css
.theme-chooser-list { display: grid; }
.theme-chooser-list[hidden] { display: none; }
```

Or scope the display rule so it never applies while closed:

```css
.theme-chooser-list:not([hidden]) { display: grid; }
```

Never style the closed state with `display: none` on the options
themselves, and never swap `hidden` for `visibility: hidden` — the
element relies on `hidden` and assistive technology relies on the
list leaving the accessibility tree when closed.

## Targeting the host vs the rendered root

Both selectors work; pick whichever reads more clearly:

```css
/* Target the custom element directly (the host): */
theme-chooser { display: inline-block; }

/* Target the rendered root: */
.theme-chooser { position: relative; }
```

The host tag is good for outer layout (how the control sits in the
page); the `.theme-chooser` class is good for the control's internal
layout, and it is the one that must carry `position: relative`,
since the list is its child.

## The status region

The default pattern pairs the control with a visible status line
naming the active theme, because the closed button never does. Style
it as ordinary body text:

```css
.theme-chooser-status {
    margin: 0.5rem 0 0;
    color: var(--color-base-content, currentColor);
}
```

### Visually-hidden variant

If a design genuinely cannot spare the space, hide it visually while
keeping it in the accessibility tree. Never use `display: none`,
`visibility: hidden`, or the `hidden` attribute — all three remove
the element from the accessibility tree, which silences the live
region and defeats the whole point.

```css
.theme-chooser-status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    white-space: nowrap;
    clip-path: inset(50%);
    border: 0;
}
```

This is the standard visually-hidden recipe; if your app already has
an `.sr-only` / `.visually-hidden` utility, add that class to the
element instead of duplicating the rules.

Prefer the visible version where you can — it serves sighted and
cognitive-accessibility users too, which is what the AAA target
favours.

## Long option lists

The catalog can be large — Lily ships 45 reference themes. Cap the
list's height and let it scroll; the element already calls
`scrollIntoView({ block: "nearest" })` on the active option as the
keyboard moves it, so keyboard navigation stays visible inside a
scrolling list:

```css
.theme-chooser-list {
    max-block-size: 20rem;
    overflow-y: auto;
    overscroll-behavior: contain;
}
```

## Don'ts

- Don't set a `display` on `.theme-chooser-list` without handling
  `[hidden]` — see the trap above.
- Don't rely on `.theme-chooser-option:focus`; focus stays on the
  `<ul>`. Use `[data-active]`.
- Don't style `[data-active]` and `[aria-selected]` the same.
- Don't hide options with `display: none`. They are the
  accessibility tree's anchor point.
- Don't override the control's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't write CSS inside `theme-chooser.ts` — the helper is
  headless. Style from the consumer side.

## Theme CSS file conventions

Each theme CSS file scopes its rules to `:root[data-theme="<slug>"]`
so multiple themes can coexist on the page without overlap:

```css
/* light.css */
:root[data-theme="light"] {
    --theme-color-primary: #2563eb;
    --theme-color-base-background: #ffffff;
    --theme-color-base-content: #0f172a;
}

/* dark.css */
:root[data-theme="dark"] {
    --theme-color-primary: #60a5fa;
    --theme-color-base-background: #0b1220;
    --theme-color-base-content: #f9fafb;
}
```

The element swaps the `<link>` `href` to load the right file *and*
sets `data-theme` to switch which `:root[data-theme]` rules apply.
Either signal alone is enough; both together make preloading
strategies work.

## Custom-element vs class specificity

`theme-chooser` (custom element) has specificity 0,0,1 (one type
selector). `.theme-chooser` (class on the rendered root) has
specificity 0,1,0. If you write rules at both levels, the class
wins:

```css
theme-chooser { padding: 1rem; }     /* specificity 0,0,1 */
.theme-chooser { padding: 0.5rem; }  /* specificity 0,1,0 — wins */
```

This is the same cascade everyone else's CSS plays by; no
custom-element-specific quirks.

---

Lily™ and Lily Design System™ are trademarks.
