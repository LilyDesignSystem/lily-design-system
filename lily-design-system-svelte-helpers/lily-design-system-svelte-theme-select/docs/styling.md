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
| `.theme-select-status`                    | The status line stating the active theme. Rendered by the consumer *next to* the select, not by the component — see [The status line](#the-status-line). |

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

## The status line

Because the closed control always shows the placeholder, the default
pattern pairs the select with a live region that states the active
theme — see
[accessibility.md](./accessibility.md#the-compensating-status-region-is-the-default-pattern).
The component does not render it; you do, with the
`.theme-select-status` hook:

```svelte
<p class="theme-select-status" aria-live="polite">
  Active theme: {labelFor(theme)}
</p>
```

Keep it **visible** by default. It helps sighted users and users who
benefit from an explicit confirmation of what just changed, and AAA
favours showing it. A minimal visible treatment:

```css
.theme-select-status {
  margin-block-start: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-base-content, inherit);
}
```

If a design genuinely cannot spare the space, hide it **visually only**
— keep the element in the DOM and keep `aria-live`, so it still
announces:

```css
.theme-select-status {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

Do not use `display: none` or `visibility: hidden` here: both remove
the element from the accessibility tree, which silences the live region
and defeats the point.

## Don'ts

- Don't hide the `<select>` with `display: none`. It is the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to visually replace it.
- Don't override the select's `aria-*` attributes from CSS. They are
  part of the accessibility contract.

---

Lily™ and Lily Design System™ are trademarks.
