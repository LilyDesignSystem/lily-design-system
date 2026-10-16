# Luxury

Dark near-black page (`#09090b`) with a white primary, navy secondary and plum accent. Shadows on, 1rem box radius.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `luxury` |
| Stylesheet | [`themes/luxury.css`](../../../../themes/luxury.css) |
| Token source | [`themes/tokens/luxury.json`](../../../../themes/tokens/luxury.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#ffffff` (neutral grey) |
| Page surface | `#09090b` |
| Body text on page surface | `#dca54d`, 9.0:1 |
| Text pairs at AAA (7:1) | 11 of 11 |
| Text pairs below AA (4.5:1) | 0 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(14.08% 0.004 285.822)` | `#09090b` | page surface |
| `--color-base-200` | `oklch(20.22% 0.004 308.229)` | `#171618` | panels, cards, table headers |
| `--color-base-300` | `oklch(23.22% 0.004 308.229)` | `#1e1d1f` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(75.69% 0.123 76.89)` | `#dca54d` | body text |
| `--color-primary` | `oklch(100% 0 0)` | `#ffffff` | primary action, focus intent |
| `--color-primary-content` | `oklch(20% 0 0)` | `#161616` | text on primary |
| `--color-secondary` | `oklch(27.58% 0.064 261.069)` | `#152747` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(85.52% 0.012 261.069)` | `#cbd0d7` | text on secondary |
| `--color-accent` | `oklch(36.67% 0.051 338.825)` | `#513448` | sparing emphasis |
| `--color-accent-content` | `oklch(87.33% 0.01 338.825)` | `#dad3d7` | text on accent |
| `--color-neutral` | `oklch(24.27% 0.057 59.825)` | `#331800` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(93.2% 0.089 90.861)` | `#ffe7a4` | text on neutral |
| `--color-info` | `oklch(79.06% 0.121 237.133)` | `#67c6ff` | informational |
| `--color-info-content` | `oklch(15.81% 0.024 237.133)` | `#040e16` | text on info |
| `--color-success` | `oklch(78.12% 0.192 132.154)` | `#87d03a` | success, confirmation |
| `--color-success-content` | `oklch(15.62% 0.038 132.154)` | `#061001` | text on success |
| `--color-warning` | `oklch(86.13% 0.136 102.891)` | `#e2d563` | warning, caution |
| `--color-warning-content` | `oklch(17.23% 0.027 102.891)` | `#121003` | text on warning |
| `--color-error` | `oklch(71.75% 0.176 22.568)` | `#ff6f6f` | error, destructive |
| `--color-error-content` | `oklch(14.35% 0.035 22.568)` | `#160404` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `1rem` (16px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0.5rem` (8px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `1rem` (16px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `1` | shadows on |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 9.03:1 | AAA |
| `--color-base-content` on `--color-base-200` | 8.19:1 | AAA |
| `--color-base-content` on `--color-base-300` | 7.62:1 | AAA |
| `--color-primary-content` on `--color-primary` | 18.10:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 9.58:1 | AAA |
| `--color-accent-content` on `--color-accent` | 7.38:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 13.54:1 | AAA |
| `--color-info-content` on `--color-info` | 10.28:1 | AAA |
| `--color-success-content` on `--color-success` | 10.27:1 | AAA |
| `--color-warning-content` on `--color-warning` | 12.65:1 | AAA |
| `--color-error-content` on `--color-error` | 7.36:1 | AAA |

11 of 11 text pairs reach AAA (7:1). Every pair reaches at least AA (4.5:1).

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: luxury

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="luxury">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/luxury.css" data-lily-theme-picker>
<html data-theme="luxury">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="luxury"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/luxury.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
