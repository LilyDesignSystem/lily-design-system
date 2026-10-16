# SAP Fiori

SAP Fiori (Horizon) light theme as a Lily theme: brand blue (`#0070f2`), slate secondary, teal accent and the `#354a5f` shell neutral on white with the `#f5f6f7` background; semantic colours for positive, critical and negative. Rounded Horizon geometry: 4px selectors, 8px fields, 16px boxes.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `sap-fiori` |
| Stylesheet | [`themes/sap-fiori.css`](../../../../themes/sap-fiori.css) |
| Token source | [`themes/tokens/sap-fiori.json`](../../../../themes/tokens/sap-fiori.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#0070f2` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#1d2d3e`, 14.0:1 |
| Text pairs at AAA (7:1) | 4 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** SAP Fiori (https://ui5.sap.com/)
- **Tracks:** SAP Fiori (Horizon, 2026) light theme: brand blue, shell greys, semantic colours.
- **Affiliation:** Independent implementation of public design tokens against Lily class hooks; not affiliated with or endorsed by the owner of the design system or its trademarks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f5f6f7` | `#f5f6f7` | panels, cards, table headers |
| `--color-base-300` | `#d9d9d9` | `#d9d9d9` | dividers, hover rows, borders |
| `--color-base-content` | `#1d2d3e` | `#1d2d3e` | body text |
| `--color-primary` | `#0070f2` | `#0070f2` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#5b738b` | `#5b738b` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#07838f` | `#07838f` | sparing emphasis |
| `--color-accent-content` | `#ffffff` | `#ffffff` | text on accent |
| `--color-neutral` | `#354a5f` | `#354a5f` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#0070f2` | `#0070f2` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#256f3a` | `#256f3a` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#ee6b13` | `#ee6b13` | warning, caution |
| `--color-warning-content` | `#1d2d3e` | `#1d2d3e` | text on warning |
| `--color-error` | `#d20a0a` | `#d20a0a` | error, destructive |
| `--color-error-content` | `#ffffff` | `#ffffff` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 14.03:1 | AAA |
| `--color-base-content` on `--color-base-200` | 12.96:1 | AAA |
| `--color-base-content` on `--color-base-300` | 9.94:1 | AAA |
| `--color-primary-content` on `--color-primary` | 4.57:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 4.92:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.51:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 9.15:1 | AAA |
| `--color-info-content` on `--color-info` | 4.57:1 | AA |
| `--color-success-content` on `--color-success` | 6.15:1 | AA |
| `--color-warning-content` on `--color-warning` | 4.51:1 | AA |
| `--color-error-content` on `--color-error` | 5.54:1 | AA |

4 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Adjustments to the source colours

- `warning`: source `#e76500` could not carry `#1d2d3e` text at 4.5:1, so it is moved along lightness (hue and chroma kept) to `#ee6b13` (4.51:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: sap-fiori

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: SAP Fiori (https://ui5.sap.com/)

Upstream tracked: SAP Fiori (Horizon, 2026) light theme: brand blue, shell greys, semantic colours.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/sap-fiori.css" data-lily-theme-picker>
<html data-theme="sap-fiori">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="sap-fiori"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/sap-fiori.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
