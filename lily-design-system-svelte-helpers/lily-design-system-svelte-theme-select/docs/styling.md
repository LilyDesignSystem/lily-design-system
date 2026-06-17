# Styling

The picker is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the picker exposes.

## Class hooks

| Selector                                  | Element                              |
| ----------------------------------------- | ------------------------------------ |
| `.theme-select`                           | The root `<select>`.                 |
| `.theme-select.{consumerClass}`           | Both classes when `class` is passed. |
| `.theme-select > .theme-select-option`    | Each `<option>` in the select.       |

If you pass a `children` snippet, only `.theme-select` is guaranteed
on the root; the inner classes are up to your markup.

## Attribute hooks

| Attribute                          | On                  | Purpose                          |
| ---------------------------------- | ------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple pickers. |

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
.theme-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-base-300, currentColor);
  border-radius: var(--radius-selector, 0.25rem);
  background: var(--color-base-100, white);
  color: inherit;
  cursor: pointer;
}

.theme-select:focus-visible {
  outline: 2px solid var(--color-primary, currentColor);
  outline-offset: 2px;
}
```

## Don'ts

- Don't hide the `<select>` with `display: none`. It is the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to visually replace it.
- Don't override the picker's `aria-*` attributes from CSS. They are
  part of the accessibility contract.
