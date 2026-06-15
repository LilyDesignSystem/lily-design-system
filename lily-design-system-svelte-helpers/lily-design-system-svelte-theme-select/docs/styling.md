# Styling

The picker is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the picker exposes.

## Class hooks

| Selector                                             | Element                              |
| ---------------------------------------------------- | ------------------------------------ |
| `.theme-select`                                      | The root `<fieldset role="radiogroup">`. |
| `.theme-select.{consumerClass}`                      | Both classes when `class` is passed. |
| `.theme-select > .theme-select-option`               | Each `<label>` wrapping a radio.     |
| `.theme-select-option > input[type="radio"]`         | The native radio input.              |
| `.theme-select-option > .theme-select-option-label`  | The visible option text.             |

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
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.theme-select-option {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-base-300, currentColor);
  border-radius: var(--radius-selector, 0.25rem);
  cursor: pointer;
}

.theme-select-option:has(:checked) {
  background: var(--color-primary, currentColor);
  color: var(--color-primary-content, white);
}

.theme-select-option:focus-within {
  outline: 2px solid var(--color-primary, currentColor);
  outline-offset: 2px;
}
```

## Don'ts

- Don't hide the radio inputs with `display: none`. They are the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to render only the labels.
- Don't override the picker's `aria-*` attributes from CSS. They are
  part of the accessibility contract.
