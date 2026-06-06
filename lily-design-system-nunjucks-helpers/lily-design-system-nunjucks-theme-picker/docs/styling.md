# Styling

The picker is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the macro
exposes.

## Class hooks

| Selector                                             | Element                              |
| ---------------------------------------------------- | ------------------------------------ |
| `.theme-picker`                                      | The root `<fieldset role="radiogroup">`. |
| `.theme-picker.{classes}`                            | Both classes when `opts.classes` is set. |
| `.theme-picker > .theme-picker-option`               | Each `<label>` wrapping a radio.     |
| `.theme-picker-option > input[type="radio"]`         | The native radio input.              |
| `.theme-picker-option > .theme-picker-option-label`  | The visible option text.             |

If you use the `{% call %}` caller block, only `.theme-picker` is
guaranteed on the root; the inner classes are up to your markup.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-picker="<name>"`  | the managed `<link>`        | Discriminator for multiple pickers. |
| `data-lily-theme-picker-root`      | the `<fieldset>`            | `autoInit()` selector.            |

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
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
    border: 1px solid var(--theme-color-base-300, currentColor);
    border-radius: var(--theme-radius-selector, 0.25rem);
    cursor: pointer;
}

.theme-picker-option:has(:checked) {
    background: var(--theme-color-primary, currentColor);
    color: var(--theme-color-primary-content, white);
}

.theme-picker-option:focus-within {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

## NHS-style banner CSS

For an NHS UK-aligned utility banner look:

```css
.utility-banner .theme-picker {
    display: inline-flex;
    gap: 1rem;
    align-items: center;
}

.utility-banner .theme-picker-option {
    padding: 0.5rem 0.75rem;
    border: 2px solid transparent;
}

.utility-banner .theme-picker-option:has(:checked) {
    border-color: #005eb8; /* NHS blue */
}
```

## Don'ts

- Don't hide the radio inputs with `display: none`. They are the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to render only the labels.
- Don't override the picker's `aria-*` attributes from CSS. They
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

The picker's role is to swap which file is loaded (via the
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

With the picker active, switching themes swaps every variable in
one tick — no JavaScript involvement beyond the `data-theme`
attribute write.
