# Business

Dark charcoal page (`#202020`) with a steel-blue primary (`#1c4e80`), grey-blue secondary and an orange-red accent. Square selectors, 4px fields, flat (no shadows): a sober dark business look.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `business` |
| Stylesheet | [`themes/business.css`](../../../../themes/business.css) |
| Token source | [`themes/tokens/business.json`](../../../../themes/tokens/business.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#1c4e80` (blue) |
| Page surface | `#202020` |
| Body text on page surface | `#cdcdcd`, 10.2:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(24.35% 0 0)` | `#202020` | page surface |
| `--color-base-200` | `oklch(22.65% 0 0)` | `#1c1c1c` | panels, cards, table headers |
| `--color-base-300` | `oklch(20.94% 0 0)` | `#181818` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(84.87% 0 0)` | `#cdcdcd` | body text |
| `--color-primary` | `oklch(41.7% 0.099 251.473)` | `#1c4e80` | primary action, focus intent |
| `--color-primary-content` | `oklch(88.34% 0.019 251.473)` | `#d0dae5` | text on primary |
| `--color-secondary` | `oklch(64.09% 0.027 229.389)` | `#7c909a` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(12.82% 0.005 229.389)` | `#050708` | text on secondary |
| `--color-accent` | `oklch(67.27% 0.167 35.791)` | `#ea6947` | sparing emphasis |
| `--color-accent-content` | `oklch(13.45% 0.033 35.791)` | `#130402` | text on accent |
| `--color-neutral` | `oklch(27.44% 0.013 253.041)` | `#23282e` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(85.49% 0.002 253.041)` | `#cecfd0` | text on neutral |
| `--color-info` | `oklch(62.62% 0.143 240.033)` | `#0391d5` | informational |
| `--color-info-content` | `oklch(12.52% 0.028 240.033)` | `#000710` | text on info |
| `--color-success` | `oklch(70.23% 0.094 156.596)` | `#6bb187` | success, confirmation |
| `--color-success-content` | `oklch(14.04% 0.018 156.596)` | `#040b07` | text on success |
| `--color-warning` | `oklch(77.48% 0.115 81.519)` | `#dbae5a` | warning, caution |
| `--color-warning-content` | `oklch(15.5% 0.023 81.519)` | `#110b03` | text on warning |
| `--color-error` | `oklch(51.61% 0.146 29.674)` | `#ac3e31` | error, destructive |
| `--color-error-content` | `oklch(90.32% 0.029 29.674)` | `#f2d8d4` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0rem` (0px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.25rem` (4px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 10.25:1 | AAA |
| `--color-base-content` on `--color-base-200` | 10.72:1 | AAA |
| `--color-base-content` on `--color-base-300` | 11.17:1 | AAA |
| `--color-primary-content` on `--color-primary` | 6.06:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 6.07:1 | AA |
| `--color-accent-content` on `--color-accent` | 6.32:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 9.52:1 | AAA |
| `--color-info-content` on `--color-info` | 5.80:1 | AA |
| `--color-success-content` on `--color-success` | 7.82:1 | AAA |
| `--color-warning-content` on `--color-warning` | 9.52:1 | AAA |
| `--color-error-content` on `--color-error` | 4.46:1 | AA large |

6 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-error-content` on `--color-error` 4.46:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: business

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="business">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/business.css" data-lily-theme-picker>
<html data-theme="business">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="business"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/business.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
