# Styling

The picker is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the picker
exposes.

## Class hooks

| Selector                                             | Element                              |
| ---------------------------------------------------- | ------------------------------------ |
| `.theme-picker`                                      | The root `<fieldset role="radiogroup">`. |
| `.theme-picker.{consumerClass}`                      | Both classes when `class` is passed. |
| `.theme-picker > .theme-picker-option`               | Each `<label>` wrapping a radio.     |
| `.theme-picker-option > input[type="radio"]`         | The native radio input.              |
| `.theme-picker-option > .theme-picker-option-label`  | The visible option text.             |

If you pass a default slot, only `.theme-picker` is guaranteed on
the root; the inner classes are up to your markup.

## Attribute hooks

| Attribute                          | On                  | Purpose                          |
| ---------------------------------- | ------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-picker="<name>"`  | the managed `<link>`        | Discriminator for multiple pickers. |

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
- Don't add scoped styles (`<style scoped>`) inside `ThemePicker.vue`
  — the helper is headless. Style from the consumer side.

## Vue scoped styles in consumer wrappers

If a consumer wraps `ThemePicker` in their own SFC and uses
`<style scoped>`, the scoped attribute selector applies to the
root `<fieldset>` because Vue forwards data-attributes to the root.
Your selector still needs to use the base class:

```vue
<template>
    <ThemePicker class="my-theme-picker" ... />
</template>

<style scoped>
.my-theme-picker {
    /* … */
}
.my-theme-picker :deep(.theme-picker-option) {
    /* :deep targets descendants regardless of the scoped boundary */
}
</style>
```

`:deep()` is the Vue 3 scoped-styles way to reach into the inner
markup without breaking encapsulation for other components.
