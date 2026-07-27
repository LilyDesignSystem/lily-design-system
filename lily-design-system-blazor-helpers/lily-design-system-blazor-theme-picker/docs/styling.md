# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the select
exposes.

## Class hooks

| Selector                    | Element                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `.theme-chooser`             | The root `<div>`.                                                                                      |
| `.theme-chooser.{CssClass}`  | Both classes when `CssClass` is passed.                                                                |
| `.theme-chooser-button`      | The icon `<button>` that opens the listbox.                                                            |
| `.theme-chooser-icon`        | The `<span>` wrapping the default glyph. **Absent** when you supply `ChildContent`.                    |
| `.theme-chooser-list`        | The `<ul role="listbox">`. Carries `hidden` while closed. **Needs positioning CSS — see below.**       |
| `.theme-chooser-option`      | Each `<li role="option">`.                                                                             |
| `.theme-chooser-status`      | The consumer-rendered status region echoing the active theme. Not emitted by the component — see below. |

The old `.theme-chooser-placeholder` hook is **gone**. There is no
placeholder option any more; the control is a button plus a listbox.

If you pass a `ChildContent` fragment it replaces the glyph inside the
button, so `.theme-chooser-icon` disappears while every other hook
stays.

## State hooks

| Selector                              | Meaning                                                     |
| ------------------------------------- | ----------------------------------------------------------- |
| `.theme-chooser-list[hidden]`          | The listbox is closed.                                       |
| `.theme-chooser-button[aria-expanded="true"]` | The listbox is open.                                  |
| `.theme-chooser-option[aria-selected="true"]` | The active theme — the current selection.             |
| `.theme-chooser-option[data-active]`   | The keyboard-active option (the `aria-activedescendant` target). |

`[data-active]` and `[aria-selected]` are different things and both
need a style. `[aria-selected]` is *what is chosen*; `[data-active]` is
*where the arrow keys are*. Focus sits on the `<ul>`, never on an
option, so without a `[data-active]` cue a sighted keyboard user cannot
see where they are.

## Attribute hooks

| Attribute                          | On                  | Purpose                          |
| ---------------------------------- | ------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `<html>`            | Active theme indicator for theme CSS files. |
| `data-lily-theme-chooser="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

## The list needs positioning CSS — the package ships none

This is the one piece of CSS the control does not work well without.
The `<ul>` is an ordinary in-flow element, so an open listbox will push
the rest of your page down unless you take it out of flow yourself:

```css
.theme-chooser {
    position: relative;
    display: inline-block;
}

.theme-chooser-list {
    position: absolute;
    z-index: 10;
    inset-block-start: 100%;
    inset-inline-start: 0;   /* logical: mirrors correctly under RTL */
    min-width: 100%;
    max-height: 16rem;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
}
```

Use logical properties (`inset-inline-start`, not `left`) so the list
stays anchored when the document `dir` flips.

## Suggested baseline CSS

Drop into the consumer's app stylesheet (e.g.
`wwwroot/css/site.css`), on top of the positioning block above:

```css
.theme-chooser-button {
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

.theme-chooser-icon {
    font-size: 1.125rem;
}

.theme-chooser-list {
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, white);
    color: var(--color-base-content, currentColor);
}

.theme-chooser-option {
    padding: 0.25rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
}

.theme-chooser-option[aria-selected="true"] {
    font-weight: 600;
}

.theme-chooser-option[data-active],
.theme-chooser-option:hover {
    background: var(--color-primary, Highlight);
    color: var(--color-primary-content, HighlightText);
}

.theme-chooser-button:focus-visible,
.theme-chooser-list:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

## The status region

The closed control shows only a glyph, never the active theme, so the
recommended pattern pairs it with a status region that echoes the
selection. You render that element yourself; the component does not
emit it. Use the `.theme-chooser-status` hook so the class name stays
consistent across the design system:

```razor
<ThemeChooser Label="Theme" @bind-Value="theme" ... />
<p class="theme-chooser-status" aria-live="polite">Active theme: @label</p>
```

Style it as ordinary text. It is **visible by default** — sighted users
have lost the selection readout too, so hiding it helps no one:

```css
.theme-chooser-status {
    margin-block-start: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-base-content, currentColor);
}
```

### Visually-hidden variant

Only if the layout genuinely cannot spare the space, keep the element in
the DOM and hide it visually. Never use `display: none` or
`visibility: hidden` — both remove it from the accessibility tree and
the live region stops announcing:

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

Rationale and the full tradeoff:
[accessibility.md](./accessibility.md#the-status-region-is-still-the-recommended-pattern).

## Don'ts

- Don't hide the options with `display: none`. The `<li role="option">`
  elements are the accessibility tree's anchor point; keep them in the
  DOM. The component's own `hidden` on the `<ul>` is the correct
  mechanism — don't add a second one.
- Don't style `.theme-chooser-list` open/closed by anything other than
  the component's `hidden` attribute. Forcing it visible desynchronises
  it from `aria-expanded`.
- Don't override the control's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't rely on the glyph rendering identically everywhere. It is a
  font character (U+25D1), not a shipped asset; give the button a
  `min-inline-size` / `min-block-size` so it stays a clear target, or
  supply your own `ChildContent` (inline SVG).
- Don't add Blazor scoped CSS (`.razor.css` files) targeting the
  select's internal elements — the select is in a different
  assembly so the `b-XXXX` scoped attribute won't match. Use a
  global stylesheet or the `:deep()` selector inside a wrapping
  component's scoped CSS.

## Blazor scoped CSS

Blazor's CSS isolation (`{Component}.razor.css` next to a `.razor`
file) scopes the styles to the component's elements via a generated
`b-XXXX` attribute. The select is in a different assembly, so its
elements won't receive your scoped attribute.

To target the select's elements from a wrapping component's scoped
CSS, use `::deep`:

```razor
<!-- MyPage.razor -->
<div class="my-page">
    <ThemeChooser Label="Theme" ... />
</div>
```

```css
/* MyPage.razor.css */
.my-page ::deep .theme-chooser-option {
    /* targets descendants without scoping the selector */
}
```

The `::deep` combinator is Blazor's scoped-CSS escape hatch.

## CSS custom property bridge

Theme CSS files scope their rules to `:root[data-theme="<slug>"]`,
which means CSS custom properties get re-bound on each theme change.
The select doesn't write custom properties itself; it just toggles
the `data-theme` attribute and swaps the `<link>` href.

A minimal theme CSS:

```css
:root[data-theme="dark"] {
    --color-base-100: #1d232a;
    --color-base-content: #a6adba;
    --color-primary: #605dff;
    --color-primary-content: #ffffff;
}
```

Your app CSS consumes:

```css
body {
    background: var(--color-base-100);
    color: var(--color-base-content);
}
```

## Multiple selects in one page

Each select gets a distinct `Name` so the managed `<link>` elements
don't collide. The active `data-theme` on `<html>` is whichever
select fired last. To scope a select to one page region, use a CSS
class on a wrapper and select against that:

```razor
<section class="settings-region">
    <ThemeChooser Name="settings-theme" ... />
</section>

<section class="preview-region">
    <ThemeChooser Name="preview-theme" ... />
</section>
```

The two selects share `<html data-theme>` but render their own button +
listbox controls. To keep them truly independent, scope your theme CSS
to `.settings-region[data-theme]` etc. and update those attributes
yourself via `OnChange` handlers.

## Theming the select itself

The select is a control, not a theme target — it doesn't read
`data-theme` and doesn't need to. Style it once and the theme CSS
re-skins everything else around it.

If you do want the select's own appearance to change with the
theme, set its colours via `var(--color-*)` custom properties in
your CSS:

```css
.theme-chooser-button,
.theme-chooser-list {
    background: var(--color-base-100);  /* re-binds on theme change */
    color: var(--color-base-content);
}
```

---

Lily™ and Lily Design System™ are trademarks.
