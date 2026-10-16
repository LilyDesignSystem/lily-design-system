# Cmyk

Light theme on white built from print colours: cyan-blue primary (`#45aeee`), magenta secondary (`#e8488a`) and yellow accent (`#fff234`). Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `cmyk` |
| Stylesheet | [`themes/cmyk.css`](../../../../themes/cmyk.css) |
| Token source | [`themes/tokens/cmyk.json`](../../../../themes/tokens/cmyk.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#45aeee` (blue) |
| Page surface | `#ffffff` |
| Body text on page surface | `#161616`, 18.1:1 |
| Text pairs at AAA (7:1) | 8 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(95% 0 0)` | `#eeeeee` | panels, cards, table headers |
| `--color-base-300` | `oklch(90% 0 0)` | `#dedede` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(20% 0 0)` | `#161616` | body text |
| `--color-primary` | `oklch(71.77% 0.133 239.443)` | `#45aeee` | primary action, focus intent |
| `--color-primary-content` | `oklch(14.35% 0.026 239.443)` | `#020b13` | text on primary |
| `--color-secondary` | `oklch(64.48% 0.202 359.339)` | `#e8488a` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(12.9% 0.04 359.339)` | `#130207` | text on secondary |
| `--color-accent` | `oklch(94.23% 0.189 105.306)` | `#fff234` | sparing emphasis |
| `--color-accent-content` | `oklch(18.84% 0.037 105.306)` | `#161401` | text on accent |
| `--color-neutral` | `oklch(21.78% 0 0)` | `#1a1a1a` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(84.36% 0 0)` | `#cbcbcb` | text on neutral |
| `--color-info` | `oklch(68.47% 0.094 217.284)` | `#4ba8c0` | informational |
| `--color-info-content` | `oklch(13.7% 0.018 217.284)` | `#020a0d` | text on info |
| `--color-success` | `oklch(46.95% 0.162 321.406)` | `#823290` | success, confirmation |
| `--color-success-content` | `oklch(89.39% 0.032 321.406)` | `#e6d5e9` | text on success |
| `--color-warning` | `oklch(71.24% 0.159 52.023)` | `#ee8134` | warning, caution |
| `--color-warning-content` | `oklch(14.25% 0.031 52.023)` | `#130601` | text on warning |
| `--color-error` | `oklch(62.01% 0.208 28.717)` | `#e93f33` | error, destructive |
| `--color-error-content` | `oklch(12.4% 0.041 28.717)` | `#130101` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 18.10:1 | AAA |
| `--color-base-content` on `--color-base-200` | 15.60:1 | AAA |
| `--color-base-content` on `--color-base-300` | 13.45:1 | AAA |
| `--color-primary-content` on `--color-primary` | 8.06:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 5.51:1 | AA |
| `--color-accent-content` on `--color-accent` | 15.87:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 10.73:1 | AAA |
| `--color-info-content` on `--color-info` | 7.28:1 | AAA |
| `--color-success-content` on `--color-success` | 5.36:1 | AA |
| `--color-warning-content` on `--color-warning` | 7.42:1 | AAA |
| `--color-error-content` on `--color-error` | 5.06:1 | AA |

8 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: cmyk

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="cmyk">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/cmyk.css" data-lily-theme-picker>
<html data-theme="cmyk">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="cmyk"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/cmyk.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
