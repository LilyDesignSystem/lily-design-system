# Silk

Light theme on a warm off-white page (`#f7f5f3`) with near-black (`#1c1c29`) primary, secondary and accent. 2px borders, a 2rem selector radius and shadows on.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `silk` |
| Stylesheet | [`themes/silk.css`](../../../../themes/silk.css) |
| Token source | [`themes/tokens/silk.json`](../../../../themes/tokens/silk.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#1c1c29` (neutral grey) |
| Page surface | `#f7f5f3` |
| Body text on page surface | `#4b4743`, 8.5:1 |
| Text pairs at AAA (7:1) | 7 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(97% 0.0035 67.78)` | `#f7f5f3` | page surface |
| `--color-base-200` | `oklch(95% 0.0081 61.42)` | `#f3ede9` | panels, cards, table headers |
| `--color-base-300` | `oklch(90% 0.0081 61.42)` | `#e2ddd9` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(40% 0.0081 61.42)` | `#4b4743` | body text |
| `--color-primary` | `oklch(23.27% 0.0249 284.3)` | `#1c1c29` | primary action, focus intent |
| `--color-primary-content` | `oklch(94.22% 0.2505 117.44)` | `#e1ff00` | text on primary |
| `--color-secondary` | `oklch(23.27% 0.0249 284.3)` | `#1c1c29` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(73.92% 0.2135 50.94)` | `#ff7700` | text on secondary |
| `--color-accent` | `oklch(23.27% 0.0249 284.3)` | `#1c1c29` | sparing emphasis |
| `--color-accent-content` | `oklch(88.92% 0.2061 189.9)` | `#00fff8` | text on accent |
| `--color-neutral` | `oklch(20% 0 0)` | `#161616` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(80% 0.0081 61.42)` | `#c2bdb9` | text on neutral |
| `--color-info` | `oklch(80.39% 0.1148 241.68)` | `#78c8ff` | informational |
| `--color-info-content` | `oklch(30.39% 0.1148 241.68)` | `#003162` | text on info |
| `--color-success` | `oklch(83.92% 0.0901 136.87)` | `#afd89e` | success, confirmation |
| `--color-success-content` | `oklch(23.92% 0.0901 136.87)` | `#052800` | text on success |
| `--color-warning` | `oklch(83.92% 0.1085 80)` | `#efc375` | warning, caution |
| `--color-warning-content` | `oklch(43.92% 0.1085 80)` | `#714900` | text on warning |
| `--color-error` | `oklch(75.1% 0.1814 22.37)` | `#ff7878` | error, destructive |
| `--color-error-content` | `oklch(35.1% 0.1814 22.37)` | `#800001` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `2rem` (32px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `2px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 8.46:1 | AAA |
| `--color-base-content` on `--color-base-200` | 7.93:1 | AAA |
| `--color-base-content` on `--color-base-300` | 6.83:1 | AA |
| `--color-primary-content` on `--color-primary` | 14.83:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 6.33:1 | AA |
| `--color-accent-content` on `--color-accent` | 13.35:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 9.71:1 | AAA |
| `--color-info-content` on `--color-info` | 7.12:1 | AAA |
| `--color-success-content` on `--color-success` | 10.03:1 | AAA |
| `--color-warning-content` on `--color-warning` | 4.80:1 | AA |
| `--color-error-content` on `--color-error` | 4.28:1 | AA large |

7 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-error-content` on `--color-error` 4.28:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: silk

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="silk">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/silk.css" data-lily-theme-picker>
<html data-theme="silk">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="silk"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/silk.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
