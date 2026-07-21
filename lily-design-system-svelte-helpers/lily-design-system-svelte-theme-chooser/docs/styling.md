# Styling

The select is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the select exposes.

**The listbox needs positioning CSS from you.** Without it the `<ul>`
renders in normal document flow and pushes the rest of the page down
when it opens. See [Positioning the listbox](#positioning-the-listbox).

## Class hooks

| Selector                  | Element                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `.theme-chooser`           | The root `<div>`.                                          |
| `.theme-chooser.{consumerClass}` | Both classes when `class` is passed.                 |
| `.theme-chooser-button`    | The trigger `<button type="button">`.                      |
| `.theme-chooser-icon`      | The `<span>` wrapping the `◑` glyph. Absent when a `children` snippet replaces the glyph. |
| `.theme-chooser-list`      | The popup `<ul role="listbox">`.                           |
| `.theme-chooser-option`    | Each `<li role="option">`.                                 |
| `.theme-chooser-status`    | The status line stating the active theme. Rendered by the consumer *next to* the select, not by the component — see [The status line](#the-status-line). |

The `theme-chooser-placeholder` hook from 0.3.0 **no longer exists.**
There is no placeholder option, because there is no `<select>`.

If you pass a `children` snippet it replaces the glyph inside the
button, so `.theme-chooser-icon` disappears but every other hook stays.

## Attribute hooks

| Attribute                         | On                            | Purpose                                     |
| --------------------------------- | ----------------------------- | ------------------------------------------- |
| `[aria-expanded="true"]`          | `.theme-chooser-button`        | The listbox is open. Style the trigger's open state. |
| `[hidden]`                        | `.theme-chooser-list`          | The listbox is closed.                      |
| `[aria-selected="true"]`          | `.theme-chooser-option`        | The **applied** theme.                      |
| `[data-active]`                   | `.theme-chooser-option`        | The **keyboard-active** option. Bare attribute, present on at most one option, only while open. |
| `data-theme="<slug>"`             | `target` (default `<html>`)   | Active theme indicator for theme CSS files. |
| `data-lily-theme-chooser="<name>"` | the managed `<link>`          | Discriminator for multiple selects.         |

`[aria-selected]` and `[data-active]` are different things and both
need styling. `aria-selected` is "this is the theme in force";
`data-active` is "this is where the keyboard cursor is right now". They
coincide when the listbox first opens and diverge as soon as the user
arrows.

## Positioning the listbox

The minimum that makes the control behave like a popup:

```css
.theme-chooser {
  position: relative;
  display: inline-block;
}

.theme-chooser-list {
  position: absolute;
  z-index: 10;
  inset-block-start: 100%;
  inset-inline-start: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  max-block-size: 20rem;
  overflow-y: auto;
}

.theme-chooser-list[hidden] {
  display: none;
}
```

Notes:

- `inset-inline-*` rather than `left` / `right`, so the popup flips
  correctly under `dir="rtl"`.
- `max-block-size` plus `overflow-y` matters for large catalogs: the
  component calls `scrollIntoView({ block: "nearest" })` on the active
  option, which only does something useful if the list actually
  scrolls.
- `[hidden]` needs an explicit `display: none` because a `display`
  declaration on a styled `<ul>` overrides the UA's `[hidden]` rule.
  Getting this wrong leaves the closed list permanently visible.

## Suggested baseline CSS

```css
.theme-chooser-button {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-base-300, currentColor);
  border-radius: var(--radius-selector, 0.25rem);
  background: var(--color-base-100, white);
  color: inherit;
  cursor: pointer;
  line-height: 1;
}

.theme-chooser-button:focus-visible {
  outline: 2px solid var(--color-primary, currentColor);
  outline-offset: 2px;
}

.theme-chooser-option {
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}

/* Where the keyboard cursor is. */
.theme-chooser-option[data-active] {
  background: var(--color-base-200, #eee);
}

/* Which theme is actually applied. */
.theme-chooser-option[aria-selected="true"] {
  font-weight: 600;
}
```

Do not convey the applied theme by colour alone (WCAG 1.4.1) — the
weight change above, a checkmark, or a text prefix all work.

## Sizing the control

The whole point of the icon button is that it is one glyph wide
regardless of the catalog, so there is nothing to cap. The
`field-sizing: content` recipe from 0.3.0 is obsolete along with the
`<select>` it sized.

The listbox is what now needs a width decision, since it is absolutely
positioned and will otherwise shrink-wrap to its content:

```css
.theme-chooser-list {
  min-inline-size: 12rem;
}
```

## The glyph

`.theme-chooser-icon` holds a bare Unicode character, U+25D1. Its
rendering depends on the fonts installed on the user's device — see
[accessibility.md § Tradeoff 3](./accessibility.md#tradeoff-3--the-glyph-is-font-dependent).
Pin a font stack you have verified:

```css
.theme-chooser-icon {
  font-family: system-ui, "Segoe UI Symbol", "Apple Symbols", sans-serif;
  font-size: 1.125em;
}
```

## The status line

The closed control shows only a glyph, so the active theme is not
written anywhere on the page unless you write it. The recommended
pattern pairs the select with a polite live region — see
[accessibility.md § The status region](./accessibility.md#the-status-region).
The component does not render it; you do, with the
`.theme-chooser-status` hook:

```svelte
<p class="theme-chooser-status" aria-live="polite">
  Active theme: {labelFor(theme)}
</p>
```

Keep it **visible** by default — that is now the main reason to have
it. A minimal treatment:

```css
.theme-chooser-status {
  margin-block-start: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-base-content, inherit);
}
```

If a design genuinely cannot spare the space, hide it **visually only**
— keep the element in the DOM and keep `aria-live`, so it still
announces:

```css
.theme-chooser-status {
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

- Don't hide the button with `display: none`. It is the accessibility
  tree's anchor point. Use `clip-path` or a `.sr-only` recipe if you
  need to visually replace it.
- Don't forget `.theme-chooser-list[hidden] { display: none; }`.
- Don't style only `[aria-selected]` and skip `[data-active]`, or
  keyboard users lose their cursor.
- Don't override the component's `aria-*` attributes from CSS or
  rest-props. They are part of the accessibility contract.

---

Lily™ and Lily Design System™ are trademarks.
