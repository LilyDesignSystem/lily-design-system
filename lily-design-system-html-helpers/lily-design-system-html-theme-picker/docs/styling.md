# Styling

The picker is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the picker
exposes.

## Class hooks

| Selector                                             | Element                                  |
| ---------------------------------------------------- | ---------------------------------------- |
| `theme-picker` (the host element tag)                | The custom-element host.                 |
| `.theme-picker`                                      | The rendered `<fieldset role="radiogroup">`. |
| `.theme-picker.{consumerClass}`                      | Both classes when `class` is passed.     |
| `.theme-picker > .theme-picker-option`               | Each `<label>` wrapping a radio.         |
| `.theme-picker-option > input[type="radio"]`         | The native radio input.                  |
| `.theme-picker-option > .theme-picker-option-label`  | The visible option text.                 |

The host element (`<theme-picker>` itself) inherits no styles from
the picker; you can style it directly if you need to (e.g.
`theme-picker { display: block; }`).

If you subclass the element, only the host tag and the
`.theme-picker` class are guaranteed; the inner classes are up to
your subclass.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-picker="<name>"`  | the managed `<link>`        | Discriminator for multiple pickers. |

## Targeting the custom element vs the rendered fieldset

Both selectors work; pick whichever reads more clearly:

```css
/* Target the custom element directly (the host): */
theme-picker { display: block; max-width: 30rem; }

/* Target the rendered fieldset (the radiogroup): */
.theme-picker {
    border: 0;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
```

The host tag is good for layout (block/grid context); the
`.theme-picker` class is good for radiogroup-specific styling.

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
theme-picker {
    display: block;
}

.theme-picker {
    border: 0;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.theme-picker-option {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    cursor: pointer;
}

.theme-picker-option:has(:checked) {
    background: var(--color-primary, currentColor);
    color: var(--color-primary-content, white);
}

.theme-picker-option:focus-within {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

## Don'ts

- Don't hide the radio inputs with `display: none`. They are the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to render only the labels.
- Don't override the picker's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't write CSS inside `theme-picker.ts` — the helper is
  headless. Style from the consumer side.

## Default browser styles to override

`<fieldset>` and `<label>` have heavyweight default browser styles
(fieldset has a border, label has a baseline). Reset them in the
consumer CSS:

```css
.theme-picker {
    /* Remove default <fieldset> border. */
    border: 0;
    margin: 0;
    padding: 0;
    /* Remove the line-break before the legend if you add one. */
    min-inline-size: 0;
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

The picker swaps the `<link>` `href` to load the right file *and*
sets `data-theme` to switch which `:root[data-theme]` rules apply.
Either signal alone is enough; both together make preloading
strategies work.

## Custom-element vs fieldset specificity

`theme-picker` (custom element) has specificity 0,0,1 (one type
selector). `.theme-picker` (class on the fieldset) has specificity
0,1,0. If you write rules at both levels, the fieldset class
wins:

```css
theme-picker { padding: 1rem; }     /* specificity 0,0,1 */
.theme-picker { padding: 0.5rem; }  /* specificity 0,1,0 — wins */
```

This is the same cascade everyone else's CSS plays by; no
custom-element-specific quirks.
