# Black

Pure-black page (`#000000`) with dark grey (`#3a3a3a`) primary, secondary and accent, square corners (radius 0) and no shadows. A monochrome, minimal dark theme.

## At a glance

| | |
| --- | --- |
| Slug / `data-theme` | `black` |
| Stylesheet | [`themes/black.css`](../../../../themes/black.css) |
| Token source | [`themes/tokens/black.json`](../../../../themes/tokens/black.json) |
| Colour scheme | `dark` |
| Group | General purpose (DaisyUI palette set) |
| Primary | `#3a3a3a` (neutral grey) |
| Page surface | `#000000` |
| Body text on page surface | `#d6d6d6`, 14.4:1 |
| Text pairs at AAA (7:1) | 8 of 11 |
| Text pairs below AA (4.5:1) | 1 of 11 |

## Upstream

- **Source:** DaisyUI (https://daisyui.com/)
- **Tracks:** DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.

## Palette

| Token | Value | sRGB | Role |
| --- | --- | --- | --- |
| `--color-base-100` | `oklch(0% 0 0)` | `#000000` | page surface |
| `--color-base-200` | `oklch(19% 0 0)` | `#141414` | panels, cards, table headers |
| `--color-base-300` | `oklch(22% 0 0)` | `#1b1b1b` | dividers, hover rows, borders |
| `--color-base-content` | `oklch(87.61% 0 0)` | `#d6d6d6` | body text |
| `--color-primary` | `oklch(35% 0 0)` | `#3a3a3a` | primary action, focus intent |
| `--color-primary-content` | `oklch(100% 0 0)` | `#ffffff` | text on primary |
| `--color-secondary` | `oklch(35% 0 0)` | `#3a3a3a` | hover and secondary chrome |
| `--color-secondary-content` | `oklch(100% 0 0)` | `#ffffff` | text on secondary |
| `--color-accent` | `oklch(35% 0 0)` | `#3a3a3a` | sparing emphasis |
| `--color-accent-content` | `oklch(100% 0 0)` | `#ffffff` | text on accent |
| `--color-neutral` | `oklch(35% 0 0)` | `#3a3a3a` | footer, code, tooltips |
| `--color-neutral-content` | `oklch(100% 0 0)` | `#ffffff` | text on neutral |
| `--color-info` | `oklch(45.2% 0.313 264.052)` | `#0000ff` | informational |
| `--color-info-content` | `oklch(89.04% 0.062 264.052)` | `#c6dbff` | text on info |
| `--color-success` | `oklch(51.98% 0.176 142.495)` | `#028002` | success, confirmation |
| `--color-success-content` | `oklch(90.39% 0.035 142.495)` | `#d3e6d0` | text on success |
| `--color-warning` | `oklch(96.8% 0.211 109.769)` | `#ffff00` | warning, caution |
| `--color-warning-content` | `oklch(19.36% 0.042 109.769)` | `#161600` | text on warning |
| `--color-error` | `oklch(62.8% 0.257 29.233)` | `#ff0301` | error, destructive |
| `--color-error-content` | `oklch(12.56% 0.051 29.233)` | `#160000` | text on error |

## Shape and depth

| Token | Value | Applied to |
| --- | --- | --- |
| `--radius-selector` | `0rem` (0px) | chips, badges, switches, checkbox and radio containers |
| `--radius-field` | `0rem` (0px) | inputs, buttons, menu items, tooltips |
| `--radius-box` | `0rem` (0px) | cards, dialogs, drawers, hero blocks |
| `--border` | `1px` | stroke weight everywhere |
| `--depth` | `0` | flat: no shadows |
| `--noise` | `0` | no texture |

## Contrast

| Pair | Ratio | Level |
| --- | ---: | --- |
| `--color-base-content` on `--color-base-100` | 14.45:1 | AAA |
| `--color-base-content` on `--color-base-200` | 12.68:1 | AAA |
| `--color-base-content` on `--color-base-300` | 11.85:1 | AAA |
| `--color-primary-content` on `--color-primary` | 11.37:1 | AAA |
| `--color-secondary-content` on `--color-secondary` | 11.37:1 | AAA |
| `--color-accent-content` on `--color-accent` | 11.37:1 | AAA |
| `--color-neutral-content` on `--color-neutral` | 11.37:1 | AAA |
| `--color-info-content` on `--color-info` | 6.13:1 | AA |
| `--color-success-content` on `--color-success` | 3.91:1 | AA large |
| `--color-warning-content` on `--color-warning` | 17.02:1 | AAA |
| `--color-error-content` on `--color-error` | 5.09:1 | AA |

8 of 11 text pairs reach AAA (7:1). Below AA (4.5:1): `--color-success-content` on `--color-success` 3.91:1. These are the theme author's colours; Lily never rewrites them, and `bin/check-theme --contrast` reports the same pairs.

## Behaviour beyond the tokens

None. This theme changes only the token block above; every component rule below it is the one all themes share, so the same markup renders in any theme and only these values differ.

## Design notes (from the stylesheet header)

Verbatim from the top of the stylesheet. File names quoted in it may predate the `for-patients` / `for-practitioners` naming.

```text
Lily theme: black

Standalone Lily Design System theme — declares the theme tokens and inlines
the component CSS for all 492 Lily components, so this single file is the
only stylesheet required to render a Lily-styled page.

Credit for the theme source: DaisyUI (https://daisyui.com/)

Upstream tracked: DaisyUI v5-era theme palette, adapted to Lily tokens and hooks.
========================================================================= */

Theme tokens — the colour, radius, border, and depth variables consumed
by every Lily component rule below. The theme applies by default (`:root`)
and also when explicitly opted into via `<html data-theme="black">`,
so multiple themes can coexist in one document and be switched at runtime
by updating the `data-theme` attribute. */
```

## Usage

```html
<link rel="stylesheet" href="/themes/black.css" data-lily-theme-picker>
<html data-theme="black">
```

`theme-picker` loads this stylesheet by swapping the managed `<link>`'s `href` and setting `data-theme="black"` on the document root; `picker-bar` lists it by default. Installed from npm: `@lilydesignsystem/themes/black.css`. The stylesheet is standalone: every Lily component rule is inlined, in `@layer lily` with zero-specificity `:where()` selectors, so application CSS always wins.

## Related

- [Themes index](../../index.md) — the package contract.
- [AGENTS/theme.md](../../../../AGENTS/theme.md) — token shape and the headless forbidden list.
- [spec/theme](../../../../spec/theme/index.md) — the theme topic.
- [spec/theme-picker](../../../../spec/theme-picker/index.md) — runtime switching.
