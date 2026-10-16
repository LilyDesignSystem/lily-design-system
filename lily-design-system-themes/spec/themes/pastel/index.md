# Pastel

Light theme on white with a pastel-lilac primary (`#e9d4ff`), blush secondary and mint accent. 2px borders, 2rem field radius. Light fills carry dark text.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `pastel` |
| Stylesheet | [`themes/pastel.css`](../../../../themes/pastel.css) |
| Token source | [`themes/tokens/pastel.json`](../../../../themes/tokens/pastel.json) |
| Colour scheme | `light` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#e9d4ff` (purple) |
| Page surface | `#ffffff` |
| Body text on page surface | `#161616`, 18.1:1 |
| Text pairs at AAA (7:1) | 3 of 11 |
| Text pairs below AA (4.5:1) | 7 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(100% 0 0)` | `#ffffff` | page surface |
| `--color-base-200` | `oklch(98.46% 0.001 247.838)` | `#f9fafb` | panels, cards, table headers |
| `--color-base-300` | `oklch(92.46% 0.001 247.838)` | `#e5e6e7` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(20% 0 0)` | `#161616` | body text |
| `--color-primary` | `oklch(90% 0.063 306.703)` | `#e9d4ff` | primary action, focus intent |
| `--color-primary-content` | `oklch(49% 0.265 301.924)` | `#8000d9` | text on primary |
| `--color-secondary` | `oklch(89% 0.058 10.001)` | `#feccd2` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(51% 0.222 16.935)` | `#c50035` | text on secondary |
| `--color-accent` | `oklch(90% 0.093 164.15)` | `#a3f2ce` | sparing emphasis |
| `--color-accent-content` | `oklch(50% 0.118 165.612)` | `#007853` | text on accent |
| `--color-neutral` | `oklch(55% 0.046 257.417)` | `#61738d` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(92% 0.013 255.508)` | `#dfe5ed` | text on neutral |
| `--color-info` | `oklch(86% 0.127 207.078)` | `#51e8fb` | informational |
| `--color-info-content` | `oklch(52% 0.105 223.128)` | `#007595` | text on info |
| `--color-success` | `oklch(87% 0.15 154.449)` | `#7af1a7` | success, confirmation |
| `--color-success-content` | `oklch(52% 0.154 150.069)` | `#008033` | text on success |
| `--color-warning` | `oklch(83% 0.128 66.29)` | `#ffb667` | warning, caution |
| `--color-warning-content` | `oklch(55% 0.195 38.402)` | `#c93400` | text on warning |
| `--color-error` | `oklch(80% 0.114 19.571)` | `#ff9fa0` | error, destructive |
| `--color-error-content` | `oklch(50% 0.213 27.518)` | `#bf0004` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `2rem` (32px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `2px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 18.10:1 | AAA |
| `--color-base-content` on `--color-base-200` | 17.32:1 | AAA |
| `--color-base-content` on `--color-base-300` | 14.48:1 | AAA |
| `--color-primary-content` on `--color-primary` | 5.25:1 | AA |
| `--color-secondary-content` on `--color-secondary` | 4.32:1 | AA large |
| `--color-accent-content` on `--color-accent` | 4.24:1 | AA large |
| `--color-neutral-content` on `--color-neutral` | 3.81:1 | AA large |
| `--color-info-content` on `--color-info` | 3.59:1 | AA large |
| `--color-success-content` on `--color-success` | 3.62:1 | AA large |
| `--color-warning-content` on `--color-warning` | 3.05:1 | AA large |
| `--color-error-content` on `--color-error` | 3.33:1 | AA large |

3 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-secondary-content` on `--color-secondary` 4.32:1; `--color-accent-content` on `--color-accent` 4.24:1; `--color-neutral-content` on `--color-neutral` 3.81:1; `--color-info-content` on `--color-info` 3.59:1; `--color-success-content` on `--color-success` 3.62:1; `--color-warning-content` on `--color-warning` 3.05:1; `--color-error-content` on `--color-error` 3.33:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: pastel

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="pastel">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/pastel.css" data-lily-theme-picker>
<html data-theme="pastel">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="pastel"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/pastel.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
