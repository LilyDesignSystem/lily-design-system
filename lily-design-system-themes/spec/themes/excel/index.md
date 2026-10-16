# Excel

Excel for the web as a Lily theme, for spreadsheet and data-heavy screens: Excel green (`#107c41`) primary, dark-green secondary, a Fluent-blue accent, a white grid surface with the `#d4d4d4` gridline grey and the `#f3f3f3` header fill. Square-ish (2px) corners and no shadows, like a worksheet.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `excel` |
| Stylesheet | [`themes/excel.css`](../../../../themes/excel.css) |
| Token source | [`themes/tokens/excel.json`](../../../../themes/tokens/excel.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#107c41` (teal) |
| Page surface | `#ffffff` |
| Body text on page surface | `#242424`, 15.5:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Excel (https://www.microsoft.com/microsoft-365/excel)
- **Tracks:** Microsoft Excel for the web (2026) with Office / Fluent neutrals: grid lines, ribbon greys, Excel green.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f3f3f3` | `#f3f3f3` | panels, cards, table headers |
| `--color-base-300` | `#d4d4d4` | `#d4d4d4` | dividers, hover rows, borders |
| `--color-base-content` | `#242424` | `#242424` | body text |
| `--color-primary` | `#107c41` | `#107c41` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#185c37` | `#185c37` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#0f6cbd` | `#0f6cbd` | sparing emphasis |
| `--color-accent-content` | `#ffffff` | `#ffffff` | text on accent |
| `--color-neutral` | `#242424` | `#242424` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0f6cbd` | `#0f6cbd` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#107c10` | `#107c10` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#ffb900` | `#ffb900` | warning, caution |
| `--color-warning-content` | `#242424` | `#242424` | text on warning |
| `--color-error` | `#c50f1f` | `#c50f1f` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.125rem` (2px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.125rem` (2px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.25rem` (4px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 15.52:1 | AAA |
| `--color-base-content` on `--color-base-200` | 13.99:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.47:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.27:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 8.00:1 | AAA |
| `--color-accent-content` on `--color-accent` | 5.38:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 15.52:1 | AAA |
| `--color-info-content` on `--color-info` | 5.38:1 | AA |
| `--color-success-content` on `--color-success` | 5.37:1 | AA |
| `--color-warning-content` on `--color-warning` | 9.01:1 | AAA |
| `--color-error-content` on `--color-error` | 6.07:1 | AA |

6 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: excel

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Excel (https://www.microsoft.com/microsoft-365/excel)

Upstream tracked: Microsoft Excel for the web (2026) with Office / Fluent neutrals: grid lines, ribbon greys, Excel green.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/excel.css" data-lily-theme-picker>
<html data-theme="excel">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="excel"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/excel.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
