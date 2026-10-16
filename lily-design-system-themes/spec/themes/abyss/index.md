# Abyss

Dark theme on a deep blue-green base (`#001e29`) with an acid-lime primary (`#bdff00`) and a lavender secondary. A large 2rem selector radius and shadows on give it a rounded, glowing look.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `abyss` |
| Stylesheet | [`themes/abyss.css`](../../../../themes/abyss.css) |
| Token source | [`themes/tokens/abyss.json`](../../../../themes/tokens/abyss.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#bdff00` (green) |
| Page surface | `#001e29` |
| Body text on page surface | `#ffd6a7`, 12.7:1 |
| Text pairs at AAA (7:1) | 6 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(20% 0.08 209)` | `#001e29` | page surface |
| `--color-base-200` | `oklch(15% 0.08 209)` | `#00111d` | panels, cards, table headers |
| `--color-base-300` | `oklch(10% 0.08 209)` | `#000611` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | body text |
| `--color-primary` | `oklch(92% 0.2653 125)` | `#bdff00` | primary action, focus intent |
| `--color-primary-content` | `oklch(50% 0.2653 125)` | `#427600` | text on primary |
| `--color-secondary` | `oklch(83.27% 0.0764 298.3)` | `#cebef4` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(43.27% 0.0764 298.3)` | `#564775` | text on secondary |
| `--color-accent` | `oklch(43% 0 0)` | `#505050` | sparing emphasis |
| `--color-accent-content` | `oklch(98% 0 0)` | `#f8f8f8` | text on accent |
| `--color-neutral` | `oklch(30% 0.08 209)` | `#003843` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(90% 0.076 70.697)` | `#ffd6a7` | text on neutral |
| `--color-info` | `oklch(74% 0.16 232.661)` | `#00bafe` | informational |
| `--color-info-content` | `oklch(29% 0.066 243.157)` | `#042e49` | text on info |
| `--color-success` | `oklch(79% 0.209 151.711)` | `#01df72` | success, confirmation |
| `--color-success-content` | `oklch(26% 0.065 152.934)` | `#022d14` | text on success |
| `--color-warning` | `oklch(84.8% 0.1962 84.62)` | `#ffbf00` | warning, caution |
| `--color-warning-content` | `oklch(44.8% 0.1962 84.62)` | `#854200` | text on warning |
| `--color-error` | `oklch(65% 0.1985 24.22)` | `#f04e4f` | error, destructive |
| `--color-error-content` | `oklch(27% 0.1985 24.22)` | `#690000` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `2rem` (32px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 12.67:1 | AAA |
| `--color-base-content` on `--color-base-200` | 14.05:1 | AAA |
| `--color-base-content` on `--color-base-300` | 14.92:1 | AAA |
| `--color-primary-content` on `--color-primary` | 4.57:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 4.81:1 | AA |
| `--color-accent-content` on `--color-accent` | 7.59:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 9.37:1 | AAA |
| `--color-info-content` on `--color-info` | 6.34:1 | AA |
| `--color-success-content` on `--color-success` | 8.50:1 | AAA |
| `--color-warning-content` on `--color-warning` | 4.58:1 | AA |
| `--color-error-content` on `--color-error` | 3.69:1 | AA large |

6 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-error-content` on `--color-error` 3.69:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: abyss

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="abyss">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/abyss.css" data-lily-theme-picker>
<html data-theme="abyss">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="abyss"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/abyss.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
