# Styling

The select is headless: it ships no CSS. Every visual decision belongs
to the consumer. This guide lists the hooks the select exposes.

## Class hooks

| Selector                     | Element                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `.locale-picker`            | The root `<div>`.                                                                                        |
| `.locale-picker.{CssClass}` | Both classes when `CssClass` is passed.                                                                  |
| `.locale-picker-button`     | The icon `<button>` that opens the listbox.                                                              |
| `.locale-picker-icon`       | The `<span>` wrapping the default glyph. **Absent** when you supply `ChildContent`.                      |
| `.locale-picker-list`       | The `<ul role="listbox">`. Carries `hidden` while closed. **Needs positioning CSS — see below.**         |
| `.locale-picker-option`     | Each `<li role="option">`. Also carries its own `lang`.                                                  |
| `.locale-picker-status`     | The consumer-rendered status region echoing the active locale. Not emitted by the component — see below. |

The old `.locale-picker-placeholder` hook is **gone**. There is no
placeholder option any more; the control is a button plus a listbox.

If you pass a `ChildContent` fragment it replaces the glyph inside the
button, so `.locale-picker-icon` disappears while every other hook
stays.

## State hooks

| Selector                                       | Meaning                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `.locale-picker-list[hidden]`                 | The listbox is closed.                                           |
| `.locale-picker-button[aria-expanded="true"]` | The listbox is open.                                             |
| `.locale-picker-option[aria-selected="true"]` | The active locale — the current selection.                       |
| `.locale-picker-option[data-active]`          | The keyboard-active option (the `aria-activedescendant` target). |

`[data-active]` and `[aria-selected]` are different things and both need
a style. `[aria-selected]` is _what is chosen_; `[data-active]` is
_where the arrow keys are_. Focus sits on the `<ul>`, never on an
option, so without a `[data-active]` cue a sighted keyboard user cannot
see where they are.

## Attribute hooks

| Attribute        | On          | Purpose                                                    |
| ---------------- | ----------- | ---------------------------------------------------------- |
| `lang="<bcp47>"` | `<html>`    | Active language for the whole document.                    |
| `dir="ltr\|rtl"` | `<html>`    | Writing direction; omitted when `ApplyDir` is false.       |
| `lang="<bcp47>"` | each `<li>` | Per-option language, so endonyms are pronounced correctly. |

The per-option `lang` is also a styling hook, which is the part people
miss. It lets you select on language without adding classes:

```css
/* Give CJK options a font stack that actually has the glyphs. */
.locale-picker-option:lang(zh),
.locale-picker-option:lang(ja),
.locale-picker-option:lang(ko) {
  font-family: var(--font-cjk, system-ui);
}

/* Arabic and Hebrew endonyms usually want a slightly larger size. */
.locale-picker-option:lang(ar),
.locale-picker-option:lang(he) {
  font-size: 1.0625em;
}
```

## The list needs positioning CSS — the package ships none

This is the one piece of CSS the control does not work well without.
The `<ul>` is an ordinary in-flow element, so an open listbox will push
the rest of your page down unless you take it out of flow yourself:

```css
.locale-picker {
  position: relative;
  display: inline-block;
}

.locale-picker-list {
  position: absolute;
  z-index: 10;
  inset-block-start: 100%;
  inset-inline-start: 0; /* logical: mirrors correctly under RTL */
  min-width: 100%;
  max-height: 16rem;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}
```

Logical properties matter more here than anywhere else in the design
system: this control is the thing that flips `dir`. If you anchor the
list with `left: 0`, then selecting Arabic mirrors the page but leaves
the dropdown hanging off the wrong edge of its own button. Use
`inset-inline-start` and the list follows the direction it just set.

## Suggested baseline CSS

Drop into the consumer's app stylesheet (e.g. `wwwroot/css/site.css`),
on top of the positioning block above:

```css
.locale-picker-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* The glyph is a font character; reserve a stable target even if
       the platform substitutes or drops it. */
  min-inline-size: 2.25rem;
  min-block-size: 2.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-base-300, currentColor);
  border-radius: var(--radius-selector, 0.25rem);
  background: var(--color-base-100, white);
  color: var(--color-base-content, currentColor);
  cursor: pointer;
  line-height: 1;
}

.locale-picker-icon {
  font-size: 1.125rem;
}

.locale-picker-list {
  border: 1px solid var(--color-base-300, currentColor);
  border-radius: var(--radius-selector, 0.25rem);
  background: var(--color-base-100, white);
  color: var(--color-base-content, currentColor);
}

.locale-picker-option {
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  /* Endonyms are mixed-script; keep each option's own direction. */
  text-align: start;
}

.locale-picker-option[aria-selected="true"] {
  font-weight: 600;
}

.locale-picker-option[data-active],
.locale-picker-option:hover {
  background: var(--color-primary, Highlight);
  color: var(--color-primary-content, HighlightText);
}

.locale-picker-button:focus-visible,
.locale-picker-list:focus-visible {
  outline: 2px solid var(--color-primary, currentColor);
  outline-offset: 2px;
}
```

### The monochrome globe

The default glyph is U+1F310 GLOBE WITH MERIDIANS followed by U+FE0E
VARIATION SELECTOR-15. VS15 asks for the _text_ presentation so the
globe renders in the current text colour rather than as a blue colour-
emoji, matching ThemePicker's `◑`.

Some platforms honour VS15 only partially. If you see a colour globe
where you want a monochrome one, the reliable fix is to name a text
font ahead of the emoji font:

```css
.locale-picker-icon {
  font-family: "Segoe UI Symbol", "Noto Sans Symbols 2", system-ui, sans-serif;
}
```

Because `.locale-picker-icon` inherits `color`, a monochrome glyph
follows your theme automatically — which is the reason to want it.

## The status region

The closed control shows only a glyph, never the active language, so
the recommended pattern pairs it with a status region that echoes the
selection. You render that element yourself; the component does not
emit it. Use the `.locale-picker-status` hook so the class name stays
consistent across the design system:

```razor
<div class="locale-picker-wrapper">
    <LocalePicker Label="Language" Locales="@codes" @bind-Value="locale" />
    <span class="locale-picker-status" aria-live="polite">
        <span lang="@Locales.Bcp47LocaleTag(locale)">@LocaleLabels[locale]</span>
    </span>
</div>
```

Give the status text its own `lang`, exactly as the options have one —
otherwise "Français" gets announced with an English voice.

```css
.locale-picker-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
```

### Visually-hidden variant

If the design has no room for visible status text, keep it for screen
readers only rather than dropping it:

```css
.locale-picker-status.visually-hidden {
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

## Don'ts

- **Don't `display: none` the whole `.locale-picker`** when you drive
  it from an external control. A `display: none` subtree can stop
  `FocusAsync` from working and removes the control from the
  accessibility tree entirely. Visually hide `.locale-picker-button`
  instead — see [`ExternalButtons.razor`](../examples/ExternalButtons.razor).
- **Don't remove the focus outline** without replacing it. Focus lives
  on the `<ul>` while the list is open; with no visible ring a keyboard
  user has no idea the listbox has focus.
- **Don't style `[aria-selected]` only.** See the state-hooks note
  above: you need `[data-active]` too.
- **Don't set `direction` on `.locale-picker-list` from a class.** The
  per-option `lang` plus the document `dir` already do the right thing.
- **Don't hard-code a width sized to English labels.** Endonyms vary
  wildly in length; let the list size to content and cap it with
  `max-width` if needed.

## Blazor scoped CSS

Blazor's scoped CSS (`MyPage.razor.css`) adds a `b-xxxxx` attribute to
elements _your component_ renders — not to elements rendered inside a
child component. So a plain `.locale-picker-option { … }` rule in a
scoped stylesheet will not match.

Use `::deep` from a wrapper element you own:

```razor
<div class="locale-picker-wrapper">
    <LocalePicker Label="Language" Locales="@codes" @bind-Value="locale" />
</div>
```

```css
/* MyPage.razor.css */
.locale-picker-wrapper ::deep .locale-picker-button {
  border-radius: 999px;
}

.locale-picker-wrapper ::deep .locale-picker-option[data-active] {
  background: var(--color-primary, Highlight);
}
```

Global styles in `wwwroot/css/site.css` need no `::deep` and are
usually the simpler choice for a control shared across pages.

## Multiple selects in one page

Multiple locale selects all write the same `<html lang>` — they are
views onto one shared document state, not independent controls. That is
usually what you want; give each a distinct `Name` for form
participation and style them together:

```razor
<LocalePicker Name="header-locale" CssClass="locale-picker-compact" ... />
<LocalePicker Name="footer-locale" CssClass="locale-picker-wide" ... />
```

```css
.locale-picker-compact .locale-picker-button {
  padding: 0.125rem 0.375rem;
}
.locale-picker-wide .locale-picker-list {
  min-width: 14rem;
}
```

Keep their `Locales` lists and `Value` bindings in sync, or the two
controls will disagree about what is selected. See
[`ScopedTarget.razor`](../examples/ScopedTarget.razor).

## CSS custom property bridge

If your design system carries tokens as custom properties, bridge them
once and let the hooks read through:

```css
.locale-picker {
  --locale-picker-bg: var(--color-base-100, white);
  --locale-picker-fg: var(--color-base-content, currentColor);
  --locale-picker-border: var(--color-base-300, currentColor);
}

.locale-picker-button,
.locale-picker-list {
  background: var(--locale-picker-bg);
  color: var(--locale-picker-fg);
  border-color: var(--locale-picker-border);
}
```

That keeps the control themeable by ThemePicker: when `data-theme`
changes on `<html>`, the tokens change and the locale select follows
without any extra wiring.

## See also

- [`accessibility.md`](accessibility.md) — focus, contrast, High
  Contrast Mode, and the tradeoffs of a custom listbox.
- [`rtl.md`](rtl.md) — what `dir="rtl"` changes and how to author CSS
  that survives both directions.
- [`custom-rendering.md`](custom-rendering.md) — replacing the glyph.

---

Lily™ and Lily Design System™ are trademarks.
