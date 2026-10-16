# Sunset

Dark teal-black page (`#121c22`) with an orange primary (`#ff865b`), pink secondary and violet accent. Flat, 1rem radii.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `sunset` |
| Stylesheet | [`themes/sunset.css`](../../../../themes/sunset.css) |
| Token source | [`themes/tokens/sunset.json`](../../../../themes/tokens/sunset.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#ff865b` (orange) |
| Page surface | `#121c22` |
| Body text on page surface | `#9fb9d0`, 8.5:1 |
| Text pairs at AAA (7:1) | 10 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(22% 0.019 237.69)` | `#121c22` | page surface |
| `--color-base-200` | `oklch(20% 0.019 237.69)` | `#0e171e` | panels, cards, table headers |
| `--color-base-300` | `oklch(18% 0.019 237.69)` | `#091319` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(77.38% 0.043 245.096)` | `#9fb9d0` | body text |
| `--color-primary` | `oklch(74.7% 0.158 39.947)` | `#ff865b` | primary action, focus intent |
| `--color-primary-content` | `oklch(14.94% 0.031 39.947)` | `#160603` | text on primary |
| `--color-secondary` | `oklch(72.54% 0.177 2.72)` | `#fd6f9c` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(14.51% 0.035 2.72)` | `#160409` | text on secondary |
| `--color-accent` | `oklch(71.29% 0.166 299.844)` | `#b387fa` | sparing emphasis |
| `--color-accent-content` | `oklch(14.26% 0.033 299.844)` | `#0c0615` | text on accent |
| `--color-neutral` | `oklch(26% 0.019 237.69)` | `#1b262c` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(70% 0.019 237.69)` | `#94a0a9` | text on neutral |
| `--color-info` | `oklch(85.56% 0.085 206.015)` | `#89e0eb` | informational |
| `--color-info-content` | `oklch(17.11% 0.017 206.015)` | `#071213` | text on info |
| `--color-success` | `oklch(85.56% 0.085 144.778)` | `#addfad` | success, confirmation |
| `--color-success-content` | `oklch(17.11% 0.017 144.778)` | `#0b120b` | text on success |
| `--color-warning` | `oklch(85.57% 0.084 74.427)` | `#f1c892` | warning, caution |
| `--color-warning-content` | `oklch(17.11% 0.016 74.427)` | `#140f08` | text on warning |
| `--color-error` | `oklch(85.51% 0.078 16.886)` | `#ffbbbd` | error, destructive |
| `--color-error-content` | `oklch(17.1% 0.015 16.886)` | `#160d0d` | text on error |

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
| `--color-base-content` on `--color-base-100` | 8.50:1 | AAA |
| `--color-base-content` on `--color-base-200` | 8.90:1 | AAA |
| `--color-base-content` on `--color-base-300` | 9.23:1 | AAA |
| `--color-primary-content` on `--color-primary` | 8.30:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 7.51:1 | AAA |
| `--color-accent-content` on `--color-accent` | 7.38:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 5.78:1 | AA |
| `--color-info-content` on `--color-info` | 12.60:1 | AAA |
| `--color-success-content` on `--color-success` | 12.60:1 | AAA |
| `--color-warning-content` on `--color-warning` | 12.18:1 | AAA |
| `--color-error-content` on `--color-error` | 11.93:1 | AAA |

10 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: sunset

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="sunset">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/sunset.css" data-lily-theme-picker>
<html data-theme="sunset">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="sunset"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/sunset.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
