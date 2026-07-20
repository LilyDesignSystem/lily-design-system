# Styling

The select is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the select exposes.

## Class hooks

| Selector                                  | Element                              |
| ----------------------------------------- | ------------------------------------ |
| `.theme-select`                           | The root `<select>`.                 |
| `.theme-select.{consumerClass}`           | Both classes when `class` is passed. |
| `.theme-select > .theme-select-option`    | Each `<option>` in the select.       |
| `.theme-select-placeholder`               | The leading placeholder `<option>` — the one the closed control always displays. |

If you pass a `children` snippet, only `.theme-select` is guaranteed
on the root; the inner classes are up to your markup.

## Attribute hooks

| Attribute                          | On                  | Purpose                          |
| ---------------------------------- | ------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

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

## Sizing the control to the placeholder

The closed control always displays the placeholder word ("Theme"), never
the active theme name — so it can be sized to that word rather than to
the widest option:

```css
.theme-select {
  width: auto;
  max-width: 12ch;
  field-sizing: content;
}
```

`field-sizing: content` (Chromium 123+) sizes the control to the option
it is displaying, which is always the placeholder. `max-width` caps the
fallback in Firefox and Safari, which still size to the widest option.

The root [`themes/`](../../../themes) stylesheets ship this rule already,
scoped with `:has(> .theme-select-placeholder)` so it applies to this
helper and not to the catalog `theme-select` component, which shares the
class hook but displays its real value. If you write the rule yourself
and use both, scope it the same way.

## Don'ts

- Don't hide the `<select>` with `display: none`. It is the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to visually replace it.
- Don't override the select's `aria-*` attributes from CSS. They are
  part of the accessibility contract.

---

Lily™ and Lily Design System™ are trademarks.
