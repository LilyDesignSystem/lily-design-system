# Styling

The select is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the select
exposes.

## Class hooks

| Selector                                  | Element                          |
| ----------------------------------------- | -------------------------------- |
| `.theme-select`                           | The root `<select>`.             |
| `.theme-select.{CssClass}`                | Both classes when `CssClass` is passed. |
| `.theme-select > .theme-select-option`    | Each `<option>`.                 |
| `.theme-select > .theme-select-placeholder` | The leading placeholder `<option>` — the one the closed control always displays. |

If you pass a `ChildContent` fragment, `.theme-select` on the root and
the leading `.theme-select-placeholder` option are still guaranteed
(the placeholder is component-owned and renders in both code paths);
the rest of the inner markup is up to you.

## Attribute hooks

| Attribute                          | On                  | Purpose                          |
| ---------------------------------- | ------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `<html>`            | Active theme indicator for theme CSS files. |
| `data-lily-theme-select="<name>"`  | the managed `<link>`        | Discriminator for multiple selects. |

## Suggested baseline CSS

Drop into the consumer's app stylesheet (e.g.
`wwwroot/css/site.css`):

```css
.theme-select {
    /*
       The closed control always shows the short placeholder word rather
       than the (often long) active theme name, so the select can be
       sized to that word instead of to the widest option.
    */
    field-sizing: content;  /* Chrome 123+: size to the shown option */
    width: auto;
    max-width: 12ch;        /* fallback for Firefox / Safari */

    padding: 0.25rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    background: var(--color-base-100, white);
    color: var(--color-base-content, currentColor);
    cursor: pointer;
}

.theme-select:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

## Don'ts

- Don't hide the options with `display: none`. The native
  `<option>` elements are the accessibility tree's anchor point;
  keep them in the DOM.
- Don't override the select's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
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
    <ThemeSelect Label="Theme" ... />
</div>
```

```css
/* MyPage.razor.css */
.my-page ::deep .theme-select-option {
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
    <ThemeSelect Name="settings-theme" ... />
</section>

<section class="preview-region">
    <ThemeSelect Name="preview-theme" ... />
</section>
```

The two selects share `<html data-theme>` but render their own
`<select>` controls. To keep them truly independent, scope your theme
CSS to `.settings-region[data-theme]` etc. and update those
attributes yourself via `OnChange` handlers.

## Theming the select itself

The select is a control, not a theme target — it doesn't read
`data-theme` and doesn't need to. Style it once and the theme CSS
re-skins everything else around it.

If you do want the select's own appearance to change with the
theme, set its colours via `var(--color-*)` custom properties in
your CSS:

```css
.theme-select {
    background: var(--color-base-100);  /* re-binds on theme change */
    color: var(--color-base-content);
}
```

---

Lily™ and Lily Design System™ are trademarks.
