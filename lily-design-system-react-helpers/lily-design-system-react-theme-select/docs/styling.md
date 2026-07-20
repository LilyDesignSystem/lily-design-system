# Styling

The select is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the select exposes.

## Class hooks

| Selector                          | Element                                  |
| --------------------------------- | ---------------------------------------- |
| `.theme-select`                   | The root `<select>`.                     |
| `.theme-select.{consumerClass}`   | Both classes when `className` is passed. |
| `.theme-select > .theme-select-option` | Each `<option>`.                    |
| `.theme-select-placeholder`       | The leading placeholder `<option>` (also carries `.theme-select-option`). |
| `.theme-select-status`            | The consumer-rendered status line announcing the active theme. Not emitted by the component — you render it, and the examples always do. |

If you pass a `children` render prop, only `.theme-select` is
guaranteed on the root; the inner classes are up to your markup.

### `.theme-select-status`

The status line is part of the default pattern, not decoration: the
closed control is placeholder-pinned, so this element is the only place
the active theme is stated. See
[accessibility.md](./accessibility.md). Style it as ordinary body copy:

```css
.theme-select-status {
    margin-block-start: 0.5rem;
    font-size: 0.875rem;
    color: var(--theme-color-base-content, currentColor);
}
```

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `target` (default `<html>`) | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

## Suggested baseline CSS

Drop into the consumer's app stylesheet:

```css
.theme-select {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--theme-color-base-300, currentColor);
    border-radius: var(--theme-radius-selector, 0.25rem);
    cursor: pointer;

    /*
     * The closed control always shows the short placeholder word, so the
     * select can be sized to it rather than to the longest theme name.
     */
    field-sizing: content; /* Chrome 123+: size to the shown option */
    width: auto;
    max-width: 12ch; /* fallback for Firefox / Safari */
}

.theme-select-option:checked {
    background: var(--theme-color-primary, currentColor);
    color: var(--theme-color-primary-content, white);
}

.theme-select:focus-visible {
    outline: 2px solid var(--theme-color-primary, currentColor);
    outline-offset: 2px;
}
```

## Visually-hidden status line

Prefer the status line visible — it is the only on-screen record of the
active theme, and it helps sighted and cognitively-loaded users, not
just screen-reader users. When a design genuinely cannot spare the
space, **hide the element rather than removing it** so the announcement
still happens:

```css
.theme-select-status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    white-space: nowrap;
    clip-path: inset(50%);
}
```

Do not use `display: none` or `visibility: hidden` — both remove the
element from the accessibility tree, so the live region goes silent and
you lose the compensation entirely.

## CSS-in-JS

The select ships zero CSS, so it works with any CSS-in-JS solution
the consumer prefers (styled-components, emotion, vanilla-extract,
CSS modules). Target the kebab-case class hooks above.

Example with styled-components:

```tsx
import styled from "styled-components";
import { ThemeSelect } from "./lily-design-system-react-theme-select";

const StyledPicker = styled(ThemeSelect)`
    /* This targets the .theme-select root */
    border: 0;
    padding: 0;
    margin: 0;

    .theme-select-option {
        border: 1px solid var(--theme-color-base-300);
    }
`;
```

`styled(Component)` passes a `className` prop through; the select
accepts and forwards it onto the `<select>` after the
`theme-select` base class.

## Tailwind CSS

The select's class hook is plain, so Tailwind utilities apply via
the consumer-supplied `className` prop:

```tsx
<ThemeSelect
    label="Theme"
    themesUrl="/t/"
    themes={["light", "dark"]}
    className="flex gap-2 border-0 p-0"
/>
```

For per-option styling, override with a custom `children` render
prop, since you can't put utility classes onto the select's
internally-rendered options.

## Don'ts

- Don't remove the select's `aria-label`. It is the accessible name
  of the control.
- Don't override the select's `aria-*` attributes from CSS. They are
  part of the accessibility contract.
- Don't set `outline: none` on the select. Visible focus is required
  by WCAG 2.4.7.

---

Lily™ and Lily Design System™ are trademarks.
