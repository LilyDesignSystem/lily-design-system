# Styling

The select is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the select exposes.

## Class hooks

| Selector                         | Element                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `.theme-picker`                 | The root `<div>`.                                                                                                                        |
| `.theme-picker.{consumerClass}` | Both classes when `className` is passed.                                                                                                 |
| `.theme-picker-button`          | The trigger `<button>`.                                                                                                                  |
| `.theme-picker-icon`            | The `<span>` holding the default glyph. Absent when you pass `children`.                                                                 |
| `.theme-picker-list`            | The `<ul role="listbox">` dropdown.                                                                                                      |
| `.theme-picker-option`          | Each `<li role="option">`.                                                                                                               |
| `.theme-picker-status`          | The consumer-rendered status line announcing the active theme. Not emitted by the component — you render it, and the examples always do. |

A `children` render prop replaces the contents of the button only, so
every hook above except `.theme-picker-icon` is still guaranteed.

### `.theme-picker-status`

The status line is part of the default pattern, not decoration: the
closed control is an icon button, so this element is the only place the
active theme is stated. See
[accessibility.md](./accessibility.md). Style it as ordinary body copy:

```css
.theme-picker-status {
  margin-block-start: 0.5rem;
  font-size: 0.875rem;
  color: var(--theme-color-base-content, currentColor);
}
```

## Attribute hooks

| Attribute                         | On                          | Purpose                                                               |
| --------------------------------- | --------------------------- | --------------------------------------------------------------------- |
| `aria-expanded="true\|false"`     | `.theme-picker-button`     | Open state — style the trigger, e.g. rotate a caret.                  |
| `hidden`                          | `.theme-picker-list`       | Present while closed. This is what opens and closes the dropdown.     |
| `aria-selected="true\|false"`     | `.theme-picker-option`     | The active theme.                                                     |
| `data-active`                     | `.theme-picker-option`     | The keyboard-active option (present on exactly one, only while open). |
| `data-theme="<slug>"`             | `target` (default `<html>`) | Active theme indicator for theme CSS files.                           |
| `data-lily-theme-picker="<name>"` | the managed `<link>`        | Discriminator for multiple selects.                                   |

`aria-selected` and `data-active` are different things and both need a
style: `aria-selected` is _the theme in effect_, `data-active` is _what
`Enter` would pick right now_. The options never take DOM focus (the
listbox does, and tracks them with `aria-activedescendant`), so
`:focus-visible` will never match an option — `[data-active]` is the
only hook for the moving highlight.

## Positioning is yours

The package ships no CSS at all, which includes no positioning. Left
unstyled, the `<ul>` renders as a block in normal flow and pushes the
page around when it opens. The minimum to make it a dropdown:

```css
.theme-picker {
  position: relative;
  display: inline-block;
}

.theme-picker-list {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 0;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 100%;
  max-height: 20rem;
  overflow-y: auto;
}
```

Open / close needs no CSS: the component toggles the `hidden`
attribute, and the browser's UA stylesheet applies `display: none`. If
you set `display` on `.theme-picker-list` yourself, you will override
that — re-assert it:

```css
.theme-picker-list[hidden] {
  display: none;
}
```

## Suggested baseline CSS

Drop into the consumer's app stylesheet, on top of the positioning above:

```css
.theme-picker-button {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--theme-color-base-300, currentColor);
  border-radius: var(--theme-radius-selector, 0.25rem);
  background: none;
  cursor: pointer;
  line-height: 1;
}

.theme-picker-icon {
  font-size: 1.25em;
}

.theme-picker-list {
  border: 1px solid var(--theme-color-base-300, currentColor);
  border-radius: var(--theme-radius-selector, 0.25rem);
  background: var(--theme-color-base-100, canvas);
}

.theme-picker-option {
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}

/* What Enter would select right now. */
.theme-picker-option[data-active] {
  background: var(--theme-color-base-200, highlight);
}

/* The theme currently in effect. */
.theme-picker-option[aria-selected="true"] {
  font-weight: 600;
}

/* Both the button and the list take focus. */
.theme-picker-button:focus-visible,
.theme-picker-list:focus-visible {
  outline: 2px solid var(--theme-color-primary, currentColor);
  outline-offset: 2px;
}
```

## Visually-hidden status line

Prefer the status line visible — with an icon-only trigger it is the
only on-screen record of the
active theme, and it helps sighted and cognitively-loaded users, not
just screen-reader users. When a design genuinely cannot spare the
space, **hide the element rather than removing it** so the announcement
still happens:

```css
.theme-picker-status {
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
import { ThemePicker } from "./lily-design-system-react-theme-picker";

const StyledPicker = styled(ThemePicker)`
  /* This targets the .theme-picker root <div> */
  position: relative;
  display: inline-block;

  .theme-picker-list {
    position: absolute;
    inset-block-start: 100%;
    border: 1px solid var(--theme-color-base-300);
  }
`;
```

`styled(Component)` passes a `className` prop through; the select
accepts and forwards it onto the root `<div>` after the
`theme-picker` base class. Nested selectors then reach the button, the
list, and the options.

## Tailwind CSS

The select's class hook is plain, so Tailwind utilities apply via
the consumer-supplied `className` prop:

```tsx
<ThemePicker
  label="Theme"
  themesUrl="/t/"
  themes={["light", "dark"]}
  className="relative inline-block"
/>
```

`className` reaches only the root `<div>`. The button, list, and
options are component-owned and carry no utility classes, so style them
from your stylesheet via the kebab-case hooks (Tailwind's `@apply` or a
plain rule both work). The `children` render prop can carry utility
classes, but it only reaches the button's glyph.

## Don'ts

- Don't remove the button's `aria-label`. It is the accessible name
  of the control — and the only one, since the glyph is `aria-hidden`.
- Don't override the component's `aria-*` attributes. They are part of
  the accessibility contract.
- Don't set `outline: none` on the button or the list. Both take focus,
  and visible focus is required by WCAG 2.4.7.
- Don't style options with `:focus` / `:focus-visible` — they never
  take DOM focus. Use `[data-active]`.
- Don't fight the `hidden` attribute with `display: block`; that leaves
  the dropdown permanently open.

---

Lily™ and Lily Design System™ are trademarks.
