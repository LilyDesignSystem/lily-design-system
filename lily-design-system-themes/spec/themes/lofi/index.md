# Lofi

Light theme on white with near-black primary (`#0d0d0d`) and grey companions: a minimalist, monochrome look with a 2rem selector radius.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `lofi` |
| Stylesheet | [`themes/lofi.css`](../../../../themes/lofi.css) |
| Token source | [`themes/tokens/lofi.json`](../../../../themes/tokens/lofi.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#0d0d0d` (neutral grey) |
| Page surface | `#ffffff` |
| Body text on page surface | `#000000`, 21.0:1 |
| Text pairs at AAA (7:1) | 11 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(97% 0 0)` | `#f5f5f5` | panels, cards, table headers |
| `--color-base-300` | `oklch(94% 0 0)` | `#ebebeb` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(0% 0 0)` | `#000000` | body text |
| `--color-primary` | `oklch(15.91% 0 0)` | `#0d0d0d` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(21.45% 0.001 17.278)` | `#1a1919` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(100% 0 0)` | `#ffffff` | text on secondary |
| `--color-accent` | `oklch(26.86% 0 0)` | `#262626` | sparing emphasis |
| `--color-accent-content` | `oklch(100% 0 0)` | `#ffffff` | text on accent |
| `--color-neutral` | `oklch(0% 0 0)` | `#000000` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(100% 0 0)` | `#ffffff` | text on neutral |
| `--color-info` | `oklch(79.54% 0.103 205.9)` | `#5fcfdd` | informational |
| `--color-info-content` | `oklch(15.91% 0.02 205.9)` | `#031011` | text on info |
| `--color-success` | `oklch(90.13% 0.153 164.14)` | `#69fec3` | success, confirmation |
| `--color-success-content` | `oklch(18.03% 0.03 164.14)` | `#04160e` | text on success |
| `--color-warning` | `oklch(88.37% 0.135 79.94)` | `#ffce69` | warning, caution |
| `--color-warning-content` | `oklch(17.67% 0.027 79.94)` | `#170f04` | text on warning |
| `--color-error` | `oklch(78.66% 0.15 28.47)` | `#ff9181` | error, destructive |
| `--color-error-content` | `oklch(15.73% 0.03 28.47)` | `#180706` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `2rem` (32px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.25rem` (4px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0.5rem` (8px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 21.00:1 | AAA |
| `--color-base-content` on `--color-base-200` | 19.26:1 | AAA |
| `--color-base-content` on `--color-base-300` | 17.62:1 | AAA |
| `--color-primary-content` on `--color-primary` | 19.44:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 17.54:1 | AAA |
| `--color-accent-content` on `--color-accent` | 15.13:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 21.00:1 | AAA |
| `--color-info-content` on `--color-info` | 10.55:1 | AAA |
| `--color-success-content` on `--color-success` | 14.71:1 | AAA |
| `--color-warning-content` on `--color-warning` | 12.91:1 | AAA |
| `--color-error-content` on `--color-error` | 8.97:1 | AAA |

11 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: lofi

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="lofi">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/lofi.css" data-lily-theme-picker>
<html data-theme="lofi">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="lofi"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/lofi.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
