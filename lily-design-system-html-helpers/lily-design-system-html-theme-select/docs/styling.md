# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the select
exposes.

## Class hooks

| Selector                                             | Element                                  |
| ---------------------------------------------------- | ---------------------------------------- |
| `theme-select` (the host element tag)                | The custom-element host.                 |
| `.theme-select`                                      | The rendered `<select>`.                 |
| `.theme-select.{consumerClass}`                      | Both classes when `class` is passed.     |
| `.theme-select-option`                               | Each `<option>`, including the placeholder. |
| `.theme-select-placeholder`                          | The leading placeholder `<option>` (always the displayed one). |

The host element (`<theme-select>` itself) inherits no styles from
the select; you can style it directly if you need to (e.g.
`theme-select { display: block; }`).

If you subclass the element, only the host tag and the
`.theme-select` class are guaranteed; the inner classes are up to
your subclass.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

## Targeting the custom element vs the rendered select

Both selectors work; pick whichever reads more clearly:

```css
/* Target the custom element directly (the host): */
theme-select { display: block; max-width: 30rem; }

/* Target the rendered select: */
.theme-select {
    display: block;
}
```

The host tag is good for layout (block/grid context); the
`.theme-select` class is good for `<select>`-specific styling.

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
theme-select {
    display: block;
}

.theme-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, white);
    color: var(--color-base-content, currentColor);
    cursor: pointer;
}

.theme-select:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

.theme-select-option {
    /* Native <option> styling is limited; most browsers ignore
       custom backgrounds. Keep it simple. */
    color: var(--color-base-content, currentColor);
}
```

## Keeping the control narrow

The closed `<select>` always displays the placeholder option rather
than the active theme name, so its intrinsic width is governed by
one short word instead of the longest theme label. To let the
control actually shrink to that width:

```css
.theme-select {
    field-sizing: content;  /* Chrome 123+: size to the shown option */
    width: auto;
    max-width: 12ch;        /* fallback for Firefox / Safari */
}
```

`field-sizing: content` sizes the control to the option currently
shown. Browsers without it fall back to `max-width`, which clamps
the default "widest option" sizing. Adjust the `ch` value to the
length of your placeholder text — remember it is translated, so
leave headroom.

## Don'ts

- Don't hide the `<option>` elements with `display: none`. They are
  the accessibility tree's anchor point. Keep the native `<select>`
  intact; if you need a different visual, subclass and own the a11y
  contract.
- Don't override the select's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't write CSS inside `theme-select.ts` — the helper is
  headless. Style from the consumer side.

## Default browser styles to override

`<select>` has a platform-native appearance (the chrome dropdown
control). Reset or restyle it in the consumer CSS if you want a
custom look:

```css
.theme-select {
    /* Opt out of the native control chrome for a custom look. */
    appearance: none;
    padding: 0.25rem 0.5rem;
    border: 1px solid currentColor;
    border-radius: 0.25rem;
}
```

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

The select swaps the `<link>` `href` to load the right file *and*
sets `data-theme` to switch which `:root[data-theme]` rules apply.
Either signal alone is enough; both together make preloading
strategies work.

## Custom-element vs select specificity

`theme-select` (custom element) has specificity 0,0,1 (one type
selector). `.theme-select` (class on the `<select>`) has specificity
0,1,0. If you write rules at both levels, the `<select>` class
wins:

```css
theme-select { padding: 1rem; }     /* specificity 0,0,1 */
.theme-select { padding: 0.5rem; }  /* specificity 0,1,0 — wins */
```

This is the same cascade everyone else's CSS plays by; no
custom-element-specific quirks.

---

Lily™ and Lily Design System™ are trademarks.
