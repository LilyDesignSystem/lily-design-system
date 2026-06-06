# Styling

The picker is headless: it ships no CSS. Every visual decision
belongs to the consumer. This guide lists the hooks the picker
exposes.

## Class hooks

| Selector                                             | Element                              |
| ---------------------------------------------------- | ------------------------------------ |
| `.theme-picker`                                      | The root `<fieldset role="radiogroup">`. |
| `.theme-picker.{CssClass}`                           | Both classes when `CssClass` is passed. |
| `.theme-picker > .theme-picker-option`               | Each `<label>` wrapping a radio.     |
| `.theme-picker-option > input[type="radio"]`         | The native radio input.              |
| `.theme-picker-option > .theme-picker-option-label`  | The visible option text.             |

If you pass a `ChildContent` fragment, only `.theme-picker` is
guaranteed on the root; the inner classes are up to your markup.

## Attribute hooks

| Attribute                          | On                  | Purpose                          |
| ---------------------------------- | ------------------- | -------------------------------- |
| `data-theme="<slug>"`              | `<html>`            | Active theme indicator for theme CSS files. |
| `data-lily-theme-picker="<name>"`  | the managed `<link>`        | Discriminator for multiple pickers. |

## Suggested baseline CSS

Drop into the consumer's app stylesheet (e.g.
`wwwroot/css/site.css`):

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
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--radius-selector, 0.25rem);
    cursor: pointer;
}

.theme-picker-option:has(:checked) {
    background: var(--color-primary, currentColor);
    color: var(--color-primary-content, white);
}

.theme-picker-option:focus-within {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

## Don'ts

- Don't hide the radio inputs with `display: none`. They are the
  accessibility tree's anchor point. Use `clip-path` or a
  `.sr-only` recipe if you need to render only the labels.
- Don't override the picker's `aria-*` attributes from CSS. They
  are part of the accessibility contract.
- Don't add Blazor scoped CSS (`.razor.css` files) targeting the
  picker's internal elements — the picker is in a different
  assembly so the `b-XXXX` scoped attribute won't match. Use a
  global stylesheet or the `:deep()` selector inside a wrapping
  component's scoped CSS.

## Blazor scoped CSS

Blazor's CSS isolation (`{Component}.razor.css` next to a `.razor`
file) scopes the styles to the component's elements via a generated
`b-XXXX` attribute. The picker is in a different assembly, so its
elements won't receive your scoped attribute.

To target the picker's elements from a wrapping component's scoped
CSS, use `::deep`:

```razor
<!-- MyPage.razor -->
<div class="my-page">
    <ThemePicker Label="Theme" ... />
</div>
```

```css
/* MyPage.razor.css */
.my-page ::deep .theme-picker-option {
    /* targets descendants without scoping the selector */
}
```

The `::deep` combinator is Blazor's scoped-CSS escape hatch.

## CSS custom property bridge

Theme CSS files scope their rules to `:root[data-theme="<slug>"]`,
which means CSS custom properties get re-bound on each theme change.
The picker doesn't write custom properties itself; it just toggles
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

## Multiple pickers in one page

Each picker gets a distinct `Name` so the managed `<link>` elements
don't collide. The active `data-theme` on `<html>` is whichever
picker fired last. To scope a picker to one page region, use a CSS
class on a wrapper and select against that:

```razor
<section class="settings-region">
    <ThemePicker Name="settings-theme" ... />
</section>

<section class="preview-region">
    <ThemePicker Name="preview-theme" ... />
</section>
```

The two pickers share `<html data-theme>` but render their own
fieldsets. To keep them truly independent, scope your theme CSS to
`.settings-region[data-theme]` etc. and update those attributes
yourself via `OnChange` handlers.

## Theming the picker itself

The picker is a control, not a theme target — it doesn't read
`data-theme` and doesn't need to. Style it once and the theme CSS
re-skins everything else around it.

If you do want the picker's own appearance to change with the
theme, set its colours via `var(--color-*)` custom properties in
your CSS:

```css
.theme-picker-option:has(:checked) {
    background: var(--color-primary);  /* re-binds on theme change */
    color: var(--color-primary-content);
}
```
