# Styling

The picker is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the picker exposes.

## Class hooks

| Selector                                             | Element                              |
| ---------------------------------------------------- | ------------------------------------ |
| `.theme-picker`                                      | The root `<fieldset role="radiogroup">`. |
| `.theme-picker.{consumerClass}`                      | Both classes when `className` is passed. |
| `.theme-picker > .theme-picker-option`               | Each `<label>` wrapping a radio.     |
| `.theme-picker-option > input[type="radio"]`         | The native radio input.              |
| `.theme-picker-option > .theme-picker-option-label`  | The visible option text.             |

If you pass a `children` render prop, only `.theme-picker` is
guaranteed on the root; the inner classes are up to your markup.

## Attribute hooks

| Attribute                          | On                          | Purpose                          |
| ---------------------------------- | --------------------------- | -------------------------------- |
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

## CSS-in-JS

The picker ships zero CSS, so it works with any CSS-in-JS solution
the consumer prefers (styled-components, emotion, vanilla-extract,
CSS modules). Target the kebab-case class hooks above.

Example with styled-components:

```tsx
import styled from "styled-components";
import { ThemePicker } from "./lily-design-system-react-theme-picker";

const StyledPicker = styled(ThemePicker)`
    /* This targets the .theme-picker root */
    border: 0;
    padding: 0;
    margin: 0;

    .theme-picker-option {
        border: 1px solid var(--theme-color-base-300);
    }
`;
```

`styled(Component)` passes a `className` prop through; the picker
accepts and forwards it onto the `<fieldset>` after the
`theme-picker` base class.

## Tailwind CSS

The picker's class hook is plain, so Tailwind utilities apply via
the consumer-supplied `className` prop:

```tsx
<ThemePicker
    label="Theme"
    themesUrl="/t/"
    themes={["light", "dark"]}
    className="flex gap-2 border-0 p-0"
/>
```

For per-option styling, override with a custom `children` render
prop, since you can't put utility classes onto the picker's
internally-rendered radios.

## Don'ts

- Don't hide the radio inputs with `display: none`. They are the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to render only the labels.
- Don't override the picker's `aria-*` attributes from CSS. They are
  part of the accessibility contract.
- Don't set `outline: none` on the radio or its label. Visible
  focus is required by WCAG 2.4.7.
