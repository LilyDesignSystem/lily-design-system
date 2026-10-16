# Adobe Spectrum

Adobe Spectrum colour foundations as a Lily theme: Spectrum blue (`#1473e6`) primary, a deeper blue secondary and a magenta accent (`#d83790`) on white with neutral greys. 4px fields and selectors, 8px boxes, shadows on. The reference for the hex-token themes in this family.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `adobe-spectrum` |
| Stylesheet | [`themes/adobe-spectrum.css`](../../../../themes/adobe-spectrum.css) |
| Token source | [`themes/tokens/adobe-spectrum.json`](../../../../themes/tokens/adobe-spectrum.json) |
| Colour scheme | `light` |
| Group | Design-system reference |
| Primary | `#1473e6` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#222222`, 15.9:1 |
| Text pairs at AAA (7:1) | 4 of 11 |
| Text pairs below AA (4.5:1) | 2 of 11 |

## Upstream

- **Source:** Adobe Spectrum (https://spectrum.adobe.com/)
- **Tracks:** Adobe Spectrum (Spectrum 2 era, 2026) colour foundations.
- **Affiliation:** Independent implementation against Lily class hooks; not affiliated with or endorsed by Adobe.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `#ffffff` | `#ffffff` | page surface |
| `--color-base-200` | `#f5f5f5` | `#f5f5f5` | panels, cards, table headers |
| `--color-base-300` | `#e1e1e1` | `#e1e1e1` | dividers, hover rows, borders |
| `--color-base-content` | `#222222` | `#222222` | body text |
| `--color-primary` | `#1473e6` | `#1473e6` | primary action, focus intent |
| `--color-primary-content` | `#ffffff` | `#ffffff` | text on primary |
| `--color-secondary` | `#0d66d0` | `#0d66d0` | hover and secondary chrome |
| `--color-secondary-content` | `#ffffff` | `#ffffff` | text on secondary |
| `--color-accent` | `#d83790` | `#d83790` | sparing emphasis |
| `--color-accent-content` | `#ffffff` | `#ffffff` | text on accent |
| `--color-neutral` | `#2c2c2c` | `#2c2c2c` | footer, code, tooltips |
| `--color-neutral-content` | `#ffffff` | `#ffffff` | text on neutral |
| `--color-info` | `#1473e6` | `#1473e6` | informational |
| `--color-info-content` | `#ffffff` | `#ffffff` | text on info |
| `--color-success` | `#2d9d78` | `#2d9d78` | success, confirmation |
| `--color-success-content` | `#ffffff` | `#ffffff` | text on success |
| `--color-warning` | `#e68619` | `#e68619` | warning, caution |
| `--color-warning-content` | `#222222` | `#222222` | text on warning |
| `--color-error` | `#d7373f` | `#d7373f` | error, destructive |
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
| `--color-base-content` on `--color-base-100` | 15.91:1 | AAA |
| `--color-base-content` on `--color-base-200` | 14.59:1 | AAA |
| `--color-base-content` on `--color-base-300` | 12.17:1 | AAA |
| `--color-primary-content` on `--color-primary` | 4.54:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 5.49:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.31:1 | AA large |
| `--color-neutral-content` on `--color-neutral` | 13.97:1 | AAA |
| `--color-info-content` on `--color-info` | 4.54:1 | AA |
| `--color-success-content` on `--color-success` | 3.38:1 | AA large |
| `--color-warning-content` on `--color-warning` | 5.90:1 | AA |
| `--color-error-content` on `--color-error` | 4.66:1 | AA |

4 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-accent-content` on `--color-accent` 4.31:1; `--color-success-content` on `--color-success` 3.38:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: adobe-spectrum

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: Adobe Spectrum (https://spectrum.adobe.com/)

Upstream tracked: Adobe Spectrum (Spectrum 2 era, 2026) colour foundations.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="light">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/adobe-spectrum.css" data-lily-theme-picker>
<html data-theme="adobe-spectrum">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="adobe-spectrum"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/adobe-spectrum.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
