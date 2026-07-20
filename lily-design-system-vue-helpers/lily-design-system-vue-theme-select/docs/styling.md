# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the select
exposes.

## Class hooks

| Selector                                  | Element                              |
| ----------------------------------------- | ------------------------------------ |
| `.theme-select`                           | The root `<select>`.                 |
| `.theme-select.{consumerClass}`           | Both classes when `class` is passed. |
| `.theme-select > .theme-select-option`    | Each `<option>` in the select, including the placeholder. |
| `.theme-select-placeholder`               | The leading placeholder `<option>` (`value=""`). Always the first child, in both default and custom-slot rendering. |

If you pass a default slot, only `.theme-select` is guaranteed on
the root; the inner classes are up to your markup.

## Attribute hooks

| Attribute                          | On                  | Purpose                          |
| ---------------------------------- | ------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
.theme-select {
    /*
     * The closed control always shows the placeholder word, so it can
     * be sized to that word instead of to the longest theme name.
     */
    field-sizing: content; /* Chrome 123+: size to the shown option */
    width: auto;
    max-width: 12ch; /* fallback for Firefox / Safari */

    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, transparent);
    color: inherit;
    cursor: pointer;
}

.theme-select:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}

.theme-select-option {
    /* Native <option> styling is largely platform-controlled. */
    color: inherit;
}
```

## Don'ts

- Don't hide the `<select>` with `display: none`. It is the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to visually replace it.
- Don't override the select's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't add scoped styles (`<style scoped>`) inside `ThemeSelect.vue`
  — the helper is headless. Style from the consumer side.

## Vue scoped styles in consumer wrappers

If a consumer wraps `ThemeSelect` in their own SFC and uses
`<style scoped>`, the scoped attribute selector applies to the
root `<select>` because Vue forwards data-attributes to the root.
Your selector still needs to use the base class:

```vue
<template>
    <ThemeSelect class="my-theme-select" ... />
</template>

<style scoped>
.my-theme-select {
    /* … */
}
.my-theme-select :deep(.theme-select-option) {
    /* :deep targets descendants regardless of the scoped boundary */
}
</style>
```

`:deep()` is the Vue 3 scoped-styles way to reach into the inner
markup without breaking encapsulation for other components.

---

Lily™ and Lily Design System™ are trademarks.
