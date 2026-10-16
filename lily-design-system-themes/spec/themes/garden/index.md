# Garden

Light grey page (`#e9e7e7`) with a hot-pink primary (`#fe0075`), plum secondary and sage-green accent. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `garden` |
| Stylesheet | [`themes/garden.css`](../../../../themes/garden.css) |
| Token source | [`themes/tokens/garden.json`](../../../../themes/tokens/garden.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#fe0075` (red) |
| Page surface | `#e9e7e7` |
| Body text on page surface | `#100f0f`, 15.5:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 2 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(92.95% 0.002 17.197)` | `#e9e7e7` | page surface |
| `--color-base-200` | `oklch(86.44% 0.002 17.197)` | `#d4d2d2` | panels, cards, table headers |
| `--color-base-300` | `oklch(79.94% 0.001 17.197)` | `#bebdbd` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(16.96% 0.001 17.32)` | `#100f0f` | body text |
| `--color-primary` | `oklch(62.45% 0.278 3.836)` | `#fe0075` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(48.49% 0.11 355.095)` | `#8e4162` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(89.7% 0.022 355.095)` | `#ead7de` | text on secondary |
| `--color-accent` | `oklch(56.27% 0.054 154.39)` | `#5c7f67` | sparing emphasis |
| `--color-accent-content` | `oklch(100% 0 0)` | `#ffffff` | text on accent |
| `--color-neutral` | `oklch(24.16% 0.049 89.07)` | `#291e00` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(92.95% 0.002 17.197)` | `#e9e7e7` | text on neutral |
| `--color-info` | `oklch(72.06% 0.191 231.6)` | `#00b5ff` | informational |
| `--color-info-content` | `oklch(0% 0 0)` | `#000000` | text on info |
| `--color-success` | `oklch(64.8% 0.15 160)` | `#00a96e` | success, confirmation |
| `--color-success-content` | `oklch(0% 0 0)` | `#000000` | text on success |
| `--color-warning` | `oklch(84.71% 0.199 83.87)` | `#ffbe00` | warning, caution |
| `--color-warning-content` | `oklch(0% 0 0)` | `#000000` | text on warning |
| `--color-error` | `oklch(71.76% 0.221 22.18)` | `#ff5861` | error, destructive |
| `--color-error-content` | `oklch(0% 0 0)` | `#000000` | text on error |

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
| `--color-base-content` on `--color-base-100` | 15.54:1 | AAA |
| `--color-base-content` on `--color-base-200` | 12.71:1 | AAA |
| `--color-base-content` on `--color-base-300` | 10.21:1 | AAA |
| `--color-primary-content` on `--color-primary` | 3.84:1 | AA large |
| `--color-secondary-content` on `--color-secondary` | 4.95:1 | AA |
| `--color-accent-content` on `--color-accent` | 4.48:1 | AA large |
| `--color-neutral-content` on `--color-neutral` | 13.32:1 | AAA |
| `--color-info-content` on `--color-info` | 9.05:1 | AAA |
| `--color-success-content` on `--color-success` | 6.90:1 | AA |
| `--color-warning-content` on `--color-warning` | 12.62:1 | AAA |
| `--color-error-content` on `--color-error` | 6.82:1 | AA |

6 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-primary-content` on `--color-primary` 3.84:1; `--color-accent-content` on `--color-accent` 4.48:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: garden

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="garden">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/garden.css" data-lily-theme-picker>
<html data-theme="garden">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="garden"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/garden.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
