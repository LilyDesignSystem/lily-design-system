# Styling

The select is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the select exposes.

**The listbox needs positioning CSS from you.** Without it the `<ul>`
renders in normal document flow and pushes the rest of the page down
when it opens. See [Positioning the listbox](#positioning-the-listbox).

Because this control switches the page's writing direction, its own CSS
has to survive that switch. Use logical properties throughout — see
[RTL](#rtl-and-logical-properties).

## Class hooks

| Selector                   | Element                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `.locale-select`           | The root `<div>`.                                          |
| `.locale-select.{consumerClass}` | Both classes when `class` is passed.                 |
| `.locale-select-button`    | The trigger `<button type="button">`.                      |
| `.locale-select-icon`      | The `<span>` wrapping the globe glyph. Absent when a `children` snippet replaces the glyph. |
| `.locale-select-list`      | The popup `<ul role="listbox">`.                           |
| `.locale-select-option`    | Each `<li role="option">`.                                 |
| `.locale-select-status`    | The status line stating the active locale. Rendered by the consumer *next to* the select, not by the component — see [The status line](#the-status-line). |

The `locale-select-placeholder` hook from 0.3.0 **no longer exists.**
There is no placeholder option, because there is no `<select>`.

If you pass a `children` snippet it replaces the glyph inside the
button, so `.locale-select-icon` disappears but every other hook stays.

## Attribute hooks

| Attribute                | On                       | Purpose                                     |
| ------------------------ | ------------------------ | ------------------------------------------- |
| `[aria-expanded="true"]` | `.locale-select-button`  | The listbox is open. Style the trigger's open state. |
| `[hidden]`               | `.locale-select-list`    | The listbox is closed.                      |
| `[aria-selected="true"]` | `.locale-select-option`  | The **applied** locale.                     |
| `[data-active]`          | `.locale-select-option`  | The **keyboard-active** option. Bare attribute, present on at most one option, only while open. |
| `[lang]`                 | `.locale-select-option`  | The option's BCP 47 tag. Usable with `:lang()` for per-script typography. |
| `lang` / `dir`           | `target` (default `<html>`) | The applied locale and direction. Your page-level RTL hook. |

`[aria-selected]` and `[data-active]` are different things and both
need styling. `aria-selected` is "this is the locale in force";
`data-active` is "this is where the keyboard cursor is right now". They
coincide when the listbox first opens and diverge as soon as the user
arrows.

## Positioning the listbox

The minimum that makes the control behave like a popup:

```css
.locale-select {
  position: relative;
  display: inline-block;
}

.locale-select-list {
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

.locale-select-list[hidden] {
  display: none;
}
```

Notes:

- `inset-inline-start` rather than `left` is not optional here. This
  control flips the page to RTL; a popup pinned with `left: 0` will
  anchor to the wrong edge the moment a user picks Arabic — in exactly
  the situation the control exists to serve.
- `max-block-size` plus `overflow-y` matters for long locale lists: the
  component calls `scrollIntoView({ block: "nearest" })` on the active
  option, which only does something useful if the list actually
  scrolls.
- `[hidden]` needs an explicit `display: none` because a `display`
  declaration on a styled `<ul>` overrides the UA's `[hidden]` rule.
  Getting this wrong leaves the closed list permanently visible.

## RTL and logical properties

Every rule you write for this control should use logical properties, so
that it survives the direction switch the control itself performs:

| Physical            | Logical                                   |
| ------------------- | ----------------------------------------- |
| `left` / `right`    | `inset-inline-start` / `inset-inline-end` |
| `margin-left`       | `margin-inline-start`                     |
| `padding-right`     | `padding-inline-end`                      |
| `text-align: left`  | `text-align: start`                       |
| `border-left`       | `border-inline-start`                     |
| `width` / `height`  | `inline-size` / `block-size`              |

A useful test: switch to an RTL locale and confirm the popup still
hangs from the button, the option text still aligns to the reading
edge, and any caret or chevron in the trigger has mirrored.

See [rtl.md](./rtl.md) for what `dir="rtl"` changes beyond CSS.

## Suggested baseline CSS

```css
.locale-select-button {
  padding-block: 0.25rem;
  padding-inline: 0.5rem;
  border: 1px solid var(--color-base-300, currentColor);
  border-radius: var(--radius-selector, 0.25rem);
  background: var(--color-base-100, white);
  color: inherit;
  cursor: pointer;
  line-height: 1;
}

.locale-select-button:focus-visible {
  outline: 2px solid var(--color-primary, currentColor);
  outline-offset: 2px;
}

.locale-select-option {
  padding-block: 0.25rem;
  padding-inline: 0.75rem;
  cursor: pointer;
  text-align: start;
}

/* Where the keyboard cursor is. */
.locale-select-option[data-active] {
  background: var(--color-base-200, #eee);
}

/* Which locale is actually applied. */
.locale-select-option[aria-selected="true"] {
  font-weight: 600;
}
```

Do not convey the applied locale by colour alone (WCAG 1.4.1) — the
weight change above, a checkmark, or a text prefix all work.

## Per-script typography

Options carry `lang`, so `:lang()` can give each script the font and
size it needs. Arabic and Devanagari in particular often need a larger
size than Latin at the same nominal `font-size`:

```css
.locale-select-option:lang(ar),
.locale-select-option:lang(fa),
.locale-select-option:lang(ur) {
  font-family: "Noto Naskh Arabic", system-ui, sans-serif;
  font-size: 1.1em;
}

.locale-select-option:lang(hi),
.locale-select-option:lang(bn) {
  font-family: "Noto Sans Devanagari", system-ui, sans-serif;
}
```

`:lang()` matches on prefix, so `:lang(ar)` also catches `ar-EG`.

Note that the option's `dir` is not set per option — only the target
gets `dir`. If you render endonyms in RTL scripts inside an LTR list,
add `dir="auto"` to the option via CSS-adjacent means or accept the
browser's bidi handling, which is usually correct for a bare name.

## The glyph

`.locale-select-icon` holds a bare Unicode sequence: U+1F310 plus
U+FE0E. Its rendering depends on the fonts installed on the user's
device, and VS15's request for monochrome presentation is a request,
not a guarantee — see
[accessibility.md § Tradeoff 3](./accessibility.md#tradeoff-3--the-glyph-is-font-dependent).

Pin a font stack you have verified, putting a text-presentation font
ahead of any emoji font:

```css
.locale-select-icon {
  font-family: "Segoe UI Symbol", "Apple Symbols", system-ui, sans-serif;
  font-size: 1.125em;
}
```

If you need to guarantee the monochrome look, replace the glyph with an
inline SVG via the `children` snippet.

## Sizing the control

The whole point of the icon button is that it is one glyph wide
regardless of the locale list, so there is nothing to cap. The
`field-sizing: content` recipe from 0.3.0 is obsolete along with the
`<select>` it sized.

The listbox is what now needs a width decision, since it is absolutely
positioned and will otherwise shrink-wrap to its content — which for a
list mixing "Welsh" and "English (United States)" is jumpy:

```css
.locale-select-list {
  min-inline-size: 14rem;
}
```

## The status line

The closed control shows only a glyph, so the active locale is not
written anywhere visible on the page unless you write it. The
recommended pattern pairs the select with a polite live region — see
[accessibility.md § The status region](./accessibility.md#the-status-region).
The component does not render it; you do, with the
`.locale-select-status` hook:

```svelte
<p class="locale-select-status" aria-live="polite">
    Active language:
    <span lang={bcp47LocaleTag(locale)}>{localeName(locale)}</span>
</p>
```

Keep it **visible** by default — that is now the main reason to have
it, and it matters more here than for a theme select, because the
active locale is only self-evident to someone who can read the page:

```css
.locale-select-status {
  margin-block-start: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-base-content, inherit);
}
```

If a design genuinely cannot spare the space, hide it **visually only**
— keep the element in the DOM and keep `aria-live`, so it still
announces:

```css
.locale-select-status {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
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
- Don't forget `.locale-select-list[hidden] { display: none; }`.
- Don't use physical properties. This control flips `dir`.
- Don't style only `[aria-selected]` and skip `[data-active]`, or
  keyboard users lose their cursor.
- Don't override the component's `aria-*` or `lang` attributes from CSS
  or rest-props. They are part of the accessibility contract.

---

Lily™ and Lily Design System™ are trademarks.
