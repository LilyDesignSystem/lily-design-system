# Retro

Light theme on a parchment page (`#ece3ca`) with a salmon primary (`#ff9fa0`), mint secondary and ochre accent. Flat, 4px selectors.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `retro` |
| Stylesheet | [`themes/retro.css`](../../../../themes/retro.css) |
| Token source | [`themes/tokens/retro.json`](../../../../themes/tokens/retro.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#ff9fa0` (red) |
| Page surface | `#ece3ca` |
| Body text on page surface | `#793205`, 7.2:1 |
| Text pairs at AAA (7:1) | 1 of 11 |
| Text pairs below AA (4.5:1) | 4 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(91.64% 0.034 90.515)` | `#ece3ca` | page surface |
| `--color-base-200` | `oklch(88.27% 0.049 91.774)` | `#e4d8b4` | panels, cards, table headers |
| `--color-base-300` | `oklch(84.13% 0.065 90.856)` | `#dbca9b` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(41% 0.112 45.904)` | `#793205` | body text |
| `--color-primary` | `oklch(80% 0.114 19.571)` | `#ff9fa0` | primary action, focus intent |
| `--color-primary-content` | `oklch(39% 0.141 25.723)` | `#801518` | text on primary |
| `--color-secondary` | `oklch(92% 0.084 155.995)` | `#b7f6cd` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(44% 0.119 151.328)` | `#00642e` | text on secondary |
| `--color-accent` | `oklch(68% 0.162 75.834)` | `#d08700` | sparing emphasis |
| `--color-accent-content` | `oklch(41% 0.112 45.904)` | `#793205` | text on accent |
| `--color-neutral` | `oklch(44% 0.011 73.639)` | `#56524c` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(86% 0.005 56.366)` | `#d4d0ce` | text on neutral |
| `--color-info` | `oklch(58% 0.158 241.966)` | `#0082ce` | informational |
| `--color-info-content` | `oklch(96% 0.059 95.617)` | `#fef2c6` | text on info |
| `--color-success` | `oklch(51% 0.096 186.391)` | `#00776f` | success, confirmation |
| `--color-success-content` | `oklch(96% 0.059 95.617)` | `#fef2c6` | text on success |
| `--color-warning` | `oklch(64% 0.222 41.116)` | `#f34700` | warning, caution |
| `--color-warning-content` | `oklch(96% 0.059 95.617)` | `#fef2c6` | text on warning |
| `--color-error` | `oklch(70% 0.191 22.216)` | `#ff6266` | error, destructive |
| `--color-error-content` | `oklch(40% 0.123 38.172)` | `#7c2808` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0.25rem` (4px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 7.22:1 | AAA |
| `--color-base-content` on `--color-base-200` | 6.51:1 | AA |
| `--color-base-content` on `--color-base-300` | 5.69:1 | AA |
| `--color-primary-content` on `--color-primary` | 5.26:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 5.97:1 | AA |
| `--color-accent-content` on `--color-accent` | 3.15:1 | AA large |
| `--color-neutral-content` on `--color-neutral` | 5.07:1 | AA |
| `--color-info-content` on `--color-info` | 3.68:1 | AA large |
| `--color-success-content` on `--color-success` | 4.84:1 | AA |
| `--color-warning-content` on `--color-warning` | 3.28:1 | AA large |
| `--color-error-content` on `--color-error` | 3.32:1 | AA large |

1 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-accent-content` on `--color-accent` 3.15:1; `--color-info-content` on `--color-info` 3.68:1; `--color-warning-content` on `--color-warning` 3.28:1; `--color-error-content` on `--color-error` 3.32:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: retro

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="retro">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/retro.css" data-lily-theme-picker>
<html data-theme="retro">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="retro"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/retro.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
