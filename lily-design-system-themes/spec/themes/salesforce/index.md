# Salesforce

Salesforce Lightning Design System as a Lily theme: brand blue (`#0176d3`), dark-blue secondary (`#014486`), teal accent and the `#032d60` navy neutral on white with the `#f3f3f3` background and `#c9c9c9` border. 4px fields, 8px cards, light depth.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `salesforce` |
| Stylesheet | [`themes/salesforce.css`](../../../../themes/salesforce.css) |
| Token source | [`themes/tokens/salesforce.json`](../../../../themes/tokens/salesforce.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#0176d3` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#181818`, 17.8:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** Salesforce (https://www.lightningdesignsystem.com/)
- **Tracks:** Salesforce Lightning Design System (2026) global colour tokens: brand, status, neutral backgrounds.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f3f3f3` | `#f3f3f3` | panels, cards, table headers |
| `--color-base-300` | `#c9c9c9` | `#c9c9c9` | dividers, hover rows, borders |
| `--color-base-content` | `#181818` | `#181818` | body text |
| `--color-primary` | `#0176d3` | `#0176d3` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#014486` | `#014486` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#06a59a` | `#06a59a` | sparing emphasis |
| `--color-accent-content` | `#181818` | `#181818` | text on accent |
| `--color-neutral` | `#032d60` | `#032d60` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0176d3` | `#0176d3` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#2e844a` | `#2e844a` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#fe9339` | `#fe9339` | warning, caution |
| `--color-warning-content` | `#181818` | `#181818` | text on warning |
| `--color-error` | `#ba0517` | `#ba0517` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 17.76:1 | AAA |
| `--color-base-content` on `--color-base-200` | 16.00:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.72:1 | AAA |
| `--color-primary-content` on `--color-primary` | 4.63:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 9.67:1 | AAA |
| `--color-accent-content` on `--color-accent` | 5.80:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 13.56:1 | AAA |
| `--color-info-content` on `--color-info` | 4.63:1 | AA |
| `--color-success-content` on `--color-success` | 4.65:1 | AA |
| `--color-warning-content` on `--color-warning` | 7.99:1 | AAA |
| `--color-error-content` on `--color-error` | 6.73:1 | AA |

6 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: salesforce

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Salesforce (https://www.lightningdesignsystem.com/)

Upstream tracked: Salesforce Lightning Design System (2026) global colour tokens: brand, status, neutral backgrounds.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/salesforce.css" data-lily-theme-picker>
<html data-theme="salesforce">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="salesforce"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/salesforce.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
