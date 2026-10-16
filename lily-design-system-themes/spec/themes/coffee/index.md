# Coffee

Dark aubergine-brown page (`#261b25`) with an amber primary (`#db924c`), dark-teal secondary and deep-cyan accent. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `coffee` |
| Stylesheet | [`themes/coffee.css`](../../../../themes/coffee.css) |
| Token source | [`themes/tokens/coffee.json`](../../../../themes/tokens/coffee.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#db924c` (yellow) |
| Page surface | `#261b25` |
| Body text on page surface | `#c59f61`, 6.7:1 |
| Text pairs at AAA (7:1) | 9 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(24% 0.023 329.708)` | `#261b25` | page surface |
| `--color-base-200` | `oklch(21% 0.021 329.708)` | `#1e151d` | panels, cards, table headers |
| `--color-base-300` | `oklch(16% 0.019 329.708)` | `#120a11` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(72.35% 0.092 79.129)` | `#c59f61` | body text |
| `--color-primary` | `oklch(72% 0.123 62.756)` | `#db924c` | primary action, focus intent |
| `--color-primary-content` | `oklch(14.4% 0.024 62.756)` | `#110802` | text on primary |
| `--color-secondary` | `oklch(34.47% 0.029 199.194)` | `#273e3f` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(86.89% 0.005 199.194)` | `#d0d5d5` | text on secondary |
| `--color-accent` | `oklch(42.62% 0.074 224.389)` | `#11576d` | sparing emphasis |
| `--color-accent-content` | `oklch(88.52% 0.014 224.389)` | `#d0dbe0` | text on accent |
| `--color-neutral` | `oklch(16.51% 0.015 326.261)` | `#120c12` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(83.3% 0.003 326.261)` | `#c9c7c9` | text on neutral |
| `--color-info` | `oklch(79.49% 0.063 184.558)` | `#8ecac1` | informational |
| `--color-info-content` | `oklch(15.9% 0.012 184.558)` | `#070f0e` | text on info |
| `--color-success` | `oklch(74.72% 0.072 131.116)` | `#9db787` | success, confirmation |
| `--color-success-content` | `oklch(14.94% 0.014 131.116)` | `#090c07` | text on success |
| `--color-warning` | `oklch(88.15% 0.14 87.722)` | `#ffd260` | warning, caution |
| `--color-warning-content` | `oklch(17.63% 0.028 87.722)` | `#161003` | text on warning |
| `--color-error` | `oklch(77.32% 0.128 31.871)` | `#fc9581` | error, destructive |
| `--color-error-content` | `oklch(15.46% 0.025 31.871)` | `#150806` | text on error |

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
| `--color-base-content` on `--color-base-100` | 6.72:1 | AA |
| `--color-base-content` on `--color-base-200` | 7.21:1 | AAA |
| `--color-base-content` on `--color-base-300` | 7.90:1 | AAA |
| `--color-primary-content` on `--color-primary` | 7.77:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 7.67:1 | AAA |
| `--color-accent-content` on `--color-accent` | 5.71:1 | AA |
| `--color-neutral-content` on `--color-neutral` | 11.50:1 | AAA |
| `--color-info-content` on `--color-info` | 10.49:1 | AAA |
| `--color-success-content` on `--color-success` | 8.95:1 | AAA |
| `--color-warning-content` on `--color-warning` | 13.19:1 | AAA |
| `--color-error-content` on `--color-error` | 9.12:1 | AAA |

9 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: coffee

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="coffee">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/coffee.css" data-lily-theme-picker>
<html data-theme="coffee">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="coffee"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/coffee.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
