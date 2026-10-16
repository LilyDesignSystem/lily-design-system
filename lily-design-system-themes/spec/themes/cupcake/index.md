# Cupcake

Light theme on a warm off-white page (`#faf7f5`) with an aqua primary (`#44ebd3`), pink secondary and peach accent. Pillowy 2rem field radius and 2px borders.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `cupcake` |
| Stylesheet | [`themes/cupcake.css`](../../../../themes/cupcake.css) |
| Token source | [`themes/tokens/cupcake.json`](../../../../themes/tokens/cupcake.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#44ebd3` (teal) |
| Page surface | `#faf7f5` |
| Body text on page surface | `#291334`, 15.9:1 |
| Text pairs at AAA (7:1) | 5 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(97.79% 0.004 56.375)` | `#faf7f5` | page surface |
| `--color-base-200` | `oklch(93.98% 0.007 61.449)` | `#efeae6` | panels, cards, table headers |
| `--color-base-300` | `oklch(91.59% 0.006 53.44)` | `#e7e2df` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(23.57% 0.066 313.189)` | `#291334` | body text |
| `--color-primary` | `oklch(85% 0.138 181.071)` | `#44ebd3` | primary action, focus intent |
| `--color-primary-content` | `oklch(43% 0.078 188.216)` | `#005d58` | text on primary |
| `--color-secondary` | `oklch(89% 0.061 343.231)` | `#f9cbe5` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(45% 0.187 3.815)` | `#a0004a` | text on secondary |
| `--color-accent` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | sparing emphasis |
| `--color-accent-content` | `oklch(47% 0.157 37.304)` | `#9f2d00` | text on accent |
| `--color-neutral` | `oklch(27% 0.006 286.033)` | `#262629` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(92% 0.004 286.32)` | `#e4e4e7` | text on neutral |
| `--color-info` | `oklch(68% 0.169 237.323)` | `#00a4f2` | informational |
| `--color-info-content` | `oklch(29% 0.066 243.157)` | `#042e49` | text on info |
| `--color-success` | `oklch(69% 0.17 162.48)` | `#00ba7b` | success, confirmation |
| `--color-success-content` | `oklch(26% 0.051 172.552)` | `#002c21` | text on success |
| `--color-warning` | `oklch(79% 0.184 86.047)` | `#eeaf00` | warning, caution |
| `--color-warning-content` | `oklch(28% 0.066 53.813)` | `#411e03` | text on warning |
| `--color-error` | `oklch(64% 0.246 16.439)` | `#fe1c55` | error, destructive |
| `--color-error-content` | `oklch(27% 0.105 12.094)` | `#4d0218` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `2rem` (32px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `2px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 15.92:1 | AAA |
| `--color-base-content` on `--color-base-200` | 14.21:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.21:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.20:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 5.67:1 | AA |
| `--color-accent-content` on `--color-accent` | 5.41:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 11.89:1 | AAA |
| `--color-info-content` on `--color-info` | 5.09:1 | AA |
| `--color-success-content` on `--color-success` | 6.01:1 | AA |
| `--color-warning-content` on `--color-warning` | 7.63:1 | AAA |
| `--color-error-content` on `--color-error` | 4.12:1 | AA large |

5 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-error-content` on `--color-error` 4.12:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: cupcake

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="cupcake">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/cupcake.css" data-lily-theme-picker>
<html data-theme="cupcake">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="cupcake"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/cupcake.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
